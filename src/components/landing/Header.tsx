import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImg from '@/assets/logo-dsn.png';

const serviceItems = [
  { label: 'Нейрофотосессии', href: '/neurophoto' },
  { label: 'AI Видео & Клипы', href: '/ai-video' },
  { label: 'Написание песен', href: '/songs' },
  { label: 'Вейб-кодинг', href: '/vibe-coding' },
];

const pageNavItems: Record<string, { label: string; anchor: string }[]> = {
  '/neurophoto': [
    { label: 'Портфолио', anchor: '#portfolio' },
    { label: 'Стили', anchor: '#styles' },
    { label: 'Тарифы', anchor: '#tariffs' },
    { label: 'Записаться', anchor: '#booking' },
  ],
  '/ai-video': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Связаться', anchor: '#contact' },
  ],
  '/songs': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Связаться', anchor: '#contact' },
  ],
  '/vibe-coding': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Связаться', anchor: '#contact' },
  ],
  '/': [
    { label: 'О студии', anchor: '#about' },
    { label: 'Процесс', anchor: '#process' },
  ],
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPageNav = pageNavItems[location.pathname] || [];
  const isHome = location.pathname === '/';

  const scrollToSection = (anchor: string) => {
    const el = document.querySelector(anchor);
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (reviewsRef.current && !reviewsRef.current.contains(e.target as Node)) {
        setReviewsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="flex flex-col items-center gap-1 transition-all duration-500">
          <img src={logoImg} alt="Dream Studio Nexoria" className={`rounded-full transition-all duration-500 ${scrolled ? 'w-10 h-10 md:w-14 md:h-14' : 'w-16 h-16 md:w-28 md:h-28'}`} />
          <div className={`flex flex-col items-center leading-none transition-all duration-500 ${scrolled ? 'scale-90' : ''}`}>
            <span className={`font-heading font-bold tracking-widest uppercase gradient-text transition-all duration-500 ${scrolled ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'}`}>Dream Studio</span>
            <span className={`font-heading font-medium tracking-[0.35em] uppercase text-muted-foreground transition-all duration-500 ${scrolled ? 'text-[5px] md:text-[6px]' : 'text-[7px] md:text-[8px]'}`}>— Nexoria —</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Services dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
            >
              Услуги
              <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 glass-strong rounded-xl border border-border/30 overflow-hidden"
                >
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setServicesOpen(false)}
                      className="block px-5 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-card/50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reviews dropdown (home only) */}
          {isHome && (
            <div ref={reviewsRef} className="relative">
              <button
                onClick={() => setReviewsOpen(!reviewsOpen)}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
              >
                Отзывы
                <ChevronDown size={14} className={`transition-transform ${reviewsOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {reviewsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 glass-strong rounded-xl border border-border/30 overflow-hidden"
                  >
                    <button
                      onClick={() => { setReviewsOpen(false); scrollToSection('#reviews'); }}
                      className="block w-full text-left px-5 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-card/50 transition-colors border-b border-border/20"
                    >
                      Все отзывы
                    </button>
                    {serviceItems.map((item) => (
                      <Link
                        key={item.href}
                        to={`${item.href}#reviews`}
                        onClick={() => setReviewsOpen(false)}
                        className="block px-5 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-card/50 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Page section nav */}
          {currentPageNav.map((item) => (
            <button
              key={item.anchor}
              onClick={() => scrollToSection(item.anchor)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-cyan group-hover:w-full transition-all duration-300" />
            </button>
          ))}

          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
            Главная
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-cyan group-hover:w-full transition-all duration-300" />
          </Link>

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
            <div className="flex flex-col p-6 gap-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-left text-foreground/80 hover:text-foreground py-2"
              >
                Главная
              </Link>

              {currentPageNav.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-3 mb-1">Разделы</p>
                  {currentPageNav.map((item) => (
                    <button
                      key={item.anchor}
                      onClick={() => scrollToSection(item.anchor)}
                      className="text-left text-foreground/80 hover:text-foreground py-2 pl-3"
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}

              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-3 mb-1">Услуги</p>
              {serviceItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-foreground/80 hover:text-foreground py-2 pl-3"
                >
                  {item.label}
                </Link>
              ))}

              {isHome && (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-3 mb-1">Отзывы</p>
                  <button
                    onClick={() => scrollToSection('#reviews')}
                    className="text-left text-foreground/80 hover:text-foreground py-2 pl-3"
                  >
                    Все отзывы
                  </button>
                  {serviceItems.map((item) => (
                    <Link
                      key={`reviews-${item.href}`}
                      to={`${item.href}#reviews`}
                      onClick={() => setMobileOpen(false)}
                      className="text-left text-foreground/80 hover:text-foreground py-2 pl-3"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
              {isAdmin && (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/admin'); }}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neon-purple border border-neon-purple/40 px-4 py-2.5 rounded-full hover:bg-neon-purple/10 transition-colors mt-4"
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
