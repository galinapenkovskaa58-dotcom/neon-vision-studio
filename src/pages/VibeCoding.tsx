import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Code, Laptop, Rocket, Palette } from 'lucide-react';

const features = [
  { icon: Code, title: 'Вейб-кодинг', desc: 'Создание сайтов и приложений с помощью AI — быстро, стильно, современно.' },
  { icon: Palette, title: 'Уникальный дизайн', desc: 'Каждый проект — авторский дизайн, отражающий вашу индивидуальность.' },
  { icon: Rocket, title: 'Быстрый запуск', desc: 'От идеи до рабочего продукта за дни, а не месяцы.' },
  { icon: Laptop, title: 'Полный цикл', desc: 'Лендинги, интернет-магазины, веб-приложения — под ключ.' },
];

const VibeCoding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-purple/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-blue/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-sm font-medium text-neon-purple tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-purple/20 bg-neon-purple/5">
              Вейб-кодинг
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
              <span className="block">Сайты</span>
              <span className="block gradient-text">на вайбе</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Создаю сайты и веб-приложения с помощью AI-инструментов. 
              Современный стек, стильный дизайн, быстрый результат.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
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

      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Нужен сайт?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Расскажите о вашем проекте — сделаю стильно и быстро</p>
          <a
            href="https://t.me/neurophoto"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-glow-btn text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold inline-block"
          >
            Написать в Telegram
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VibeCoding;
