import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import BookingForm from '@/components/landing/BookingForm';
import { motion } from 'framer-motion';
import { Code, Laptop, Rocket, Palette } from 'lucide-react';
import vibeCodingHero from '@/assets/vibe-coding-hero.png';
import vibeBookingIcon from '@/assets/booking-icon-vibe.png';

const codeSymbols = ['</>', '{ }', '< />', '()', '=>', '[]', '#!', '&&', '||', '++', '/*', '*/'];

const features = [
  { icon: Code, title: 'Вайб-кодинг', desc: 'Создание сайтов и приложений с помощью AI — быстро, стильно, современно.' },
  { icon: Palette, title: 'Уникальный дизайн', desc: 'Каждый проект — авторский дизайн, отражающий вашу индивидуальность.' },
  { icon: Rocket, title: 'Быстрый запуск', desc: 'От идеи до рабочего продукта за дни, а не месяцы.' },
  { icon: Laptop, title: 'Полный цикл', desc: 'Лендинги, интернет-магазины, веб-приложения — под ключ.' },
];

const VibeCoding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header pageBadge={{ label: 'Вайб-кодинг', tone: 'purple' }} />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-purple/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-blue/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-2 lg:gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative order-1 lg:order-1 flex justify-center lg:justify-end group"
            >
              <motion.img
                src={vibeCodingHero}
                alt="Вайб-кодинг — DSN Nexoria"
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

              {/* Hover effects: soft ripples + floating code symbols */}
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

                {/* Floating code symbols that fade away */}
                {codeSymbols.map((symbol, i) => {
                  const angle = (i / codeSymbols.length) * Math.PI * 2;
                  const distance = 140;
                  const driftX = Math.cos(angle) * distance;
                  const driftY = Math.sin(angle) * distance;
                  const colors = ['text-neon-purple', 'text-neon-blue', 'text-neon-cyan', 'text-neon-pink'];
                  const color = colors[i % colors.length];
                  return (
                    <motion.div
                      key={`symbol-${i}`}
                      className={`absolute font-mono font-bold text-lg ${color}`}
                      style={{
                        textShadow: '0 0 12px currentColor',
                      }}
                      animate={{
                        x: [0, driftX],
                        y: [0, driftY],
                        opacity: [0, 1, 1, 0],
                        scale: [0.4, 1.2, 1, 0.6],
                        rotate: [0, i % 2 === 0 ? 20 : -20],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: 'easeOut',
                        times: [0, 0.2, 0.7, 1],
                      }}
                    >
                      {symbol}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="self-center lg:self-start inline-block text-sm font-medium text-neon-purple tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-purple/20 bg-neon-purple/5">
                Вайб-кодинг
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
                <span className="block">Сайты</span>
                <span className="block gradient-text">на вайбе</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                Создаю сайты и веб-приложения с помощью AI-инструментов.
                Современный стек, стильный дизайн, быстрый результат.
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
                className="glass rounded-2xl p-8 hover:border-neon-purple/30 transition-colors border border-border/30"
              >
                <f.icon className="w-10 h-10 text-neon-purple mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BookingForm iconSrc={vibeBookingIcon} />

      <Footer />
    </div>
  );
};

export default VibeCoding;
