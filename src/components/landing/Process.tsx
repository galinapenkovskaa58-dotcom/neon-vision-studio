import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Lightbulb, PenTool, Bot, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  { icon: Lightbulb, title: 'Идея', desc: 'Обсуждаем задачу, цели и видение результата', hsl: '190 100% 61%' },
  { icon: PenTool, title: 'Концепция', desc: 'Создаём мудборд, референсы и техническое задание', hsl: '220 100% 59%' },
  { icon: Bot, title: 'AI-создание', desc: 'Генерируем, дорабатываем и шлифуем результат', hsl: '272 100% 65%' },
  { icon: CheckCircle2, title: 'Результат', desc: 'Сдаём готовый проект и поддерживаем после', hsl: '320 100% 65%' },
];

const flights = [
  { icon: Lightbulb, from: 0, to: 1, hsl: '190 100% 61%' },
  { icon: PenTool, from: 1, to: 2, hsl: '220 100% 59%' },
  { icon: Bot, from: 2, to: 3, hsl: '272 100% 65%' },
] as const;

const positions = ['12.5%', '37.5%', '62.5%', '87.5%'];
const successHsl = '142 72% 50%';

export default function Process() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    if (reduceMotion) {
      setPhase(-1);
      return;
    }

    let cancelled = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const travelDuration = 1700;
    const handoffDelay = 220;
    const finaleDuration = 2600;
    const stepDuration = travelDuration + handoffDelay;
    const idleDuration = 260;
    const fullCycle = idleDuration + stepDuration * flights.length + finaleDuration;

    const cycle = () => {
      if (cancelled) return;

      setPhase(-1);
      timeouts.push(setTimeout(() => setPhase(0), idleDuration));
      timeouts.push(setTimeout(() => setPhase(1), idleDuration + stepDuration));
      timeouts.push(setTimeout(() => setPhase(2), idleDuration + stepDuration * 2));
      timeouts.push(setTimeout(() => setPhase(3), idleDuration + stepDuration * 3));
      timeouts.push(setTimeout(cycle, fullCycle));
    };

    cycle();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [reduceMotion]);

  const activeFlight = phase >= 0 && phase < flights.length ? flights[phase] : null;

  return (
    <section id="process" className="py-24 relative overflow-hidden">
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
          <div
            className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] opacity-60"
            style={{
              background: 'linear-gradient(90deg, hsl(190 100% 61%), hsl(220 100% 59%), hsl(272 100% 65%), hsl(320 100% 65%), hsl(190 100% 61%))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }}
          />

          <AnimatePresence mode="wait">
            {!reduceMotion && activeFlight && (
              <motion.div
                key={`flight-${phase}`}
                className="hidden md:block absolute pointer-events-none z-[40] -translate-x-1/2 -translate-y-1/2"
                style={{ top: '40px' }}
                initial={{ left: positions[activeFlight.from], opacity: 0, scale: 0.15 }}
                animate={{
                  left: positions[activeFlight.to],
                  opacity: [0, 1, 1, 0.02],
                  scale: [0.15, 1.12, 1.05, 0.45],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.7, times: [0, 0.14, 0.82, 1], ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [-6, 6, -6] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div
                    className="absolute inset-[-18px] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle, hsl(${activeFlight.hsl} / 0.82) 0%, hsl(${activeFlight.hsl} / 0.28) 45%, transparent 72%)`,
                    }}
                  />
                  <activeFlight.icon
                    className="relative w-12 h-12"
                    strokeWidth={2.3}
                    style={{
                      color: `hsl(${activeFlight.hsl})`,
                      filter: `drop-shadow(0 0 10px hsl(${activeFlight.hsl} / 1)) drop-shadow(0 0 28px hsl(${activeFlight.hsl} / 0.85))`,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, i) => {
              const isSource = !reduceMotion && activeFlight?.from === i;
              const isIncoming = !reduceMotion && activeFlight?.to === i;
              const isFinale = !reduceMotion && phase === 3 && i === 3;

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
                    animate={isSource || isIncoming || isFinale ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-20 h-20 rounded-full glass-strong border-2 flex items-center justify-center mb-5 z-10 md:animate-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.4}s`,
                      borderColor: `hsl(${step.hsl} / 0.4)`,
                      boxShadow: isSource || isIncoming || isFinale ? `0 0 30px hsl(${step.hsl} / 0.7), 0 0 60px hsl(${step.hsl} / 0.4)` : undefined,
                    }}
                  >
                    <AnimatePresence>
                      {!reduceMotion && phase === -1 && i === 0 && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0.85, scale: 1 }}
                          animate={{ opacity: [0.72, 1, 0.72], scale: [1, 1.18, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div
                            className="absolute inset-[-12px] rounded-full blur-xl"
                            style={{ background: `radial-gradient(circle, hsl(${steps[0].hsl} / 0.62), transparent 72%)` }}
                          />
                          <Lightbulb
                            className="relative w-10 h-10"
                            strokeWidth={2.4}
                            style={{
                              color: `hsl(${steps[0].hsl})`,
                              filter: `drop-shadow(0 0 10px hsl(${steps[0].hsl} / 0.95)) drop-shadow(0 0 26px hsl(${steps[0].hsl} / 0.7))`,
                            }}
                          />
                        </motion.div>
                      )}

                      {!reduceMotion && isSource && activeFlight && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 1, opacity: 0.15 }}
                          animate={{ scale: [1, 1.32, 1.58], opacity: [0.15, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                        >
                          <div
                            className="absolute inset-[-12px] rounded-full blur-xl"
                            style={{ background: `radial-gradient(circle, hsl(${activeFlight.hsl} / 0.7), transparent 72%)` }}
                          />
                          <activeFlight.icon
                            className="relative w-10 h-10"
                            strokeWidth={2.4}
                            style={{
                              color: `hsl(${activeFlight.hsl})`,
                              filter: `drop-shadow(0 0 10px hsl(${activeFlight.hsl} / 0.95)) drop-shadow(0 0 26px hsl(${activeFlight.hsl} / 0.75))`,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!reduceMotion && phase === -1 && i === 0 && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0.85, scale: 1 }}
                        animate={{ opacity: [0.72, 1, 0.72], scale: [1, 1.18, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div
                          className="absolute inset-[-12px] rounded-full blur-xl"
                          style={{ background: `radial-gradient(circle, hsl(${steps[0].hsl} / 0.62), transparent 72%)` }}
                        />
                        <Lightbulb
                          className="relative w-10 h-10"
                          strokeWidth={2.4}
                          style={{
                            color: `hsl(${steps[0].hsl})`,
                            filter: `drop-shadow(0 0 10px hsl(${steps[0].hsl} / 0.95)) drop-shadow(0 0 26px hsl(${steps[0].hsl} / 0.7))`,
                          }}
                        />
                      </motion.div>
                    )}

                    <step.icon className="w-8 h-8" style={{ color: `hsl(${step.hsl})` }} />

                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{
                        backgroundColor: `hsl(${step.hsl})`,
                        color: 'hsl(var(--background))',
                      }}
                    >
                      {i + 1}
                    </div>

                    <AnimatePresence>
                      {isFinale && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: [0.4, 1.45, 1, 1.08, 1], opacity: [0, 1, 1, 0.98, 0.95] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.8, times: [0, 0.22, 0.45, 0.72, 1], repeat: Infinity, repeatDelay: 0.15 }}
                        >
                          <div
                            className="absolute inset-[-10px] rounded-full blur-xl"
                            style={{
                              background: `radial-gradient(circle, hsl(${successHsl} / 0.65), transparent 70%)`,
                            }}
                          />
                          <CheckCircle2
                            className="relative w-10 h-10"
                            strokeWidth={2.5}
                            style={{
                              color: `hsl(${successHsl})`,
                              filter: `drop-shadow(0 0 12px hsl(${successHsl} / 0.95)) drop-shadow(0 0 30px hsl(${successHsl} / 0.75))`,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
