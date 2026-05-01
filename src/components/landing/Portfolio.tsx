import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

type PortfolioItem = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url: string;
  image_urls?: string[] | null;
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: items = [] } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .order('sort_order', { ascending: true });
      return (data || []) as PortfolioItem[];
    },
  });

  const getImages = (item: PortfolioItem): string[] => {
    if (item.image_urls && item.image_urls.length > 0) return item.image_urls;
    return item.image_url ? [item.image_url] : [];
  };

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))] as string[];
  const filtered = selectedCategory ? items.filter((i) => i.category === selectedCategory) : items;

  const openImages = openItem ? getImages(openItem) : [];

  const next = useCallback(() => setActiveIdx((i) => (openImages.length ? (i + 1) % openImages.length : 0)), [openImages.length]);
  const prev = useCallback(() => setActiveIdx((i) => (openImages.length ? (i - 1 + openImages.length) % openImages.length : 0)), [openImages.length]);

  useEffect(() => {
    if (!openItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenItem(null);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openItem, next, prev]);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Портфолио</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Каждая работа — уникальная история, рассказанная через призму нейросетей
          </p>
        </motion.div>

        {/* Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory ? 'neon-glow-btn text-primary-foreground' : 'glass hover:bg-card/80'
              }`}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat ? 'neon-glow-btn text-primary-foreground' : 'glass hover:bg-card/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => {
            const images = getImages(item);
            const cover = images[0];
            const extras = images.slice(1, 5);
            const moreCount = Math.max(0, images.length - 5);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { setOpenItem(item); setActiveIdx(0); }}
                className="group cursor-pointer relative rounded-2xl overflow-hidden gradient-border"
              >
                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={cover}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Photo count badge */}
                  {images.length > 1 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md text-xs font-semibold text-foreground border border-neon-cyan/30">
                      <Images size={13} className="text-neon-cyan" />
                      {images.length}
                    </div>
                  )}

                  {/* Overlay info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-5 pt-16">
                    <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {item.category && (
                      <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails strip */}
                {extras.length > 0 && (
                  <div className="grid grid-cols-4 gap-1 p-1 bg-card/40">
                    {extras.map((src, idx) => {
                      const isLast = idx === extras.length - 1 && moreCount > 0;
                      return (
                        <div key={src + idx} className="relative aspect-square overflow-hidden rounded-md">
                          <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                          {isLast && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-neon-cyan">
                              +{moreCount}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">Работы скоро появятся</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 sm:p-8"
            onClick={() => setOpenItem(null)}
          >
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-foreground/60 hover:text-foreground z-10"
              onClick={(e) => { e.stopPropagation(); setOpenItem(null); }}
              aria-label="Закрыть"
            >
              <X size={32} />
            </button>

            <div className="flex-1 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
              {openImages.length > 1 && (
                <button
                  onClick={prev}
                  className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full glass hover:bg-card/90 transition"
                  aria-label="Предыдущее"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  src={openImages[activeIdx]}
                  alt={`${openItem.title} ${activeIdx + 1}`}
                  className="max-w-full max-h-[75vh] rounded-2xl object-contain"
                />
              </AnimatePresence>

              {openImages.length > 1 && (
                <button
                  onClick={next}
                  className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full glass hover:bg-card/90 transition"
                  aria-label="Следующее"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Caption + counter */}
            <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-heading font-semibold text-lg">{openItem.title}</h3>
              {openImages.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activeIdx + 1} / {openImages.length}
                </p>
              )}
            </div>

            {/* Thumbnails */}
            {openImages.length > 1 && (
              <div
                className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2 max-w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {openImages.map((src, idx) => (
                  <button
                    key={src + idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      idx === activeIdx ? 'border-neon-cyan shadow-[0_0_12px_hsl(var(--neon-cyan)/0.6)]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
