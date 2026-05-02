import { useState, useMemo, useRef, createRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import PortfolioLightbox from '@/components/portfolio/PortfolioLightbox';
import PortfolioNode, { NeonTone } from '@/components/portfolio/PortfolioNode';
import PortfolioPath from '@/components/portfolio/PortfolioPath';

type PortfolioItem = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url: string;
  image_urls?: string[] | null;
  image_positions?: string[] | null;
};

const palette: NeonTone[] = ['cyan', 'purple', 'pink', 'blue'];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const nodeRefs = useMemo(
    () => filtered.map(() => createRef<HTMLDivElement>()),
    [filtered]
  );
  const tones = filtered.map((_, i) => palette[i % palette.length]);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-cyan/10 blur-[120px] pointer-events-none" />

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
            Наведите на кружок — посмотрите образы. Нажмите — откройте подборку
          </p>
        </motion.div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
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

        {/* Path container */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          <PortfolioPath containerRef={containerRef} nodeRefs={nodeRefs} tones={tones} />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-20 gap-x-6 md:gap-x-12 relative">
            {filtered.map((item, i) => {
              const offset = i % 2 === 0 ? 'md:translate-y-0' : 'md:translate-y-16';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex justify-center ${offset}`}
                >
                  <PortfolioNode
                    ref={nodeRefs[i]}
                    title={item.title}
                    category={item.category}
                    images={getImages(item)}
                    positions={item.image_positions || []}
                    tone={tones[i]}
                    onClick={() => setOpenItem(item)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">Работы скоро появятся</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openItem && (
          <PortfolioLightbox
            title={openItem.title}
            images={getImages(openItem)}
            onClose={() => setOpenItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
