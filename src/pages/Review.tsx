import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, ShieldCheck, MessageSquareHeart } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ReviewDialog from '@/components/ReviewDialog';

export default function Review() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header pageBadge={{ label: 'Отзывы', tone: 'cyan' }} />

      <main className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[160px]" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-neon-cyan border border-neon-cyan/30 px-4 py-1.5 rounded-full mb-6">
              Спасибо, что были с нами
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-5">
              <span className="gradient-text">Помогите нам стать лучше — получите бонус 💜</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Ваши проекты — это то, чем мы гордимся.<br />
              И нам важно делиться работами 💫
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-strong rounded-3xl p-8 md:p-12 border border-border/40 mb-12"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan/30 mb-6">
                <MessageSquareHeart size={40} className="text-neon-cyan" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">Готовы рассказать о работе?</h2>
              <p className="text-muted-foreground mb-2 max-w-lg mx-auto">
                Оставьте отзыв о работе и получите{' '}
                <span className="text-neon-cyan font-semibold">+10% бонуса</span> на следующий проект.
              </p>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Если вы разрешите нам показать результат в портфолио —<br />
                мы добавим ещё <span className="text-neon-pink font-semibold">+5%</span> (итого{' '}
                <span className="text-neon-pink font-semibold">15%</span>).
              </p>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-3 neon-glow-btn text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold"
              >
                <Sparkles size={20} />
                Оставить отзыв
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Gift, title: 'Двойной подарок', text: 'До 25% скидки совокупно — 10% за отзыв + 15% за материал в портфолио.', tone: 'cyan' },
              { icon: ShieldCheck, title: 'Модерация', text: 'Опубликуем отзыв после короткой проверки в течение 1–2 дней.', tone: 'purple' },
              { icon: Sparkles, title: 'Одноразовые коды', text: 'Промокоды действуют на любую услугу студии.', tone: 'pink' },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-border/30"
                >
                  <Icon size={24} className={`mb-3 text-neon-${b.tone}`} />
                  <h3 className="font-heading font-semibold mb-1.5">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <ReviewDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
