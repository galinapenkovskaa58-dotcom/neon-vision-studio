CREATE TABLE public.styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  color_from TEXT NOT NULL DEFAULT 'neon-blue',
  color_to TEXT NOT NULL DEFAULT 'neon-cyan',
  icon TEXT DEFAULT '✦',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible styles" ON public.styles
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage styles" ON public.styles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_styles_updated_at
  BEFORE UPDATE ON public.styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();