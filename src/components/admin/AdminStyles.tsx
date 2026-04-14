import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLOR_OPTIONS = [
  { value: 'neon-blue', label: 'Синий' },
  { value: 'neon-cyan', label: 'Голубой' },
  { value: 'neon-purple', label: 'Фиолетовый' },
  { value: 'neon-pink', label: 'Розовый' },
];

export default function AdminStyles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    color_from: 'neon-blue',
    color_to: 'neon-cyan',
    icon: '✦',
    is_visible: true,
  });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-styles'],
    queryFn: async () => {
      const { data } = await supabase.from('styles').select('*').order('sort_order');
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from('styles').update(form).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('styles').insert({ ...form, sort_order: items.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      resetForm();
      toast({ title: editing ? 'Стиль обновлён' : 'Стиль добавлен' });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('styles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-styles'] }),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('styles').update({ is_visible }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-styles'] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', color_from: 'neon-blue', color_to: 'neon-cyan', icon: '✦', is_visible: true });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      color_from: item.color_from,
      color_to: item.color_to,
      icon: item.icon || '✦',
      is_visible: item.is_visible,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Стили ({items.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="neon-glow-btn rounded-full text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Название стиля *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Иконка (эмодзи)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="bg-muted/50 rounded-xl w-32" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Цвет «от»</label>
              <Select value={form.color_from} onValueChange={(v) => setForm({ ...form, color_from: v })}>
                <SelectTrigger className="bg-muted/50 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-2">Цвет «до»</label>
              <Select value={form.color_to} onValueChange={(v) => setForm({ ...form, color_to: v })}>
                <SelectTrigger className="bg-muted/50 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Preview */}
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${form.color_from} to-${form.color_to} flex items-center justify-center text-xl`}>
              {form.icon}
            </div>
            <div>
              <p className="font-semibold">{form.title || 'Превью'}</p>
              <p className="text-xs text-muted-foreground">{form.description || 'Описание стиля'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.title} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button variant="ghost" onClick={resetForm}>Отмена</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`glass rounded-2xl p-6 ${!item.is_visible ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color_from} to-${item.color_to} flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => toggleVisibility.mutate({ id: item.id, is_visible: !item.is_visible })}>
                  {item.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>Ред.</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate(item.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
