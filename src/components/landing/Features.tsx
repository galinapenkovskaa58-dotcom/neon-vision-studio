import { motion } from 'framer-motion';
import { Zap, Palette, Package, Lock, Headphones, Wallet } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Скорость AI', desc: 'То, что раньше делалось неделями — теперь за дни. Ускоряем без потери качества.', color: 'neon-cyan' },
  { icon: Palette, title: 'Авторский подход', desc: 'Не шаблонная генерация — каждый проект с уникальной концепцией и стилем.', color: 'neon-purple' },
  { icon: Package, title: 'Полный цикл', desc: 'От идеи и сценария до финальной шлифовки — всё в одном месте.', color: 'neon-pink' },
  { icon: Lock, title: 'Конфиденциальность', desc: 'Ваши материалы и идеи не уходят третьим лицам. Полная приватность.', color: 'neon-blue' },
  { icon: Headphones, title: 'Поддержка после сдачи', desc: 'Остаёмся на связи: правки, доработки и консультации после проекта.', color: 'neon-cyan' },
  { icon: Wallet, title: 'Гибкие тарифы', desc: 'От базовых пакетов до индивидуальных решений — подбираем под бюджет.', color: 'neon-purple' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Почему <span className="gradient-text">мы</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Шесть причин выбрать Dream Studio Nexoria для вашего проекта
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-2xl p-7 border border-border/30 hover:border-${f.color}/40 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${f.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 text-${f.color}`} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
