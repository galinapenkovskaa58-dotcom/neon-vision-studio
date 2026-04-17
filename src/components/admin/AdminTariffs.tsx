import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';

export default function AdminTariffs({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', features: '', is_active: true });

  const { data: tariffs = [] } = useQuery({
    queryKey: ['admin-tariffs', service],
    queryFn: async () => {
      const { data } = await supabase.from('tariffs').select('*').eq('service', service).order('sort_order');
      return data || [];
    },
  });

  const reorder = useReorder('tariffs', ['admin-tariffs', service]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, description: form.description || null, price: parseInt(form.price), features: form.features.split('\n').filter(Boolean), is_active: form.is_active };
      if (editing) {
        const { error } = await supabase.from('tariffs').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tariffs').insert({ ...payload, sort_order: tariffs.length, service } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-tariffs', service] }); setShowForm(false); setEditing(null); setForm({ name: '', description: '', price: '', features: '', is_active: true }); },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('tariffs').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tariffs', service] }),
  });

  const startEdit = (t: any) => {
    setEditing(t);
    const features = Array.isArray(t.features) ? (t.features as string[]).join('\n') : '';
    setForm({ name: t.name, description: t.description || '', price: String(t.price), features, is_active: t.is_active });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Тарифы ({tariffs.length})</h2>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', price: '', features: '', is_active: true }); }} className="neon-glow-btn rounded-full text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Textarea placeholder="Название * (можно несколько строк)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted/50 rounded-xl" rows={2} />
          <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Цена (₽) *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-muted/50 rounded-xl" />
          <div>
            <label className="block text-sm mb-2">Что включено (каждый пункт с новой строки)</label>
            <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="bg-muted/50 rounded-xl" rows={4} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <span className="text-sm">Активен</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.name || !form.price} className="neon-glow-btn rounded-full text-primary-foreground">{editing ? 'Сохранить' : 'Добавить'}</Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>
        </div>
      )}

      <SortableWrapper items={tariffs} onReorder={(o, n) => reorder.mutate({ items: tariffs, oldIndex: o, newIndex: n })}>
        <div className="space-y-4">
          {tariffs.map((t) => (
            <SortableItem key={t.id} id={t.id} className="glass rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.price.toLocaleString('ru-RU')} ₽</p>
                {!t.is_active && <span className="text-xs text-destructive">Неактивен</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(t)}>Ред.</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate(t.id)}><Trash2 size={14} /></Button>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </div>
  );
}
