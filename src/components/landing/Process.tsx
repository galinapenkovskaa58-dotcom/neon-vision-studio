import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, CheckCircle2, Lightbulb, PenTool } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const steps = [
  { icon: Lightbulb, title: 'Идея', desc: 'Обсуждаем задачу, цели и видение результата', hsl: '190 100% 61%' },
  { icon: PenTool, title: 'Концепция', desc: 'Создаём мудборд, референсы и техническое задание', hsl: '220 100% 59%' },
  { icon: Bot, title: 'AI-создание', desc: 'Генерируем, дорабатываем и шлифуем результат', hsl: '272 100% 65%' },
  { icon: CheckCircle2, title: 'Результат', desc: 'Сдаём готовый проект и поддерживаем после', hsl: '320 100% 65%' },
] as const;

const flights = [
  { icon: Lightbulb, from: 0, to: 1, hsl: '190 100% 61%' },
  { icon: PenTool, from: 1, to: 2, hsl: '220 100% 59%' },
  { icon: Bot, from: 2, to: 3, hsl: '272 100% 65%' },
] as const;

const positions = ['12.5%', '37.5%', '62.5%', '87.5%'] as const;
const successHsl = '142 72% 50%';

export default function Process() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        threshold: 0.22,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setPhase(-1);
      return;
    }

    if (reduceMotion) {
      setPhase(3);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const introDelay = 320;
    const travelDuration = 1650;
    const handoffDelay = 180;
    const finalDuration = 2200;
    const segmentDuration = travelDuration + handoffDelay;
    const cycleDuration = introDelay + segmentDuration * flights.length + finalDuration;

    const runCycle = () => {
      setPhase(-1);

      timeouts.push(setTimeout(() => setPhase(0), introDelay));
      timeouts.push(setTimeout(() => setPhase(1), introDelay + segmentDuration));
      timeouts.push(setTimeout(() => setPhase(2), introDelay + segmentDuration * 2));
      timeouts.push(setTimeout(() => setPhase(3), introDelay + segmentDuration * 3));
      timeouts.push(setTimeout(runCycle, cycleDuration));
    };

    runCycle();

    return () => timeouts.forEach(clearTimeout);
  }, [isVisible, reduceMotion]);

  const activeFlight = phase >= 0 && phase < flights.length ? flights[phase] : null;
  const MovingIcon = activeFlight?.icon;

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-heading font-bold md:text-5xl">
            Как мы <span className="gradient-text">работаем</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Прозрачный процесс — от первой идеи до готового проекта
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-6xl">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-[2px] opacity-70 md:block"
            style={{
              background: 'linear-gradient(90deg, hsl(190 100% 61%), hsl(220 100% 59%), hsl(272 100% 65%), hsl(320 100% 65%), hsl(190 100% 61%))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }}
          />

          <AnimatePresence mode="wait">
            {!reduceMotion && isVisible && activeFlight && MovingIcon && (
              <motion.div
                key={`flight-${phase}`}
                className="pointer-events-none absolute top-10 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                initial={{ left: positions[activeFlight.from], opacity: 0, scale: 0.25 }}
                animate={{
                  left: positions[activeFlight.to],
                  opacity: [0, 1, 1, 0],
                  scale: [0.25, 1.16, 1.08, 0.48],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.65, ease: 'easeInOut', times: [0, 0.12, 0.84, 1] }}
              >
                <motion.div
                  className="relative"
                  animate={{ y: [0, -6, 0], rotate: [-8, 8, -4] }}
                  transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="absolute inset-[-20px] rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle, hsl(${activeFlight.hsl} / 0.9) 0%, hsl(${activeFlight.hsl} / 0.35) 42%, transparent 74%)`,
                    }}
                  />
                  <MovingIcon
                    className="relative h-12 w-12"
                    strokeWidth={2.4}
                    style={{
                      color: `hsl(${activeFlight.hsl})`,
                      filter: `drop-shadow(0 0 12px hsl(${activeFlight.hsl} / 1)) drop-shadow(0 0 34px hsl(${activeFlight.hsl} / 0.82))`,
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isSource = activeFlight?.from === i;
              const isTarget = activeFlight?.to === i;
              const isIdleStarter = isVisible && phase === -1 && i === 0;
              const isFinal = isVisible && phase === 3 && i === 3;
              const sourceIconHsl = activeFlight?.hsl ?? step.hsl;
              const SourceIcon = activeFlight?.icon ?? Lightbulb;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={isSource || isTarget || isFinal ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-full glass-strong border-2 md:animate-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.35}s`,
                      borderColor: `hsl(${step.hsl} / 0.42)`,
                      boxShadow: isSource || isTarget || isFinal
                        ? `0 0 28px hsl(${step.hsl} / 0.7), 0 0 60px hsl(${step.hsl} / 0.35)`
                        : undefined,
                    }}
                  >
                    <StepIcon className="h-8 w-8" style={{ color: `hsl(${step.hsl})` }} />

                    <div
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `hsl(${step.hsl})`,
                        color: 'hsl(var(--background))',
                      }}
                    >
                      {i + 1}
                    </div>

                    <AnimatePresence>
                      {isIdleStarter && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0.7, scale: 1 }}
                          animate={{ opacity: [0.72, 1, 0.72], scale: [1, 1.18, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div
                            className="absolute inset-[-12px] rounded-full blur-xl"
                            style={{ background: `radial-gradient(circle, hsl(${steps[0].hsl} / 0.68), transparent 72%)` }}
                          />
                          <Lightbulb
                            className="relative h-10 w-10"
                            strokeWidth={2.4}
                            style={{
                              color: `hsl(${steps[0].hsl})`,
                              filter: `drop-shadow(0 0 10px hsl(${steps[0].hsl} / 1)) drop-shadow(0 0 28px hsl(${steps[0].hsl} / 0.8))`,
                            }}
                          />
                        </motion.div>
                      )}

                      {isSource && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 1, opacity: 0.2 }}
                          animate={{ scale: [1, 1.34, 1.62], opacity: [0.2, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                          <div
                            className="absolute inset-[-12px] rounded-full blur-xl"
                            style={{ background: `radial-gradient(circle, hsl(${sourceIconHsl} / 0.7), transparent 72%)` }}
                          />
                          <SourceIcon
                            className="relative h-10 w-10"
                            strokeWidth={2.4}
                            style={{
                              color: `hsl(${sourceIconHsl})`,
                              filter: `drop-shadow(0 0 10px hsl(${sourceIconHsl} / 1)) drop-shadow(0 0 30px hsl(${sourceIconHsl} / 0.75))`,
                            }}
                          />
                        </motion.div>
                      )}

                      {isFinal && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.35 }}
                          animate={{ opacity: [0, 1, 0.94, 1], scale: [0.35, 1.46, 1, 1.08] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.9, repeat: Infinity, repeatDelay: 0.1, ease: 'easeInOut' }}
                        >
                          <div
                            className="absolute inset-[-14px] rounded-full blur-xl"
                            style={{ background: `radial-gradient(circle, hsl(${successHsl} / 0.68), transparent 70%)` }}
                          />
                          <CheckCircle2
                            className="relative h-11 w-11"
                            strokeWidth={2.5}
                            style={{
                              color: `hsl(${successHsl})`,
                              filter: `drop-shadow(0 0 12px hsl(${successHsl} / 1)) drop-shadow(0 0 34px hsl(${successHsl} / 0.78))`,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <h3 className="mb-2 text-xl font-heading font-bold">{step.title}</h3>
                  <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}