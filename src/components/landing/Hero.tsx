import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircleQuestion } from 'lucide-react';
import heroImage from '@/assets/hero-dsn.png';
import AskQuestionDialog from '@/components/AskQuestionDialog';

export default function Hero() {
  const [askOpen, setAskOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-blue/10 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-purple/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-pink/5 blur-[150px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-blue) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-blue) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-2 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative order-1 lg:order-1 flex justify-center group"
          >
            <motion.img
              src={heroImage}
              alt="DSN AI-студия"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative w-full max-w-[520px] h-auto"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            />

            {/* Hover effect: heart-shaped waves radiating from the heart above her fingers */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* Position anchor — over the heart in her hands (approx. right side, slightly above center) */}
              <div
                className="absolute"
                style={{ left: '41%', top: '42%', transform: 'translate(-50%, -50%)' }}
              >
                {/* 5 heart-shaped waves radiating out, then fading */}
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={`heart-wave-${i}`}
                    viewBox="0 0 32 32"
                    className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                    style={{ filter: 'drop-shadow(0 0 8px hsl(var(--neon-pink) / 0.8))' }}
                    animate={{
                      scale: [1, 4],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      delay: i * 0.5,
                      ease: 'easeOut',
                    }}
                  >
                    <path
                      d="M16 28s-11-7.5-11-15a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7.5-11 15-11 15z"
                      fill="none"
                      stroke="hsl(var(--neon-pink))"
                      strokeWidth="1.5"
                    />
                  </motion.svg>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="text-center lg:text-left order-2 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-sm font-medium text-neon-cyan tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5">
                AI-студия полного цикла
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[0.95] mb-8"
            >
              <span className="block">Где идеи</span>
              <span className="block gradient-text">оживают</span>
              <span className="block">через AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10"
            >
              Нейрофотосессии, AI-видео, музыка и вейб-кодинг —
              всё, что можно создать с помощью искусственного интеллекта.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                className="neon-glow-btn text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold animate-glow-pulse"
              >
                Наши услуги
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}
