import { motion } from 'framer-motion';
import { Lightbulb, PenTool, Sparkles, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: Lightbulb, title: 'Идея', desc: 'Обсуждаем задачу, цели и видение результата', color: 'neon-cyan' },
  { icon: PenTool, title: 'Концепция', desc: 'Создаём мудборд, референсы и техническое задание', color: 'neon-blue' },
  { icon: Sparkles, title: 'AI-создание', desc: 'Генерируем, дорабатываем и шлифуем результат', color: 'neon-purple' },
  { icon: CheckCircle2, title: 'Результат', desc: 'Сдаём готовый проект и поддерживаем после', color: 'neon-pink' },
];

export default function Process() {
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
          {/* Connector line - desktop */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`relative w-20 h-20 rounded-full glass-strong border-2 border-${step.color}/40 flex items-center justify-center mb-5 z-10`}>
                  <step.icon className={`w-8 h-8 text-${step.color}`} />
                  <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-${step.color} text-background text-xs font-bold flex items-center justify-center`}>
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
