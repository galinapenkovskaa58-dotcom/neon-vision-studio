import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, MessageCircleQuestion } from 'lucide-react';
import bookingIcon from '@/assets/booking-icon.png';
import RequestDialog, { type RequestVariant } from '@/components/RequestDialog';

interface BookingFormProps {
  iconSrc?: string;
}

export default function BookingForm({ iconSrc }: BookingFormProps = {}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variant, setVariant] = useState<RequestVariant>('booking');

  const openDialog = (v: RequestVariant) => {
    setVariant(v);
    setDialogOpen(true);
  };

  return (
    <section id="booking" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-purple/8 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-neon-blue/8 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            className="relative shrink-0"
          >
            <img
              src={iconSrc ?? bookingIcon}
              alt=""
              aria-hidden="true"
              className="relative z-10 w-28 h-28 md:w-36 md:h-36 object-contain"
              style={{
                WebkitMaskImage:
                  'radial-gradient(circle at center, black 55%, transparent 80%)',
                maskImage:
                  'radial-gradient(circle at center, black 55%, transparent 80%)',
              }}
            />

            {/* Continuous fireworks: bursts of colored particles flying outward */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              {[...Array(4)].map((_, burstIdx) => {
                const particleCount = 14;
                const burstOffset = burstIdx * 0.6;
                const cycleDuration = 2.4;
                const colors = [
                  'hsl(var(--neon-pink))',
                  'hsl(var(--neon-cyan))',
                  'hsl(var(--neon-purple))',
                  'hsl(var(--neon-blue))',
                ];
                return [...Array(particleCount)].map((_, i) => {
                  const angle = (i / particleCount) * Math.PI * 2 + burstIdx * 0.4;
                  const distance = 75 + ((i * 13 + burstIdx * 7) % 50);
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;
                  const color = colors[(i + burstIdx) % colors.length];
                  return (
                    <motion.span
                      key={`fw-${burstIdx}-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: 6,
                        height: 6,
                        background: color,
                        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                      }}
                      animate={{
                        x: [0, x],
                        y: [0, y + 30],
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 0.8, 0.3],
                      }}
                      transition={{
                        duration: cycleDuration,
                        delay: burstOffset + i * 0.015,
                        ease: 'easeOut',
                        times: [0, 0.15, 0.6, 1],
                        repeat: Infinity,
                        repeatDelay: 0.4,
                      }}
                    />
                  );
                });
              })}
            </div>
          </motion.div>
          <div className="text-center sm:text-left">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              <span className="gradient-text">Записаться</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Выберите удобный формат — оставьте заявку, обсудите проект или задайте вопрос
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap max-w-3xl mx-auto"
        >
          <button
            onClick={() => openDialog('booking')}
            className="neon-glow-btn text-primary-foreground px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2"
          >
            <Rocket size={18} />
            Оставить заявку
          </button>
          <button
            onClick={() => openDialog('project')}
            className="px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 text-neon-purple border border-neon-purple/50 bg-neon-purple/5 shadow-[0_0_18px_hsl(var(--neon-purple)/0.35)] hover:bg-neon-purple/10 hover:shadow-[0_0_28px_hsl(var(--neon-purple)/0.6)] transition-all"
          >
            <Sparkles size={18} />
            Обсудить проект
          </button>
          <button
            onClick={() => openDialog('question')}
            className="px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 text-neon-cyan border border-neon-cyan/40 bg-neon-cyan/5 hover:bg-neon-cyan/10 hover:shadow-[0_0_18px_hsl(var(--neon-cyan)/0.4)] transition-all"
          >
            <MessageCircleQuestion size={18} />
            Задать вопрос
          </button>
        </motion.div>
      </div>

      <RequestDialog open={dialogOpen} onOpenChange={setDialogOpen} variant={variant} />
    </section>
  );
}
