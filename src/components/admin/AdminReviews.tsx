import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star, Check, X, Mail, ChevronDown, Tag, User } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';

type StatusFilter = 'pending' | 'approved' | 'rejected';

export default function AdminReviews({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<StatusFilter>('approved');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ client_name: '', text: '', rating: '5', photo_url: '' });

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews', service, tab],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*, promocodes:promocodes!review_id(code, discount_percent, is_used, used_at, source)')
        .eq('service', service)
        .eq('status', tab)
        .order('sort_order');
      return data || [];
    },
  });

  const { data: counts = { pending: 0, approved: 0, rejected: 0 } } = useQuery({
    queryKey: ['admin-reviews-counts', service],
    queryFn: async () => {
      const result: Record<StatusFilter, number> = { pending: 0, approved: 0, rejected: 0 };
      for (const status of ['pending', 'approved', 'rejected'] as StatusFilter[]) {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('service', service)
          .eq('status', status);
        result[status] = count ?? 0;
      }
      return result;
    },
  });

  const reorder = useReorder('reviews', ['admin-reviews', service, tab]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-reviews', service] });
    queryClient.invalidateQueries({ queryKey: ['admin-reviews-counts', service] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        client_name: form.client_name,
        text: form.text,
        rating: parseInt(form.rating),
        photo_url: form.photo_url || null,
      };
      if (editing) {
        const { error } = await supabase.from('reviews').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ ...payload, sort_order: reviews.length, service, status: 'approved' } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateAll();
      setShowForm(false);
      setEditing(null);
      setForm({ client_name: '', text: '', rating: '5', photo_url: '' });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusFilter }) => {
      const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const startEdit = (r: any) => {
    setEditing(r);
    setForm({ client_name: r.client_name, text: r.text, rating: String(r.rating), photo_url: r.photo_url || '' });
    setShowForm(true);
  };

  const tabLabels: Record<StatusFilter, string> = {
    pending: 'На модерации',
    approved: 'Опубликованы',
    rejected: 'Отклонены',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-heading font-bold">Отзывы</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ client_name: '', text: '', rating: '5', photo_url: '' });
          }}
          className="neon-glow-btn rounded-full text-primary-foreground"
        >
          <Plus size={16} /> Добавить вручную
        </Button>
      </div>

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

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input
            placeholder="Имя клиента *"
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            className="bg-muted/50 rounded-xl"
          />
          <Textarea
            placeholder="Текст отзыва *"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="bg-muted/50 rounded-xl"
          />
          <div>
            <label className="block text-sm mb-2">Оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: String(n) })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={n <= parseInt(form.rating) ? 'fill-neon-cyan text-neon-cyan' : 'text-muted-foreground'}
                  />
                </button>
              ))}
            </div>
          </div>
          <Input
            placeholder="URL фото (опционально)"
            value={form.photo_url}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            className="bg-muted/50 rounded-xl"
          />
          <div className="flex gap-3">
            <Button
              onClick={() => save.mutate()}
              disabled={!form.client_name || !form.text}
              className="neon-glow-btn rounded-full text-primary-foreground"
            >
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          Нет отзывов в этом разделе.
        </div>
      )}

      {tab === 'approved' ? (
        <SortableWrapper
          items={reviews}
          onReorder={(o, n) => reorder.mutate({ items: reviews, oldIndex: o, newIndex: n })}
        >
          <div className="space-y-2">
            {reviews.map((r) => (
              <SortableItem key={r.id} id={r.id} className="glass rounded-xl overflow-hidden">
                <ReviewCard
                  r={r}
                  isOpen={expanded === r.id}
                  onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                  onEdit={startEdit}
                  onDelete={(id) => remove.mutate(id)}
                  onStatus={(id, s) => setStatus.mutate({ id, status: s })}
                  currentTab={tab}
                />
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="glass rounded-xl overflow-hidden">
              <ReviewCard
                r={r}
                isOpen={expanded === r.id}
                onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                onEdit={startEdit}
                onDelete={(id) => remove.mutate(id)}
                onStatus={(id, s) => setStatus.mutate({ id, status: s })}
                currentTab={tab}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  r,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onStatus,
  currentTab,
}: {
  r: any;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (r: any) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, status: StatusFilter) => void;
  currentTab: StatusFilter;
}) {
  const promo = Array.isArray(r.promocodes) ? r.promocodes[0] : r.promocodes;
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between gap-4 flex-wrap text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          <User size={16} className="text-muted-foreground shrink-0" />
          <span className="font-semibold">{r.client_name}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: r.rating || 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-neon-cyan text-neon-cyan" />
            ))}
          </div>
          {promo?.code && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${promo.source === 'portfolio' ? 'bg-neon-pink/10 text-neon-pink' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
              <Tag size={10} /> {promo.code} · {promo.discount_percent}%
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-3">
          <span>{new Date(r.submitted_at || r.created_at).toLocaleDateString('ru')}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30 space-y-3 text-sm">
          {r.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <a href={`mailto:${r.email}`} className="text-neon-cyan hover:underline">{r.email}</a>
            </div>
          )}
          <div>
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Отзыв</div>
            <p className="whitespace-pre-line text-foreground/90 leading-relaxed">{r.text}</p>
          </div>
          {promo && (
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                <Tag size={12} /> Промокод
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="font-mono font-bold text-base tracking-wider">{promo.code}</code>
                <span className={`text-xs px-2 py-0.5 rounded-full ${promo.source === 'portfolio' ? 'bg-neon-pink/10 text-neon-pink' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
                  {promo.discount_percent}%
                </span>
                {promo.is_used ? (
                  <span className="text-xs text-foreground/60">использован {promo.used_at ? new Date(promo.used_at).toLocaleDateString('ru') : ''}</span>
                ) : (
                  <span className="text-xs text-neon-cyan">активен</span>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap pt-2">
            {currentTab !== 'approved' && (
              <Button size="sm" variant="ghost" className="text-neon-cyan" onClick={() => onStatus(r.id, 'approved')}>
                <Check size={14} /> Одобрить
              </Button>
            )}
            {currentTab !== 'rejected' && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onStatus(r.id, 'rejected')}>
                <X size={14} /> Отклонить
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>
              Редактировать
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => onDelete(r.id)}>
              <Trash2 size={14} /> Удалить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
