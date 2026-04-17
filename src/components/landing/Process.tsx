import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Lightbulb, PenTool, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  { icon: Lightbulb, title: 'Идея', desc: 'Обсуждаем задачу, цели и видение результата', color: 'neon-cyan', hsl: '190 100% 61%' },
  { icon: PenTool, title: 'Концепция', desc: 'Создаём мудборд, референсы и техническое задание', color: 'neon-blue', hsl: '220 100% 59%' },
  { icon: Sparkles, title: 'AI-создание', desc: 'Генерируем, дорабатываем и шлифуем результат', color: 'neon-purple', hsl: '272 100% 65%' },
  { icon: CheckCircle2, title: 'Результат', desc: 'Сдаём готовый проект и поддерживаем после', color: 'neon-pink', hsl: '320 100% 65%' },
];

const positions = ['12.5%', '37.5%', '62.5%', '87.5%'];

export default function Process() {
  const reduceMotion = useReducedMotion();
  const [segment, setSegment] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      timeouts.push(setTimeout(() => setSegment(1), 1800));
      timeouts.push(setTimeout(() => setSegment(2), 3600));
      timeouts.push(setTimeout(() => setSegment(3), 5400));
      timeouts.push(setTimeout(() => {
        setIsResetting(true);
        setSegment(0);
      }, 7600));
      timeouts.push(setTimeout(() => {
        setIsResetting(false);
        cycle();
      }, 7800));
    };
    cycle();

    return () => { timeouts.forEach(clearTimeout); };
  }, [reduceMotion]);

  const current = steps[segment];
  const CurrentIcon = current.icon;

  return (
    <section id="process" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Как мы <span className="gradient-text">работаем</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Прозрачный процесс — от первой идеи до готового проекта
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connector line - desktop, with running shimmer */}
          <div
            className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] opacity-60"
            style={{
              background: 'linear-gradient(90deg, hsl(190 100% 61%), hsl(220 100% 59%), hsl(272 100% 65%), hsl(320 100% 65%), hsl(190 100% 61%))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }}
          />

          {/* Flying capsule - desktop only */}
          {!reduceMotion && (
            <motion.div
              className="hidden md:block absolute pointer-events-none z-20"
              style={{ top: '40px', transform: 'translate(-50%, -50%)' }}
              animate={{ left: positions[segment] }}
              transition={isResetting ? { duration: 0 } : { duration: 1.5, ease: 'easeInOut' }}
            >
              <div className="relative">
                {/* Halo */}
                <div
                  className="absolute inset-[-8px] rounded-2xl blur-xl"
                  style={{
                    background: `radial-gradient(circle, hsl(${current.hsl} / 0.6), transparent 70%)`,
                    transition: 'background 0.4s ease',
                  }}
                />
                {/* Trail glow under capsule */}
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 w-8 h-6 rounded-full blur-md opacity-70"
                  style={{ background: `hsl(${current.hsl} / 0.5)` }}
                />
                {/* Capsule */}
                <div
                  className="relative w-10 h-14 rounded-2xl glass-strong border-2 flex items-center justify-center"
                  style={{
                    borderColor: `hsl(${current.hsl} / 0.7)`,
                    boxShadow: `0 0 20px hsl(${current.hsl} / 0.6), 0 0 40px hsl(${current.hsl} / 0.3)`,
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={segment}
                      initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CurrentIcon
                        className="w-5 h-5"
                        style={{
                          color: `hsl(${current.hsl})`,
                          filter: `drop-shadow(0 0 6px hsl(${current.hsl} / 0.8))`,
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, i) => {
              const isActive = !reduceMotion && segment === i;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`relative w-20 h-20 rounded-full glass-strong border-2 border-${step.color}/40 flex items-center justify-center mb-5 z-10 md:animate-glow-pulse`}
                    style={{
                      animationDelay: `${i * 0.4}s`,
                      boxShadow: isActive ? `0 0 30px hsl(${step.hsl} / 0.7), 0 0 60px hsl(${step.hsl} / 0.4)` : undefined,
                    }}
                  >
                    <step.icon className={`w-8 h-8 text-${step.color}`} />
                    <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-${step.color} text-background text-xs font-bold flex items-center justify-center`}>
                      {i + 1}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
