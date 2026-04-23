import Header from '@/components/landing/Header';
import Portfolio from '@/components/landing/Portfolio';
import Styles from '@/components/landing/Styles';
import Tariffs from '@/components/landing/Tariffs';
import Reviews from '@/components/landing/Reviews';
import BookingForm from '@/components/landing/BookingForm';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import neurophotoHero from '@/assets/neurophoto-hero.png';

const Neurophoto = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header pageBadge={{ label: 'Нейрофотосессии', tone: 'cyan' }} />
      
      {/* Hero for Neurophoto */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-blue/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-purple/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-2 lg:gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 flex flex-col items-center lg:items-end text-center lg:text-right"
            >
              <span className="self-center lg:self-end inline-block text-sm font-medium text-neon-cyan tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5">
                Нейрофотосессии
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
                <span className="block">Магия</span>
                <span className="block gradient-text">нейрофото</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                Создаю уникальные образы с помощью нейросетей и профессиональной фотографии. 
                Каждый кадр — это слияние искусства и искусственного интеллекта.
              </p>
              <button
                onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="self-center lg:self-end neon-glow-btn text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold animate-glow-pulse"
              >
                Записаться на НЕЙРОФОТОсессию
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative order-1 lg:order-2 flex justify-center lg:justify-start group"
            >
              <motion.img
                src={neurophotoHero}
                alt="Нейрофотосессия — DSN Nexoria"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="relative w-full max-w-[560px] h-auto"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                }}
              />

              {/* Hover effects: soft ripples + falling polaroids */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                {/* Soft expanding ripples */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`ripple-${i}`}
                    className="absolute rounded-full border-2 border-neon-purple/40"
                    style={{
                      width: 100,
                      height: 100,
                      boxShadow: '0 0 20px hsl(var(--neon-purple) / 0.4)',
                    }}
                    animate={{
                      scale: [0.4, 3.2],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}

                {/* Floating polaroid snapshots that fade away */}
                {[...Array(6)].map((_, i) => {
                  const startX = -50 + i * 18;
                  const driftX = i % 2 === 0 ? 35 : -35;
                  const rotate = i % 2 === 0 ? 12 : -12;
                  return (
                    <motion.div
                      key={`polaroid-${i}`}
                      className="absolute"
                      style={{
                        left: `${50 + startX}%`,
                        top: '55%',
                      }}
                      animate={{
                        y: [0, -180],
                        x: [0, driftX],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, rotate],
                        scale: [0.6, 1, 1, 0.5],
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeOut',
                        times: [0, 0.2, 0.7, 1],
                      }}
                    >
                      {/* Polaroid frame */}
                      <div
                        className="bg-foreground/95 rounded-sm p-1.5 pb-4"
                        style={{
                          width: 44,
                          height: 56,
                          boxShadow: '0 4px 18px hsl(var(--neon-pink) / 0.5), 0 0 12px hsl(var(--neon-purple) / 0.4)',
                        }}
                      >
                        {/* Photo area with gradient */}
                        <div
                          className="w-full h-[34px] rounded-[1px] bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Portfolio />
      <Styles />
      <Tariffs />
      <Reviews />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Neurophoto;
