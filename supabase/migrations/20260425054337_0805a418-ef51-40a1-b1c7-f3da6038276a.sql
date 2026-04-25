-- 1. Reviews: add moderation status, email, submitted_at
DO $$ BEGIN
  CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS status public.review_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz NOT NULL DEFAULT now();

-- Existing reviews are already curated by admin → mark approved
UPDATE public.reviews SET status = 'approved' WHERE status = 'pending';

-- Tighten public read: only approved + visible
DROP POLICY IF EXISTS "Anyone can view visible reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved visible reviews"
ON public.reviews FOR SELECT TO public
USING (is_visible = true AND status = 'approved');

-- 2. Promocodes
DO $$ BEGIN
  CREATE TYPE public.promocode_source AS ENUM ('review', 'portfolio');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.portfolio_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  client_name text NOT NULL,
  description text,
  media_urls text[] NOT NULL DEFAULT '{}',
  external_link text,
  status public.review_status NOT NULL DEFAULT 'pending',
  review_id uuid REFERENCES public.reviews(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit portfolio entry"
ON public.portfolio_submissions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Admins can view portfolio submissions"
ON public.portfolio_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio submissions"
ON public.portfolio_submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio submissions"
ON public.portfolio_submissions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER portfolio_submissions_updated
BEFORE UPDATE ON public.portfolio_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.promocodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  source public.promocode_source NOT NULL,
  is_used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  used_for_booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  review_id uuid REFERENCES public.reviews(id) ON DELETE SET NULL,
  portfolio_submission_id uuid REFERENCES public.portfolio_submissions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promocodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view promocodes"
ON public.promocodes FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update promocodes"
ON public.promocodes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete promocodes"
ON public.promocodes FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
-- No public INSERT policy → only service_role (edge function) can insert

-- 3. Storage bucket for review uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-uploads', 'review-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read review uploads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'review-uploads');

CREATE POLICY "Anyone can upload review files"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'review-uploads');

CREATE POLICY "Admins can delete review uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'review-uploads' AND public.has_role(auth.uid(), 'admin'));