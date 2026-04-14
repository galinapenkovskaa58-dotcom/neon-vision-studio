import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

export default function Styles() {
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
              <h3 className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-6 text-center">
                {category}
              </h3>
              <div className="glass-strong rounded-[2rem] p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((style, i) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[style.image_1, style.image_2, style.image_3].map((img, j) => (
                          <div key={j} className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted/20">
                            {img ? (
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.15]"
                              />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                        ))}
                      </div>
                      <h4 className="text-xl font-heading font-bold text-center">{style.title}</h4>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
