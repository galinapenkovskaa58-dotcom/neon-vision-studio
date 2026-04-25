-- Restrict listing on public buckets: allow direct object reads only when name is known.
-- Drop overly broad SELECT policies and replace with no list policy (object access via public URL still works).

-- review-uploads: keep public read (needed for admin moderation preview by URL); the warning is about listing.
-- Listing requires SELECT on storage.objects. Public URLs use the storage REST endpoint and don't need this policy.
-- However our admin UI may need to list. So restrict listing to admins only.

DROP POLICY IF EXISTS "Public can read review uploads" ON storage.objects;
CREATE POLICY "Admins can list review uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'review-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Same hardening for portfolio + style-images (existing public buckets flagged by linter)
-- Find and drop any overly broad SELECT on these buckets, replace with admin-only listing.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (qual LIKE '%''portfolio''%' OR qual LIKE '%''style-images''%')
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admins can list portfolio bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list style-images bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'style-images' AND public.has_role(auth.uid(), 'admin'));