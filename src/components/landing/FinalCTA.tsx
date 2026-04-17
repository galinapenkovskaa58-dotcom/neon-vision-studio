import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';

export default function FinalCTA() {
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={scrollToServices}
                className="neon-glow-btn text-primary-foreground px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 group"
              >
                Выбрать услугу
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://t.me/nexoria"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-8 py-4 rounded-full text-base font-semibold flex items-center gap-2 hover:bg-card/80 transition-all border border-border/30"
              >
                <Send size={18} />
                Связаться в Telegram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
