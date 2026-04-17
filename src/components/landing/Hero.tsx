import { motion } from 'framer-motion';
import { Camera, Film, Music, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const directions = [
  { icon: Camera, label: 'Нейрофото', color: 'text-neon-cyan', to: '/neurophoto' },
  { icon: Film, label: 'AI-видео', color: 'text-neon-pink', to: '/ai-video' },
  { icon: Music, label: 'AI-музыка', color: 'text-neon-purple', to: '/songs' },
  { icon: Code2, label: 'Вейб-кодинг', color: 'text-neon-blue', to: '/vibe-coding' },
];

export default function Hero() {
  const scrollToBooking = () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
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
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.95] mb-8"
          >
            <span className="block">Где идеи</span>
            <span className="block gradient-text">оживают</span>
            <span className="block">через AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Нейрофотосессии, AI-видео, музыка и вейб-кодинг — 
            всё, что можно создать с помощью искусственного интеллекта.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
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

      {/* Marquee with directions — full width edge to edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 mt-16 w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          className="flex gap-4 w-max"
        >
          {[...directions, ...directions, ...directions, ...directions].map((d, i) => (
            <Link
              key={i}
              to={d.to}
              className="glass flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-white/30 transition-all hover:scale-105 shrink-0"
            >
              <d.icon className={`w-5 h-5 ${d.color}`} />
              <span className="font-medium whitespace-nowrap">{d.label}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>

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
