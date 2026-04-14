import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Стили', href: '#styles' },
  { label: 'Тарифы', href: '#tariffs' },
  { label: 'Отзывы', href: '#reviews' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-heading font-bold gradient-text">
          NEUROPHOTO
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-cyan group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <button
            onClick={() => scrollTo('#booking')}
            className="neon-glow-btn text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Записаться
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-xs font-semibold text-neon-purple border border-neon-purple/40 px-4 py-2 rounded-full hover:bg-neon-purple/10 transition-colors"
            >
              <Shield size={14} /> ADMIN
            </button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left text-foreground/80 hover:text-foreground py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('#booking')}
                className="neon-glow-btn text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold mt-2"
              >
                Записаться
              </button>
              {isAdmin && (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/admin'); }}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neon-purple border border-neon-purple/40 px-4 py-2.5 rounded-full hover:bg-neon-purple/10 transition-colors"
                >
                  <Shield size={14} /> ADMIN
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
