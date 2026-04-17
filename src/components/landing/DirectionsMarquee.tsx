import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Film, Music, Code2 } from 'lucide-react';

const directions = [
  {
    icon: Camera,
    label: 'Нейрофото',
    to: '/neurophoto',
    glow: 'hsl(var(--neon-cyan))',
    iconClass: 'text-neon-cyan',
  },
  {
    icon: Film,
    label: 'AI-видео',
    to: '/ai-video',
    glow: 'hsl(var(--neon-pink))',
    iconClass: 'text-neon-pink',
  },
  {
    icon: Music,
    label: 'AI-музыка',
    to: '/songs',
    glow: 'hsl(var(--neon-purple))',
    iconClass: 'text-neon-purple',
  },
  {
    icon: Code2,
    label: 'Вейб-кодинг',
    to: '/vibe-coding',
    glow: 'hsl(var(--neon-blue))',
    iconClass: 'text-neon-blue',
  },
];

export default function DirectionsMarquee() {
  return (
    <section className="relative py-12 overflow-hidden border-y border-white/5 bg-background/50">
      {/* Soft glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-32 rounded-full bg-neon-purple/10 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-32 rounded-full bg-neon-cyan/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
          className="flex gap-6 w-max"
        >
          {[...directions, ...directions, ...directions, ...directions].map(
            (d, i) => (
              <Link
                key={i}
                to={d.to}
                className="group relative shrink-0"
                style={{ ['--card-glow' as any]: d.glow }}
              >
                {/* Outer halo glow */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-40 blur-xl transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background: `radial-gradient(circle at center, ${d.glow}, transparent 70%)`,
                  }}
                />

                {/* Gradient border wrapper */}
                <div
                  className="relative rounded-2xl p-[1.5px] transition-transform duration-300 group-hover:scale-[1.04]"
                  style={{
                    background: `linear-gradient(135deg, ${d.glow}, transparent 50%, ${d.glow})`,
                  }}
                >
                  {/* Inner glass card */}
                  <div className="relative flex items-center gap-3 rounded-2xl bg-background/80 backdrop-blur-xl px-7 py-4 overflow-hidden">
                    {/* Inner light sweep */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(120deg, transparent 30%, ${d.glow}22 50%, transparent 70%)`,
                      }}
                    />

                    {/* Icon with glow */}
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-md opacity-70"
                        style={{ background: d.glow, borderRadius: '50%' }}
                      />
                      <d.icon
                        className={`relative w-6 h-6 ${d.iconClass} drop-shadow-[0_0_8px_currentColor]`}
                      />
                    </div>

                    <span className="relative font-heading font-semibold text-base whitespace-nowrap tracking-wide">
                      {d.label}
                    </span>

                    {/* Pulsing dot */}
                    <span
                      className="relative w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        background: d.glow,
                        boxShadow: `0 0 8px ${d.glow}`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
