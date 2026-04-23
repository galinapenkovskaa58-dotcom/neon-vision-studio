import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, MessageCircleQuestion } from 'lucide-react';
import RequestDialog, { type RequestVariant } from '@/components/RequestDialog';

export default function FinalCTA() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variant, setVariant] = useState<RequestVariant>('booking');

  const openDialog = (v: RequestVariant) => {
    setVariant(v);
    setDialogOpen(true);
  };

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden"
        >
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-pink/20" />
          <div className="absolute inset-0 glass-strong" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-neon-cyan/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-neon-pink/20 rounded-full blur-[100px]" />

          <div className="relative z-10 px-6 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Готовы воплотить <br className="hidden md:block" />
              <span className="gradient-text">вашу идею?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Расскажите о проекте — подберём направление, формат и тариф под вашу задачу.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <button
                onClick={() => openDialog('booking')}
                className="neon-glow-btn text-primary-foreground px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 group"
              >
                <Rocket size={18} />
                Оставить заявку
              </button>
              <button
                onClick={() => openDialog('project')}
                className="glass px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 hover:bg-card/80 transition-all border border-neon-purple/40 hover:border-neon-purple/70"
              >
                <Sparkles size={18} className="text-neon-purple" />
                Обсудить проект
              </button>
              <button
                onClick={() => openDialog('question')}
                className="px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircleQuestion size={18} />
                Задать вопрос
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <RequestDialog open={dialogOpen} onOpenChange={setDialogOpen} variant={variant} />
    </section>
  );
}
