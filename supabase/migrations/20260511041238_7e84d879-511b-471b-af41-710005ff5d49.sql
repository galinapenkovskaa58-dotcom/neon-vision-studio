CREATE TABLE public.video_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.video_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active video portfolio"
  ON public.video_portfolio FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage video portfolio"
  ON public.video_portfolio FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_video_portfolio_updated_at
  BEFORE UPDATE ON public.video_portfolio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_video_portfolio_sort ON public.video_portfolio(sort_order);
CREATE INDEX idx_video_portfolio_category ON public.video_portfolio(category);