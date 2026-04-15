import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Film, Music, Code } from 'lucide-react';

const services = [
  {
    icon: Camera,
    title: 'Нейрофотосессии',
    desc: 'Уникальные AI-образы на стыке искусства и технологий. Портреты, стилизации, фэнтези.',
    href: '/neurophoto',
    color: 'neon-cyan',
  },
  {
    icon: Film,
    title: 'AI Видео & Клипы',
    desc: 'Создание видеороликов и музыкальных клипов с помощью нейросетей.',
    href: '/ai-video',
    color: 'neon-pink',
  },
  {
    icon: Music,
    title: 'Написание песен',
    desc: 'AI-музыка, тексты, вокал и полный продакшн — от идеи до готового трека.',
    href: '/songs',
    color: 'neon-cyan',
  },
  {
    icon: Code,
    title: 'Вейб-кодинг',
    desc: 'Стильные сайты и веб-приложения с помощью AI — быстро и под ключ.',
    href: '/vibe-coding',
    color: 'neon-purple',
  },
];

export default function Services() {
  return (
    <section className="py-24" id="services">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Наши <span className="gradient-text">направления</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Всё, что можно создать с помощью AI — мы уже делаем
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={s.href}
                className={`glass rounded-2xl p-8 flex flex-col gap-4 border border-border/30 hover:border-${s.color}/40 transition-all duration-300 group block h-full`}
              >
                <s.icon className={`w-12 h-12 text-${s.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-heading font-bold">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                <span className={`text-sm font-semibold text-${s.color} mt-auto`}>
                  Подробнее →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
