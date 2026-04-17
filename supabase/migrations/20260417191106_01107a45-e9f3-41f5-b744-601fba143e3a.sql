ALTER TABLE public.portfolio ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT 'neurophoto';
ALTER TABLE public.styles ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT 'neurophoto';
ALTER TABLE public.tariffs ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT 'neurophoto';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT 'neurophoto';

CREATE INDEX IF NOT EXISTS idx_portfolio_service ON public.portfolio(service);
CREATE INDEX IF NOT EXISTS idx_styles_service ON public.styles(service);
CREATE INDEX IF NOT EXISTS idx_tariffs_service ON public.tariffs(service);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON public.reviews(service);