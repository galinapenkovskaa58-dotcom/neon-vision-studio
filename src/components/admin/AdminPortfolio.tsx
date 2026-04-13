import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, GripVertical } from 'lucide-react';

export default function AdminPortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', image_url: '' });
  const [uploading, setUploading] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => {
      const { data } = await supabase.from('portfolio').select('*').order('sort_order');
      return data || [];
    },
  });

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (error) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    setForm((prev) => ({ ...prev, image_url: publicUrl }));
    setUploading(false);
  };

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from('portfolio').update(form).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolio').insert({ ...form, sort_order: items.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', category: '', image_url: '' });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] }),
  });

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || '', category: item.category || '', image_url: item.image_url });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Портфолио ({items.length})</h2>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', category: '', image_url: '' }); }} className="neon-glow-btn rounded-full text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Заголовок *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-muted/50 rounded-xl" />
          <div>
            <label className="block text-sm mb-2">Изображение</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} className="text-sm" />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Загрузка...</p>}
            {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.title || !form.image_url} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="glass rounded-2xl overflow-hidden group">
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              {item.category && <span className="text-xs text-neon-cyan">{item.category}</span>}
              <div className="flex gap-2 mt-3">
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
