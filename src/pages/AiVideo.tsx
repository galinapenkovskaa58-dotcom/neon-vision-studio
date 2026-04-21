import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Film, Sparkles, Zap, Clock } from 'lucide-react';
import aiVideoHero from '@/assets/ai-video-hero.png';

const features = [
  { icon: Film, title: 'AI Видеоролики', desc: 'Создание видео с помощью нейросетей — от концепта до финального монтажа.' },
  { icon: Sparkles, title: 'Музыкальные клипы', desc: 'Визуальные истории для ваших треков с уникальной AI-эстетикой.' },
  { icon: Zap, title: 'Рекламные ролики', desc: 'Короткие, яркие ролики для соцсетей и рекламных кампаний.' },
  { icon: Clock, title: 'Быстрое производство', desc: 'От идеи до готового видео за считанные дни, а не недели.' },
];

const AiVideo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-pink/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-purple/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative order-2 lg:order-1 flex justify-center"
            >
              <motion.img
                src={aiVideoHero}
                alt="AI Видео & Клипы — DSN Nexoria"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="relative w-full max-w-[520px] h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <span className="inline-block text-sm font-medium text-neon-pink tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-pink/20 bg-neon-pink/5">
                AI Видео & Клипы
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
                <span className="block">Видео</span>
                <span className="block gradient-text">нового поколения</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
                Создаю AI-видео, музыкальные клипы и рекламные ролики с использованием передовых нейросетей. 
                Каждый кадр — произведение цифрового искусства.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 hover:border-neon-pink/30 transition-colors border border-border/30"
              >
                <f.icon className="w-10 h-10 text-neon-pink mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Хотите обсудить проект?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Свяжитесь со мной, чтобы обсудить вашу идею для видео</p>
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

export default AiVideo;
