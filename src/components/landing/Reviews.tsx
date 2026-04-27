import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Star, Sparkles, User, Camera, Video, Music, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICE_LINKS = [
  {
    service: 'neurophoto',
    label: 'Нейрофотосессия',
    to: '/neurophoto#reviews',
    Icon: Camera,
    iconWrap: 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan',
    accent: 'text-neon-cyan',
    hover: 'hover:border-neon-cyan/60 hover:shadow-[0_0_28px_hsl(var(--neon-cyan)/0.35)]',
  },
  {
    service: 'ai-video',
    label: 'AI-видео',
    to: '/ai-video#reviews',
    Icon: Video,
    iconWrap: 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue',
    accent: 'text-neon-blue',
    hover: 'hover:border-neon-blue/60 hover:shadow-[0_0_28px_hsl(var(--neon-blue)/0.35)]',
  },
  {
    service: 'songs',
    label: 'Песни на заказ',
    to: '/songs#reviews',
    Icon: Music,
    iconWrap: 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink',
    accent: 'text-neon-pink',
    hover: 'hover:border-neon-pink/60 hover:shadow-[0_0_28px_hsl(var(--neon-pink)/0.35)]',
  },
  {
    service: 'vibe-coding',
    label: 'Vibe-coding',
    to: '/vibe-coding#reviews',
    Icon: Code,
    iconWrap: 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple',
    accent: 'text-neon-purple',
    hover: 'hover:border-neon-purple/60 hover:shadow-[0_0_28px_hsl(var(--neon-purple)/0.35)]',
  },
] as const;

interface ReviewsProps {
  service?: string;
  showServiceLinks?: boolean;
}

export default function Reviews({ service, showServiceLinks = false }: ReviewsProps = {}) {
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', service ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'approved')
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

        {reviews.length === 0 && showServiceLinks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <p className="text-center text-muted-foreground mb-8">
              Выберите услугу, чтобы посмотреть отзывы клиентов
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICE_LINKS.map(({ service: s, label, to, Icon, iconWrap, accent, hover }, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={to}
                    className={`group relative block glass rounded-2xl p-6 border border-border/30 transition-all duration-300 hover:-translate-y-1 h-full ${hover}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform ${iconWrap}`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading font-semibold text-base mb-2">{label}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity ${accent}`}>
                      Смотреть отзывы <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {reviews.length === 0 && !showServiceLinks && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground"
          >
            Скоро здесь появятся отзывы клиентов
          </motion.p>
        )}

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="group relative glass rounded-2xl p-6 border border-border/30 transition-all duration-300 hover:border-neon-cyan/60 hover:shadow-[0_0_28px_hsl(var(--neon-cyan)/0.35)] hover:-translate-y-1 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                    <Star key={idx} size={16} className="fill-neon-cyan text-neon-cyan" />
                  ))}
                </div>
                <p className="text-sm md:text-base leading-relaxed text-foreground/85 whitespace-pre-line flex-1">
                  «{r.text}»
                </p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/30">
                  {r.photo_url ? (
                    <img
                      src={r.photo_url}
                      alt={r.client_name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-neon-cyan/40"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-muted/60 border-2 border-border/40 flex items-center justify-center">
                      <User size={18} className="text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-heading font-semibold text-sm">{r.client_name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neon-cyan/40 bg-neon-cyan/5 text-sm font-semibold text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_18px_hsl(var(--neon-cyan)/0.4)] transition-all"
          >
            <Sparkles size={16} />
            Оставить свой отзыв
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Поделитесь своим мнением о работе с нами, и получите Бонус на следующий заказ в виде 10% или 15% скидки
          </p>
        </motion.div>
      </div>
    </section>
  );
}
