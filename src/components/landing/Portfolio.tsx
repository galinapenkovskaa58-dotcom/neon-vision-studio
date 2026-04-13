import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .order('sort_order', { ascending: true });
      return data || [];
    },
  });

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const filtered = selectedCategory ? items.filter((i) => i.category === selectedCategory) : items;

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
                onClick={() => setSelectedCategory(cat!)}
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
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setLightbox(item.image_url)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[3/4] gradient-border"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                )}
                {item.category && (
                  <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue w-fit">
                    {item.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">Работы скоро появятся</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-foreground/60 hover:text-foreground">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt="Full view"
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
