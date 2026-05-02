import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type NeonTone = 'cyan' | 'purple' | 'pink' | 'blue';

const toneStyles: Record<
  NeonTone,
  { ring: string; glow: string; text: string; bg: string; hex: string }
> = {
  cyan: {
    ring: 'border-neon-cyan/60',
    glow: 'shadow-[0_0_30px_hsl(var(--neon-cyan)/0.65),0_0_70px_hsl(var(--neon-cyan)/0.35)]',
    text: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    hex: 'hsl(var(--neon-cyan))',
  },
  purple: {
    ring: 'border-neon-purple/60',
    glow: 'shadow-[0_0_30px_hsl(var(--neon-purple)/0.65),0_0_70px_hsl(var(--neon-purple)/0.35)]',
    text: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
    hex: 'hsl(var(--neon-purple))',
  },
  pink: {
    ring: 'border-neon-pink/60',
    glow: 'shadow-[0_0_30px_hsl(var(--neon-pink)/0.65),0_0_70px_hsl(var(--neon-pink)/0.35)]',
    text: 'text-neon-pink',
    bg: 'bg-neon-pink/10',
    hex: 'hsl(var(--neon-pink))',
  },
  blue: {
    ring: 'border-neon-blue/60',
    glow: 'shadow-[0_0_30px_hsl(var(--neon-blue)/0.65),0_0_70px_hsl(var(--neon-blue)/0.35)]',
    text: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
    hex: 'hsl(var(--neon-blue))',
  },
};

type Props = {
  title: string;
  category?: string | null;
  images: string[];
  positions?: string[];
  tone: NeonTone;
  onClick: () => void;
};

const PortfolioNode = forwardRef<HTMLDivElement, Props>(function PortfolioNode(
  { title, category, images, positions, tone, onClick },
  ref
) {
  const [hover, setHover] = useState(false);
  const t = toneStyles[tone];
  const cover = images[0];
  const coverPos = positions?.[0] || '50% 50%';
  const fanImages = images.slice(0, 5);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Fan preview */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none w-0 h-0">
        <AnimatePresence>
          {hover && fanImages.length > 0 && (
            <>
              {fanImages.map((src, i) => {
                const total = fanImages.length;
                const mid = (total - 1) / 2;
                const angle = (i - mid) * 18; // -36..+36 for 5
                const offsetX = (i - mid) * 60;
                return (
                  <motion.div
                    key={src + i}
                    initial={{ opacity: 0, y: 10, rotate: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      y: -110,
                      x: offsetX,
                      rotate: angle,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: 0, rotate: 0, scale: 0.6 }}
                    transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
                    style={{
                      borderColor: t.hex,
                      boxShadow: `0 6px 24px ${t.hex}55`,
                    }}
                    className="absolute -translate-x-1/2 w-20 h-28 rounded-xl overflow-hidden border-2 glass"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Circle button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label={title}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 ${t.ring} ${t.bg} transition-shadow duration-300 ${
          hover ? t.glow : 'shadow-[0_0_15px_hsl(var(--neon-blue)/0.2)]'
        }`}
      >
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: coverPos }}
          />
        ) : (
          <div className="w-full h-full bg-card/60" />
        )}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, transparent 40%, ${t.hex}33 100%)`,
            opacity: hover ? 1 : 0.5,
          }}
        />
        {images.length > 1 && (
          <div
            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold glass ${t.text}`}
          >
            {images.length}
          </div>
        )}
      </motion.button>

      {/* Label */}
      <div className="mt-3 text-center max-w-[160px]">
        <div className={`font-heading font-semibold text-sm ${hover ? t.text : 'text-foreground'} transition-colors`}>
          {title || 'Без названия'}
        </div>
        {category && (
          <div className="text-[11px] text-muted-foreground mt-0.5">{category}</div>
        )}
      </div>
    </div>
  );
});

export default PortfolioNode;
export { toneStyles };
