import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewsProps {
  service?: string;
}

export default function Reviews({ service }: ReviewsProps = {}) {
  const [current, setCurrent] = useState(0);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', service ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (service) query = query.eq('service', service);
      const { data } = await query;
      return data || [];
    },
  });

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Отзывы</span>
          </h2>
          <p className="text-muted-foreground text-lg">Что говорят клиенты о работе со студией</p>
        </motion.div>

        {reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="glass rounded-3xl p-10 border border-border/30">
              <p className="text-muted-foreground">
                Скоро здесь появятся реальные отзывы клиентов.
              </p>
            </div>
          </motion.div>
        )}

        {reviews.length > 0 && (

        <div className="max-w-3xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass rounded-3xl p-10 text-center"
          >
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: reviews[current]?.rating || 5 }).map((_, i) => (
                <Star key={i} size={20} className="fill-neon-cyan text-neon-cyan" />
              ))}
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-8 text-foreground/90">
              «{reviews[current]?.text}»
            </p>
            <div className="flex items-center justify-center gap-3">
              {reviews[current]?.photo_url && (
                <img
                  src={reviews[current].photo_url!}
                  alt={reviews[current].client_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-neon-blue/30"
                />
              )}
              <span className="font-heading font-semibold">{reviews[current]?.client_name}</span>
            </div>
          </motion.div>

          {reviews.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === current ? 'bg-neon-cyan w-8' : 'bg-foreground/20 hover:bg-foreground/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </section>
  );
}
