import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const glowMap: Record<string, string> = {
  'neon-blue': 'glow-blue',
  'neon-cyan': 'glow-cyan',
  'neon-purple': 'glow-purple',
  'neon-pink': 'glow-pink',
};

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styles.map((style, i) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass rounded-3xl p-8 group hover:${glowMap[style.color_from] || 'glow-blue'} transition-all duration-500 cursor-default`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${style.color_from} to-${style.color_to} flex items-center justify-center mb-6`}>
                <span className="text-2xl">{style.icon || '✦'}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">{style.title}</h3>
              {style.description && (
                <p className="text-muted-foreground leading-relaxed">{style.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
