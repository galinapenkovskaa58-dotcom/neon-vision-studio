import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImg from '@/assets/logo-dsn.png';
import AskQuestionDialog from '@/components/AskQuestionDialog';

const serviceItems = [
  { label: 'Нейрофотосессии', href: '/neurophoto' },
  { label: 'AI Видео & Клипы', href: '/ai-video' },
  { label: 'AI-музыка', href: '/songs' },
  { label: 'Вайб-кодинг', href: '/vibe-coding' },
];

const pageNavItems: Record<string, { label: string; anchor: string }[]> = {
  '/neurophoto': [
    { label: 'Портфолио', anchor: '#portfolio' },
    { label: 'Стили', anchor: '#styles' },
    { label: 'Тарифы', anchor: '#tariffs' },
    { label: 'Отзывы', anchor: '#reviews' },
    { label: 'Записаться', anchor: '#booking' },
  ],
  '/ai-video': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Отзывы', anchor: '#reviews' },
    { label: 'Связаться', anchor: '#booking' },
  ],
  '/songs': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Отзывы', anchor: '#reviews' },
    { label: 'Связаться', anchor: '#booking' },
  ],
  '/vibe-coding': [
    { label: 'Возможности', anchor: '#features' },
    { label: 'Отзывы', anchor: '#reviews' },
    { label: 'Связаться', anchor: '#booking' },
  ],
  '/': [
    { label: 'О студии', anchor: '#about' },
    { label: 'Процесс', anchor: '#process' },
  ],
};

type BadgeTone = 'cyan' | 'pink' | 'purple' | 'blue';

interface HeaderProps {
  pageBadge?: { label: string; tone?: BadgeTone };
}

const toneClasses: Record<BadgeTone, string> = {
  cyan: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.25)]',
  pink: 'text-neon-pink border-neon-pink/30 bg-neon-pink/5 shadow-[0_0_20px_hsl(var(--neon-pink)/0.25)]',
  purple: 'text-neon-purple border-neon-purple/30 bg-neon-purple/5 shadow-[0_0_20px_hsl(var(--neon-purple)/0.25)]',
  blue: 'text-neon-blue border-neon-blue/30 bg-neon-blue/5 shadow-[0_0_20px_hsl(var(--neon-blue)/0.25)]',
};

export default function Header({ pageBadge }: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
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
        <div className="flex items-center gap-4">
          <Link to="/" onClick={handleLogoClick} aria-label="Главная" className="flex items-center transition-all duration-500">
            <img src={logoImg} alt="DSN Nexoria — AI Studio" className={`transition-all duration-500 ${scrolled ? 'h-12 md:h-16' : 'h-20 md:h-28'} w-auto`} />
          </Link>

          {/* Page badge — appears on scroll */}
          <AnimatePresence>
            {pageBadge && scrolled && (
              <motion.span
                initial={{ opacity: 0, x: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`hidden sm:inline-block text-[11px] md:text-xs font-medium tracking-widest uppercase px-3 py-1.5 md:px-4 md:py-2 rounded-full border ${toneClasses[pageBadge.tone ?? 'cyan']}`}
              >
                {pageBadge.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

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

          {isHome ? (
            <button
              onClick={() => setAskOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-neon-cyan border border-neon-cyan/40 bg-neon-cyan/5 px-4 py-2 rounded-full hover:bg-neon-cyan/10 hover:shadow-[0_0_18px_hsl(var(--neon-cyan)/0.4)] transition-all"
            >
              <MessageCircleQuestion size={14} />
              Задать вопрос
            </button>
          ) : (
            <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              На главную
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-cyan group-hover:w-full transition-all duration-300" />
            </Link>
          )}

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
              {isHome ? (
                <button
                  onClick={() => { setMobileOpen(false); setAskOpen(true); }}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-neon-cyan border border-neon-cyan/40 bg-neon-cyan/5 px-4 py-2.5 rounded-full hover:bg-neon-cyan/10 transition-colors mb-2"
                >
                  <MessageCircleQuestion size={14} />
                  Задать вопрос
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-foreground/80 hover:text-foreground py-2"
                >
                  На главную
                </Link>
              )}

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

      <AskQuestionDialog open={askOpen} onOpenChange={setAskOpen} />
    </motion.header>
  );
}
