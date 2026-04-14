import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo, useState } from 'react';

export default function Styles() {
  const [expandedImg, setExpandedImg] = useState<string | null>(null);
  const { data: styles = [] } = useQuery({
    queryKey: ['styles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('styles')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order');
      return data || [];
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof styles>();
    styles.forEach((s) => {
      const cat = (s as any).category || 'Без категории';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    });
    return Array.from(map.entries());
  }, [styles]);

  if (styles.length === 0) return null;

  return (
    <section id="styles" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-neon-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-neon-pink/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold mb-4 gradient-text">
            Стили съёмок
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Выберите направление или создадим что-то совершенно новое
          </p>
        </motion.div>

        <div className="space-y-12">
          {grouped.map(([category, items], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-center bg-clip-text text-transparent animate-shimmer"
                style={{
                  backgroundImage: 'linear-gradient(90deg, hsl(320 100% 65%), hsl(160 100% 50%), hsl(320 100% 65%))',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                }}>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((style, i) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="rounded-2xl p-4 border border-neon-pink/20 bg-neon-pink/[0.06] hover:bg-neon-pink/[0.12] hover:border-neon-pink/40 transition-all duration-400">
                        <div className="grid grid-cols-3 gap-2">
                          {[style.image_1, style.image_2, style.image_3].map((img, j) => {
                            const imgKey = `${style.id}-${j}`;
                            const isExpanded = expandedImg === imgKey;
                            return (
                              <div key={j} className="aspect-[3/4] rounded-xl overflow-visible bg-muted/20 relative">
                                {img ? (
                                  <motion.img
                                    src={img}
                                    alt=""
                                    onClick={() => setExpandedImg(isExpanded ? null : imgKey)}
                                    animate={{
                                      scale: isExpanded ? 1.6 : 1,
                                      zIndex: isExpanded ? 50 : 1,
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="w-full h-full object-cover rounded-xl cursor-pointer relative hover:scale-[1.05] transition-shadow duration-300"
                                    style={{
                                      zIndex: isExpanded ? 50 : 1,
                                      boxShadow: isExpanded ? '0 20px 60px rgba(0,0,0,0.6)' : 'none',
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <h4 className="text-lg font-heading font-bold text-center mt-3">{style.title}</h4>
                    </motion.div>
                  ))}
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
