import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Tag, CheckCircle2, XCircle, Mail, User, ChevronDown } from 'lucide-react';

type SourceFilter = 'all' | 'review' | 'portfolio';

export default function AdminPromocodes() {
  const [filter, setFilter] = useState<SourceFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: codes = [] } = useQuery({
    queryKey: ['promocodes', filter],
    queryFn: async () => {
      let q = supabase
        .from('promocodes')
        .select('*, reviews:review_id(client_name, email, service, text), portfolio_submissions:portfolio_submission_id(client_name, service)')
        .order('created_at', { ascending: false })
        .limit(500);
      if (filter !== 'all') q = q.eq('source', filter);
      const { data } = await q;
      return data || [];
    },
  });

  const used = codes.filter((c: any) => c.is_used).length;
  const unused = codes.length - used;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-heading font-bold">Промокоды</h2>
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-neon-cyan" /> Активные: <strong className="text-foreground">{unused}</strong></span>
          <span className="flex items-center gap-1.5"><XCircle size={14} className="text-muted-foreground" /> Использованы: <strong className="text-foreground">{used}</strong></span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'review', 'portfolio'] as SourceFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === s
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:text-foreground border border-border/40'
            }`}
          >
            {s === 'all' ? 'Все' : s === 'review' ? 'За отзыв (10%)' : 'За отзыв + портфолио (15%)'}
          </button>
        ))}
      </div>

      {codes.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Промокодов пока нет.</div>
      )}

      <div className="space-y-2">
        {codes.map((c: any) => {
          const client = c.reviews || c.portfolio_submissions;
          const isOpen = expanded === c.id;
          return (
            <div key={c.id} className={`glass rounded-xl overflow-hidden ${c.is_used ? 'opacity-60' : ''}`}>
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="w-full p-4 flex items-center justify-between gap-4 flex-wrap text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-wrap">
                  <Tag size={16} className={c.source === 'review' ? 'text-neon-cyan' : 'text-neon-pink'} />
                  <code className="font-mono font-bold text-base tracking-wider">{c.code}</code>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.source === 'review' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-pink/10 text-neon-pink'}`}>
                    {c.discount_percent}%
                  </span>
                  {client?.client_name && (
                    <span className="text-sm text-foreground/80 flex items-center gap-1.5">
                      <User size={12} className="text-muted-foreground" />
                      {client.client_name}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>{new Date(c.created_at).toLocaleDateString('ru')}</span>
                  {c.is_used ? (
                    <span className="text-foreground/60">использован {c.used_at ? new Date(c.used_at).toLocaleDateString('ru') : ''}</span>
                  ) : (
                    <span className="text-neon-cyan">активен</span>
                  )}
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-2 text-sm">
                  {client?.client_name && (
                    <div className="flex items-center gap-2"><User size={14} className="text-muted-foreground" /> <span className="text-muted-foreground">Клиент:</span> <strong>{client.client_name}</strong></div>
                  )}
                  {c.reviews?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <a href={`mailto:${c.reviews.email}`} className="text-neon-cyan hover:underline">{c.reviews.email}</a>
                    </div>
                  )}
                  {client?.service && (
                    <div className="text-muted-foreground">Услуга: <span className="text-foreground">{client.service}</span></div>
                  )}
                  {c.reviews?.text && (
                    <div className="text-muted-foreground">
                      Отзыв: <span className="text-foreground/80 italic">«{c.reviews.text.slice(0, 200)}{c.reviews.text.length > 200 ? '…' : ''}»</span>
                    </div>
                  )}
                  {!client && (
                    <div className="text-muted-foreground italic">Данные клиента недоступны</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
