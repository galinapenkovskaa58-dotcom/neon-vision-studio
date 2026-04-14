import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Стили <span className="gradient-text">съёмок</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Выберите направление или создадим что-то совершенно новое
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {styles.map((style, i) => {
            const images = [style.image_1, style.image_2, style.image_3].filter(Boolean);
            return (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-3xl p-5 group hover:glow-blue transition-all duration-500"
              >
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[style.image_1, style.image_2, style.image_3].map((img, j) => (
                    <div key={j} className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted/20">
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-heading font-bold text-center">{style.title}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
