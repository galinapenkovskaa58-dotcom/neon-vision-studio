import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import BookingForm from '@/components/landing/BookingForm';
import { motion } from 'framer-motion';
import { Film, Sparkles, Zap, Clock } from 'lucide-react';
import aiVideoHero from '@/assets/ai-video-hero.png';

const features = [
  { icon: Film, title: 'AI Видеоролики', desc: 'Создание видео с помощью нейросетей — от концепта до финального монтажа.' },
  { icon: Sparkles, title: 'Музыкальные клипы', desc: 'Визуальные истории для ваших треков с уникальной AI-эстетикой.' },
  { icon: Zap, title: 'Рекламные ролики', desc: 'Короткие, яркие ролики для соцсетей и рекламных кампаний.' },
  { icon: Clock, title: 'Быстрое производство', desc: 'От идеи до готового видео за считанные дни, а не недели.' },
];

const AiVideo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-pink/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-purple/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative order-2 lg:order-1 flex justify-center group"
            >
              <motion.img
                src={aiVideoHero}
                alt="AI Видео & Клипы — DSN Nexoria"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="relative w-full max-w-[520px] h-auto"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 18%, black 100%)',
                }}
              />

              {/* Hover effects: ripples + film strips */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                {/* Expanding ripples */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`ripple-${i}`}
                    className="absolute rounded-full border-2 border-neon-pink/40"
                    style={{ width: 80, height: 80 }}
                    animate={{
                      scale: [0.5, 3],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeOut',
                    }}
                  />
                ))}

                {/* Floating film strips that evaporate */}
                {[...Array(6)].map((_, i) => {
                  const startX = -40 + i * 16;
                  const driftX = i % 2 === 0 ? 30 : -30;
                  return (
                    <motion.div
                      key={`film-${i}`}
                      className="absolute"
                      style={{
                        left: `${50 + startX}%`,
                        top: '55%',
                      }}
                      animate={{
                        y: [0, -160],
                        x: [0, driftX],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, i % 2 === 0 ? 15 : -15],
                        scale: [0.6, 1, 1, 0.4],
                        filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.45,
                        ease: 'easeOut',
                        times: [0, 0.2, 0.7, 1],
                      }}
                    >
                      {/* Film strip */}
                      <div
                        className="relative rounded-sm bg-gradient-to-b from-neon-purple/80 via-neon-pink/70 to-neon-purple/80 border border-neon-pink/60"
                        style={{
                          width: 32,
                          height: 44,
                          boxShadow: '0 0 12px hsl(var(--neon-pink) / 0.6)',
                        }}
                      >
                        {/* Sprocket holes */}
                        <div className="absolute inset-y-1 left-0.5 flex flex-col justify-between">
                          {[...Array(4)].map((_, h) => (
                            <span
                              key={h}
                              className="block w-1 h-1 rounded-sm bg-background/90"
                            />
                          ))}
                        </div>
                        <div className="absolute inset-y-1 right-0.5 flex flex-col justify-between">
                          {[...Array(4)].map((_, h) => (
                            <span
                              key={h}
                              className="block w-1 h-1 rounded-sm bg-background/90"
                            />
                          ))}
                        </div>
                        {/* Frame */}
                        <div className="absolute inset-x-1.5 inset-y-2 rounded-[1px] bg-background/40 backdrop-blur-sm" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <span className="inline-block text-sm font-medium text-neon-pink tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-pink/20 bg-neon-pink/5">
                AI Видео & Клипы
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
                <span className="block">Видео</span>
                <span className="block gradient-text">нового поколения</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
                Создаю AI-видео, музыкальные клипы и рекламные ролики с использованием передовых нейросетей. 
                Каждый кадр — произведение цифрового искусства.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 hover:border-neon-pink/30 transition-colors border border-border/30"
              >
                <f.icon className="w-10 h-10 text-neon-pink mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BookingForm />

      <Footer />
    </div>
  );
};

export default AiVideo;
