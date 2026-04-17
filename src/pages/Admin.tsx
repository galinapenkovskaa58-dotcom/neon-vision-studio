import { useState } from 'react';
import logoImg from '@/assets/logo-dsn.png';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminPortfolio from '@/components/admin/AdminPortfolio';
import AdminTariffs from '@/components/admin/AdminTariffs';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminStyles from '@/components/admin/AdminStyles';
import {
  FileImage, CalendarCheck, Tags, MessageSquare, LogOut, Palette,
  Camera, Video, Music, Code2, ChevronDown, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Section = 'portfolio' | 'styles' | 'tariffs' | 'reviews';

const services: { id: string; label: string; icon: any }[] = [
  { id: 'neurophoto', label: 'Нейрофото', icon: Camera },
  { id: 'ai-video', label: 'AI Видео', icon: Video },
  { id: 'songs', label: 'Песни', icon: Music },
  { id: 'vibe-coding', label: 'Vibe Coding', icon: Code2 },
];

const sections: { id: Section; label: string; icon: any }[] = [
  { id: 'portfolio', label: 'Портфолио', icon: FileImage },
  { id: 'styles', label: 'Стили', icon: Palette },
  { id: 'tariffs', label: 'Тарифы', icon: Tags },
  { id: 'reviews', label: 'Отзывы', icon: MessageSquare },
];

export default function Admin() {
  const { isAdmin, loading, user } = useAdmin();
  // active = 'bookings' | `${serviceId}:${sectionId}`
  const [active, setActive] = useState<string>('bookings');
  const [openService, setOpenService] = useState<string | null>('neurophoto');
  const [, setNeedsRefresh] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={() => setNeedsRefresh(true)} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <h2 className="text-xl font-heading font-bold mb-3">Доступ запрещён</h2>
          <p className="text-muted-foreground mb-6">У вашего аккаунта нет прав администратора.</p>
          <Link to="/" className="text-neon-cyan hover:underline">← На главную</Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    if (active === 'bookings') return <AdminBookings />;
    const [serviceId, sectionId] = active.split(':') as [string, Section];
    if (!serviceId || !sectionId) return null;
    if (sectionId === 'portfolio') return <AdminPortfolio service={serviceId} />;
    if (sectionId === 'styles') return <AdminStyles service={serviceId} />;
    if (sectionId === 'tariffs') return <AdminTariffs service={serviceId} />;
    if (sectionId === 'reviews') return <AdminReviews service={serviceId} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-border/30 p-6 flex flex-col shrink-0">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={logoImg} alt="DSN" className="w-8 h-8 rounded-full" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-heading font-bold tracking-widest uppercase gradient-text">Dream Studio</span>
            <span className="text-[8px] font-heading font-medium tracking-[0.3em] uppercase text-muted-foreground">— Nexoria —</span>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {/* Заявки — общий раздел */}
          <button
            onClick={() => setActive('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === 'bookings'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <CalendarCheck size={18} />
            Заявки
          </button>

          <div className="pt-3 pb-1 px-4 text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Услуги
          </div>

          {services.map(({ id: svcId, label, icon: Icon }) => {
            const isOpen = openService === svcId;
            const isActiveService = active.startsWith(`${svcId}:`);
            return (
              <div key={svcId}>
                <button
                  onClick={() => setOpenService(isOpen ? null : svcId)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActiveService
                      ? 'text-foreground bg-muted/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {label}
                  </span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {isOpen && (
                  <div className="ml-4 mt-1 mb-2 space-y-1 border-l border-border/30 pl-2">
                    {sections.map(({ id: secId, label: secLabel, icon: SecIcon }) => {
                      const key = `${svcId}:${secId}`;
                      const isActive = active === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActive(key)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-primary/20 text-primary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <SecIcon size={14} />
                          {secLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors mt-3"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
