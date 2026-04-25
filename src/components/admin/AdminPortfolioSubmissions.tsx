import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ExternalLink } from 'lucide-react';

type StatusFilter = 'pending' | 'approved' | 'rejected';

const tabLabels: Record<StatusFilter, string> = {
  pending: 'На модерации',
  approved: 'Опубликованы',
  rejected: 'Отклонены',
};

export default function AdminPortfolioSubmissions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<StatusFilter>('pending');

  const { data: submissions = [] } = useQuery({
    queryKey: ['portfolio-submissions', tab],
    queryFn: async () => {
      const { data } = await supabase
        .from('portfolio_submissions')
        .select('*')
        .eq('status', tab)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: counts = { pending: 0, approved: 0, rejected: 0 } } = useQuery({
    queryKey: ['portfolio-submissions-counts'],
    queryFn: async () => {
      const result: Record<StatusFilter, number> = { pending: 0, approved: 0, rejected: 0 };
      for (const s of ['pending', 'approved', 'rejected'] as StatusFilter[]) {
        const { count } = await supabase
          .from('portfolio_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', s);
        result[s] = count ?? 0;
      }
      return result;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolio-submissions'] });
    queryClient.invalidateQueries({ queryKey: ['portfolio-submissions-counts'] });
  };

  const approve = useMutation({
    mutationFn: async (sub: any) => {
      // Copy first media URL into portfolio (admin can edit later)
      const firstImage = (sub.media_urls?.[0] as string) || sub.external_link || null;
      if (firstImage) {
        const { error: pErr } = await supabase.from('portfolio').insert({
          service: sub.service,
          title: `Работа клиента — ${sub.client_name}`,
          description: sub.description,
          image_url: firstImage,
        } as any);
        if (pErr) throw pErr;
      }
      const { error } = await supabase
        .from('portfolio_submissions')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', sub.id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: 'Опубликовано в портфолио' });
    },
    onError: (e: any) => toast({ title: 'Ошибка', description: e.message, variant: 'destructive' }),
  });

  const reject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_submissions').update({ status: 'rejected' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return (
    <div>
      <h2 className="text-xl font-heading font-bold mb-6">Заявки в портфолио</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === s
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:text-foreground border border-border/40'
            }`}
          >
            {tabLabels[s]} <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Нет заявок.</div>
      )}

      <div className="space-y-4">
        {submissions.map((s: any) => (
          <div key={s.id} className="glass rounded-2xl p-6">
            <div className="flex justify-between gap-4 mb-3 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-widest text-neon-cyan">{s.service}</div>
                <h3 className="font-semibold text-lg">{s.client_name}</h3>
                <div className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleString('ru')}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {tab !== 'approved' && (
                  <Button size="sm" className="neon-glow-btn rounded-full text-primary-foreground" onClick={() => approve.mutate(s)}>
                    <Check size={14} /> Опубликовать
                  </Button>
                )}
                {tab !== 'rejected' && (
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => reject.mutate(s.id)}>
                    <X size={14} /> Отклонить
                  </Button>
                )}
              </div>
            </div>

            {s.description && <p className="text-sm text-foreground/80 mb-3">{s.description}</p>}

            {s.media_urls?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {s.media_urls.map((url: string) =>
                  /\.(jpe?g|png|webp|gif)$/i.test(url) ? (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="block w-24 h-24 rounded-lg overflow-hidden border border-border/40">
                      <img src={url} alt="submission" className="w-full h-full object-cover" />
                    </a>
                  ) : (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-border/40 text-xs text-neon-cyan hover:bg-muted/50">
                      📎 {url.split('/').pop()}
                    </a>
                  )
                )}
              </div>
            )}

            {s.external_link && (
              <a href={s.external_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-neon-cyan hover:underline">
                <ExternalLink size={14} /> {s.external_link}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
