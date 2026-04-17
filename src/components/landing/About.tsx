import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Sparkles, Users, Layers, Award } from 'lucide-react';

const stats = [
  { icon: Sparkles, value: 250, suffix: '+', label: 'Проектов', color: 'neon-cyan' },
  { icon: Users, value: 120, suffix: '+', label: 'Клиентов', color: 'neon-blue' },
  { icon: Layers, value: 4, suffix: '', label: 'Направления', color: 'neon-purple' },
  { icon: Award, value: 3, suffix: ' года', label: 'На рынке', color: 'neon-pink' },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 1.8, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, to, count]);

  useEffect(() => {
    return rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            Мы соединяем <span className="gradient-text">креатив и AI</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dream Studio Nexoria — это студия полного цикла, где идеи оживают через искусственный интеллект.
            Мы создаём то, что раньше было невозможно: уникальные образы, музыку, видео и цифровые продукты —
            быстро, авторски и под ключ.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-2xl p-6 text-center border border-border/30 hover:border-${s.color}/40 transition-all`}
            >
              <s.icon className={`w-8 h-8 mx-auto mb-3 text-${s.color}`} />
              <div className={`text-3xl md:text-4xl font-heading font-bold text-${s.color} mb-1`}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
