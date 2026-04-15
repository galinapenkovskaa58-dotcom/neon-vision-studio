import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Eye, EyeOff, Upload, X } from 'lucide-react';

export default function AdminStyles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ category: '', title: '', description: '', image_1: '', image_2: '', image_3: '', is_visible: true });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const { data: items = [] } = useQuery({
    queryKey: ['admin-styles'],
    queryFn: async () => {
      const { data } = await supabase.from('styles').select('*').order('sort_order');
      return data || [];
    },
  });

  const uploadImage = async (file: File, slot: 'image_1' | 'image_2' | 'image_3') => {
    setUploading(prev => ({ ...prev, [slot]: true }));
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('style-images').upload(path, file);
    if (error) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
      setUploading(prev => ({ ...prev, [slot]: false }));
      return;
    }
    const { data: urlData } = supabase.storage.from('style-images').getPublicUrl(path);
    setForm(prev => ({ ...prev, [slot]: urlData.publicUrl }));
    setUploading(prev => ({ ...prev, [slot]: false }));
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        category: form.category,
        title: form.title,
        description: form.description || null,
        image_1: form.image_1 || null,
        image_2: form.image_2 || null,
        image_3: form.image_3 || null,
        is_visible: form.is_visible,
      };
      if (editing) {
        const { error } = await supabase.from('styles').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('styles').insert({ ...payload, sort_order: items.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      queryClient.invalidateQueries({ queryKey: ['styles'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('styles').update({ is_visible }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-styles'] });
      queryClient.invalidateQueries({ queryKey: ['styles'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ category: '', title: '', description: '', image_1: '', image_2: '', image_3: '', is_visible: true });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({
      category: item.category || '',
      title: item.title,
      description: item.description || '',
      image_1: item.image_1 || '',
      image_2: item.image_2 || '',
      image_3: item.image_3 || '',
      is_visible: item.is_visible,
    });
    setShowForm(true);
  };

  const ImageSlot = ({ slot, index }: { slot: 'image_1' | 'image_2' | 'image_3'; index: number }) => (
    <div className="relative">
      <input
        ref={fileRefs[index]}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file, slot);
        }}
      />
      {form[slot] ? (
        <div className="relative group">
          <img src={form[slot]} alt="" className="w-full aspect-[9/16] object-cover rounded-lg" />
          <button
            onClick={() => setForm(prev => ({ ...prev, [slot]: '' }))}
            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRefs[index].current?.click()}
          disabled={uploading[slot]}
          className="w-full aspect-[9/16] border border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
        >
          <Upload size={12} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{uploading[slot] ? '...' : 'Фото'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Стили ({items.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="neon-glow-btn rounded-full text-primary-foreground">
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
      <div className="glass rounded-2xl p-5 mb-6 space-y-3">
          <Input placeholder="Категория *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Название стиля *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Краткое описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 rounded-xl" />
          <div>
            <label className="block text-sm mb-2">Фотографии (3 шт.)</label>
            <div className="flex gap-2" style={{ maxWidth: '180px' }}>
              <ImageSlot slot="image_1" index={0} />
              <ImageSlot slot="image_2" index={1} />
              <ImageSlot slot="image_3" index={2} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.title || !form.category} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button variant="ghost" onClick={resetForm}>Отмена</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`glass rounded-2xl p-4 ${!item.is_visible ? 'opacity-50' : ''}`}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[item.image_1, item.image_2, item.image_3].map((img, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-muted/30">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">Нет фото</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">{(item as any).category}</span>
                <h3 className="font-heading font-bold">{item.title}</h3>
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
