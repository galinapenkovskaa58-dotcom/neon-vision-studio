import { motion } from 'framer-motion';

const styles = [
  {
    title: 'Киберпанк',
    description: 'Неоновые огни, футуристические городские пейзажи и дерзкие образы в духе Blade Runner',
    color: 'from-neon-blue to-neon-cyan',
    glow: 'glow-blue',
  },
  {
    title: 'Фэнтези',
    description: 'Волшебные миры, эльфийские образы и сказочные пейзажи с магической атмосферой',
    color: 'from-neon-purple to-neon-pink',
    glow: 'glow-purple',
  },
  {
    title: 'Ретрофутуризм',
    description: 'Смешение винтажной эстетики 80-х с футуристическими элементами и синтвейв-стилистикой',
    color: 'from-neon-pink to-neon-blue',
    glow: 'glow-pink',
  },
  {
    title: 'Сюрреализм',
    description: 'Невозможные пространства, метаморфозы и визуальные иллюзии в духе Дали',
    color: 'from-neon-cyan to-neon-purple',
    glow: 'glow-cyan',
  },
];

export default function Styles() {
  return (
    <section id="styles" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-neon-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-neon-pink/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Стили <span className="gradient-text">съёмок</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Выберите направление или создадим что-то совершенно новое
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styles.map((style, i) => (
            <motion.div
              key={style.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass rounded-3xl p-8 group hover:${style.glow} transition-all duration-500 cursor-default`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center mb-6`}>
                <span className="text-2xl">✦</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">{style.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{style.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
