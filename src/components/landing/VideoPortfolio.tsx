import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import VideoLightbox from '@/components/portfolio/VideoLightbox';

type VideoItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  cover_url: string;
  video_url: string;
  aspect_ratio?: string | null;
};

export const VIDEO_ASPECT_RATIOS = ['16:9', '9:16', '21:9', '4:3', '3:4', '1:1'] as const;

const aspectClass: Record<string, string> = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '21:9': 'aspect-[21/9]',
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

export const VIDEO_CATEGORIES = [
  'AI-видеоролики',
  'Музыкальные клипы',
  'Рекламные ролики',
  'Видео для соцсетей',
  'Имиджевые видео',
  'Истории и storytelling',
] as const;

const tones = ['cyan', 'purple', 'pink'] as const;
type Tone = (typeof tones)[number];

const toneStyles: Record<Tone, { ring: string; glow: string; chip: string; play: string }> = {
  cyan: {
    ring: 'border-neon-cyan/30 hover:border-neon-cyan/70',
    glow: '0 0 30px hsl(var(--neon-cyan) / 0.35), 0 0 60px hsl(var(--neon-cyan) / 0.15)',
    chip: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    play: 'from-neon-cyan to-neon-blue',
  },
  purple: {
    ring: 'border-neon-purple/30 hover:border-neon-purple/70',
    glow: '0 0 30px hsl(var(--neon-purple) / 0.35), 0 0 60px hsl(var(--neon-purple) / 0.15)',
    chip: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
    play: 'from-neon-purple to-neon-pink',
  },
  pink: {
    ring: 'border-neon-pink/30 hover:border-neon-pink/70',
    glow: '0 0 30px hsl(var(--neon-pink) / 0.35), 0 0 60px hsl(var(--neon-pink) / 0.15)',
    chip: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
    play: 'from-neon-pink to-neon-purple',
  },
};

export default function VideoPortfolio() {
  const [filter, setFilter] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<VideoItem | null>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['video-portfolio'],
    queryFn: async () => {
      const { data } = await supabase
        .from('video_portfolio')
        .select('id, title, description, category, cover_url, video_url, aspect_ratio')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      return (data || []) as VideoItem[];
    },
  });

  const presentCategories = VIDEO_CATEGORIES.filter((c) => items.some((i) => i.category === c));
  const filtered = filter ? items.filter((i) => i.category === filter) : items;

  return (
    <section id="video-portfolio" className="py-20 md:py-28 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-neon-pink/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full bg-neon-cyan/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block text-xs sm:text-sm font-medium text-neon-pink tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full border border-neon-pink/20 bg-neon-pink/5">
            Портфолио
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Портфолио видео</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Подборка AI-видеороликов, клипов и рекламы — нажмите карточку, чтобы посмотреть
          </p>
        </motion.div>

        {presentCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-14">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                !filter ? 'neon-glow-btn text-primary-foreground' : 'glass hover:bg-card/80'
              }`}
            >
              Все
            </button>
            {presentCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  filter === cat ? 'neon-glow-btn text-primary-foreground' : 'glass hover:bg-card/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-base sm:text-lg">Видео-работы скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((item, i) => {
              const tone = tones[i % tones.length];
              const ts = toneStyles[tone];
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setOpenItem(item)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className={`group relative text-left rounded-2xl overflow-hidden glass border ${ts.ring} transition-all duration-300`}
                  style={{ boxShadow: ts.glow }}
                >
                  {/* Cover */}
                  <div className="relative aspect-video overflow-hidden bg-muted/30">
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                    {/* Play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        transition={{ type: 'spring', stiffness: 280 }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${ts.play} flex items-center justify-center shadow-2xl`}
                        style={{
                          boxShadow:
                            '0 0 30px hsl(var(--neon-cyan) / 0.5), 0 0 60px hsl(var(--neon-purple) / 0.3)',
                        }}
                      >
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground fill-current ml-1" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 sm:p-6 space-y-2">
                    <span
                      className={`inline-block text-[10px] sm:text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full border ${ts.chip}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="pt-2">
                      <span className="text-xs sm:text-sm font-medium text-neon-cyan group-hover:text-neon-pink transition-colors inline-flex items-center gap-1.5">
                        Смотреть видео
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {openItem && (
          <VideoLightbox
            videoUrl={openItem.video_url}
            title={openItem.title}
            onClose={() => setOpenItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
