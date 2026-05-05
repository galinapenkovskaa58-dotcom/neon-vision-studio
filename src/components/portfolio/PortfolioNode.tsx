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
  category?: string | null;
  images: string[];
  positions?: string[];
  originalUrl?: string | null;
  originalName?: string | null;
  originalPosition?: string | null;
  tone: NeonTone;
  displayMode?: 'fan' | 'grid';
  onClick: () => void;
};

const PortfolioNode = forwardRef<HTMLDivElement, Props>(function PortfolioNode(
  { category, images, positions, originalUrl, originalName, originalPosition, tone, displayMode = 'fan', onClick },
  ref
) {
  const [hover, setHover] = useState(false);
  const t = toneStyles[tone];
  const cover = images[0];
  const coverPos = positions?.[0] || '50% 50%';

  // Split images: front fan up to 5, back fan rest, both adapt to count
  const half = Math.ceil(images.length / 2);
  const fanFront = images.slice(0, Math.min(5, half + (images.length > 5 ? 0 : 0)));
  // simpler: first half front, second half back when >5
  const front = images.length <= 5 ? images : images.slice(0, 5);
  const back = images.length <= 5 ? [] : images.slice(5, 10);

  const renderFan = (
    list: string[],
    layer: 'front' | 'back'
  ) => {
    const total = list.length;
    if (total === 0) return null;
    const mid = (total - 1) / 2;
    const angleStep = layer === 'front' ? 18 : 22;
    const offsetStep = layer === 'front' ? 60 : 70;
    const yLift = layer === 'front' ? -110 : -160;
    const baseDelay = layer === 'front' ? 0.1 : 0;
    return list.map((src, i) => {
      const angle = (i - mid) * angleStep;
      const offsetX = (i - mid) * offsetStep;
      return (
        <motion.div
          key={`${layer}-${src}-${i}`}
          initial={{ opacity: 0, y: 10, rotate: 0, scale: 0.5 }}
          animate={{ opacity: layer === 'front' ? 1 : 0.95, y: yLift, x: offsetX, rotate: angle, scale: 1 }}
          exit={{ opacity: 0, y: 0, rotate: 0, scale: 0.6 }}
          transition={{ duration: 0.35, delay: baseDelay + i * 0.04, ease: 'easeOut' }}
          style={{ borderColor: t.hex, boxShadow: `0 6px 24px ${t.hex}55` }}
          className="absolute -translate-x-1/2 w-20 h-28 rounded-xl overflow-hidden border-2 glass"
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      );
    });
  };

  // GRID MODE — very compact tile (~5x smaller than fan circle)
  if (displayMode === 'grid') {
    const tiles = images.slice(0, 9);
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tiles.length))));
    return (
      <div ref={ref} className="relative flex flex-col items-center">
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={originalName || category || 'portfolio'}
          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border ${t.ring} ${t.bg} p-[1px] transition-shadow duration-300 ${
            hover ? t.glow : ''
          }`}
        >
          <div
            className="grid gap-px w-full h-full"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {tiles.map((src, i) => (
              <div key={src + i} className="relative overflow-hidden rounded-[2px]">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: positions?.[i] || '50% 50%' }}
                />
              </div>
            ))}
          </div>
        </motion.button>

        <NodeLabel
          tone={t}
          hover={hover}
          category={category}
          originalUrl={originalUrl}
          originalName={originalName}
          originalPosition={originalPosition}
        />
      </div>
    );
  }

  // FAN (default)
  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none w-0 h-0">
        <AnimatePresence>
          {hover && renderFan(back, 'back')}
          {hover && renderFan(front, 'front')}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label={originalName || category || 'portfolio'}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 ${t.ring} ${t.bg} transition-shadow duration-300 ${
          hover ? t.glow : 'shadow-[0_0_15px_hsl(var(--neon-blue)/0.2)]'
        }`}
      >
        {cover ? (
          <img
            src={cover}
            alt={originalName || ''}
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

      <NodeLabel
        tone={t}
        hover={hover}
        category={category}
        originalUrl={originalUrl}
        originalName={originalName}
        originalPosition={originalPosition}
      />
    </div>
  );
});

function NodeLabel({
  tone,
  hover,
  category,
  originalUrl,
  originalName,
  originalPosition,
}: {
  tone: { hex: string; text: string; ring: string };
  hover: boolean;
  category?: string | null;
  originalUrl?: string | null;
  originalName?: string | null;
  originalPosition?: string | null;
}) {
  const [showOriginal, setShowOriginal] = useState(false);
  return (
    <>
      <div className="mt-3 text-center max-w-[180px]">
        {originalName && (
          <div className="neon-name text-base sm:text-lg leading-tight">
            {originalName}
          </div>
        )}
        {category && (
          <div className={`text-[11px] mt-0.5 ${hover ? tone.text : 'text-muted-foreground'} transition-colors`}>
            {category}
          </div>
        )}
      </div>

      {originalUrl && (
        <div className="mt-2 relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowOriginal((v) => !v); }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium glass border ${tone.ring} ${tone.text} hover:scale-105 transition`}
          >
            Оригинал
          </button>
          <AnimatePresence>
            {showOriginal && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 mt-2 z-10"
                onMouseLeave={() => setShowOriginal(false)}
              >
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2"
                  style={{ borderColor: tone.hex, boxShadow: `0 6px 24px ${tone.hex}66` }}
                >
                  <img
                    src={originalUrl}
                    alt={originalName || 'Оригинал'}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: originalPosition || '50% 50%' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default PortfolioNode;
export { toneStyles };
