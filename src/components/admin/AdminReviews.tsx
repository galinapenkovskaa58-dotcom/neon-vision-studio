import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';

export default function AdminReviews({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ client_name: '', text: '', rating: '5', photo_url: '' });

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews', service],
    queryFn: async () => {
      const { data } = await supabase.from('reviews').select('*').eq('service', service).order('sort_order');
      return data || [];
    },
  });

  const reorder = useReorder('reviews', ['admin-reviews', service]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { client_name: form.client_name, text: form.text, rating: parseInt(form.rating), photo_url: form.photo_url || null };
      if (editing) {
        const { error } = await supabase.from('reviews').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('reviews').insert({ ...payload, sort_order: reviews.length, service } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews', service] }); setShowForm(false); setEditing(null); setForm({ client_name: '', text: '', rating: '5', photo_url: '' }); },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('reviews').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews', service] }),
  });

  const startEdit = (r: any) => {
    setEditing(r);
    setForm({ client_name: r.client_name, text: r.text, rating: String(r.rating), photo_url: r.photo_url || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Отзывы ({reviews.length})</h2>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ client_name: '', text: '', rating: '5', photo_url: '' }); }} className="neon-glow-btn rounded-full text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Имя клиента *" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Textarea placeholder="Текст отзыва *" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="bg-muted/50 rounded-xl" />
          <div>
            <label className="block text-sm mb-2">Оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: String(n) })} className="transition-transform hover:scale-110">
                  <Star size={24} className={n <= parseInt(form.rating) ? 'fill-neon-cyan text-neon-cyan' : 'text-muted-foreground'} />
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="URL фото (опционально)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="bg-muted/50 rounded-xl" />
          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.client_name || !form.text} className="neon-glow-btn rounded-full text-primary-foreground">{editing ? 'Сохранить' : 'Добавить'}</Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>
        </div>
      )}

      <SortableWrapper items={reviews} onReorder={(o, n) => reorder.mutate({ items: reviews, oldIndex: o, newIndex: n })}>
        <div className="space-y-4">
          {reviews.map((r) => (
            <SortableItem key={r.id} id={r.id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-neon-cyan text-neon-cyan" />
                    ))}
                  </div>
                  <h3 className="font-semibold">{r.client_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.text}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(r)}>Ред.</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </div>
  );
}
