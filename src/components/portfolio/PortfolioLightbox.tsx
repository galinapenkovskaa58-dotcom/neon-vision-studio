import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PortfolioLightbox({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = useCallback(
    () => setActiveIdx((i) => (images.length ? (i + 1) % images.length : 0)),
    [images.length]
  );
  const prev = useCallback(
    () => setActiveIdx((i) => (images.length ? (i - 1 + images.length) % images.length : 0)),
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex flex-col p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-foreground/60 hover:text-foreground z-10"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Закрыть"
      >
        <X size={32} />
      </button>

      <div className="flex-1 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full glass hover:bg-card/90 transition"
            aria-label="Предыдущее"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            src={images[activeIdx]}
            alt={`${title} ${activeIdx + 1}`}
            className="max-w-full max-h-[75vh] rounded-2xl object-contain"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full glass hover:bg-card/90 transition"
            aria-label="Следующее"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading font-semibold text-lg">{title}</h3>
        {images.length > 1 && (
          <p className="text-xs text-muted-foreground mt-1">
            {activeIdx + 1} / {images.length}
          </p>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2 max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                idx === activeIdx
                  ? 'border-neon-cyan shadow-[0_0_12px_hsl(var(--neon-cyan)/0.6)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
