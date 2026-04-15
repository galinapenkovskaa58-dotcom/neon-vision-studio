import { useState, useEffect } from 'react';
import logoImg from '@/assets/logo-dsn.png';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminPortfolio from '@/components/admin/AdminPortfolio';
import AdminTariffs from '@/components/admin/AdminTariffs';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminStyles from '@/components/admin/AdminStyles';
import { FileImage, CalendarCheck, Tags, MessageSquare, LogOut, Home, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'bookings', label: 'Заявки', icon: CalendarCheck },
  { id: 'portfolio', label: 'Портфолио', icon: FileImage },
  { id: 'styles', label: 'Стили', icon: Palette },
  { id: 'tariffs', label: 'Тарифы', icon: Tags },
  { id: 'reviews', label: 'Отзывы', icon: MessageSquare },
];

export default function Admin() {
  const { isAdmin, loading, user } = useAdmin();
  const [activeTab, setActiveTab] = useState('bookings');
  const [needsRefresh, setNeedsRefresh] = useState(false);

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

        <nav className="flex-1 space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'portfolio' && <AdminPortfolio />}
        {activeTab === 'styles' && <AdminStyles />}
        {activeTab === 'tariffs' && <AdminTariffs />}
        {activeTab === 'reviews' && <AdminReviews />}
      </main>
    </div>
  );
}
