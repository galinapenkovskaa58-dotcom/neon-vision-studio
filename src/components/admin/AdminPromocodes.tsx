import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Tag, CheckCircle2, XCircle } from 'lucide-react';

type SourceFilter = 'all' | 'review' | 'portfolio';

export default function AdminPromocodes() {
  const [filter, setFilter] = useState<SourceFilter>('all');

  const { data: codes = [] } = useQuery({
    queryKey: ['promocodes', filter],
    queryFn: async () => {
      let q = supabase.from('promocodes').select('*').order('created_at', { ascending: false }).limit(500);
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
            {s === 'all' ? 'Все' : s === 'review' ? 'За отзывы (10%)' : 'За портфолио (15%)'}
          </button>
        ))}
      </div>

      {codes.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Промокодов пока нет.</div>
      )}

      <div className="space-y-2">
        {codes.map((c: any) => (
          <div key={c.id} className={`glass rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap ${c.is_used ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 min-w-0">
              <Tag size={16} className={c.source === 'review' ? 'text-neon-cyan' : 'text-neon-pink'} />
              <code className="font-mono font-bold text-base tracking-wider">{c.code}</code>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.source === 'review' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-pink/10 text-neon-pink'}`}>
                −{c.discount_percent}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span>{new Date(c.created_at).toLocaleDateString('ru')}</span>
              {c.is_used ? (
                <span className="text-foreground/60">использован {c.used_at ? new Date(c.used_at).toLocaleDateString('ru') : ''}</span>
              ) : (
                <span className="text-neon-cyan">активен</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
