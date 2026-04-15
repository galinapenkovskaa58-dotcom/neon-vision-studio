import Header from '@/components/landing/Header';
import Portfolio from '@/components/landing/Portfolio';
import Styles from '@/components/landing/Styles';
import Tariffs from '@/components/landing/Tariffs';
import Reviews from '@/components/landing/Reviews';
import BookingForm from '@/components/landing/BookingForm';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';

const Neurophoto = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero for Neurophoto */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-neon-blue/10 blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-neon-purple/15 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-sm font-medium text-neon-cyan tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5">
              Нейрофотосессии
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
              <span className="block">Магия</span>
              <span className="block gradient-text">нейрофото</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Создаю уникальные образы с помощью нейросетей и профессиональной фотографии. 
              Каждый кадр — это слияние искусства и искусственного интеллекта.
            </p>
            <button
              onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="neon-glow-btn text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold animate-glow-pulse"
            >
              Записаться на сессию
            </button>
          </motion.div>
        </div>
      </section>

      <Portfolio />
      <Styles />
      <Tariffs />
      <Reviews />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Neurophoto;
