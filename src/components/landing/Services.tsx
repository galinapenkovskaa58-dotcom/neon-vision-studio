import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Film, Music, Code, Code2 } from 'lucide-react';

const directions = [
  { icon: Camera, label: 'Нейрофото', color: 'text-neon-cyan', to: '/neurophoto' },
  { icon: Film, label: 'AI-видео', color: 'text-neon-pink', to: '/ai-video' },
  { icon: Music, label: 'AI-музыка', color: 'text-neon-purple', to: '/songs' },
  { icon: Code2, label: 'Вейб-кодинг', color: 'text-neon-blue', to: '/vibe-coding' },
];

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

        {/* Marquee with directions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-16 w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex gap-4 w-max"
          >
            {[...directions, ...directions, ...directions].map((d, i) => (
              <Link
                key={i}
                to={d.to}
                className="glass flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 hover:border-white/30 transition-all hover:scale-105 shrink-0"
              >
                <d.icon className={`w-5 h-5 ${d.color}`} />
                <span className="font-medium whitespace-nowrap">{d.label}</span>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
