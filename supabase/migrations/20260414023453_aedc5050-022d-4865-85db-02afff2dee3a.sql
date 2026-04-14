
INSERT INTO storage.buckets (id, name, public) VALUES ('style-images', 'style-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view style images"
ON storage.objects FOR SELECT
USING (bucket_id = 'style-images');

CREATE POLICY "Admins can upload style images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'style-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update style images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'style-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete style images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'style-images' AND public.has_role(auth.uid(), 'admin'));
