import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, X, GripVertical } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';

const MAX_IMAGES = 10;

export default function AdminPortfolio({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<{ title: string; description: string; category: string; image_urls: string[] }>({
    title: '', description: '', category: '', image_urls: [],
  });
  const [uploading, setUploading] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-portfolio', service],
    queryFn: async () => {
      const { data } = await supabase.from('portfolio').select('*').eq('service', service).order('sort_order');
      return data || [];
    },
  });

  const reorder = useReorder('portfolio', ['admin-portfolio', service]);

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const remaining = MAX_IMAGES - form.image_urls.length;
    const list = Array.from(files).slice(0, remaining);
    const uploaded: string[] = [];
    for (const file of list) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('portfolio').upload(path, file);
      if (error) {
        toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
      uploaded.push(publicUrl);
    }
    setForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, ...uploaded].slice(0, MAX_IMAGES) }));
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== idx) }));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const arr = [...prev.image_urls];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...prev, image_urls: arr };
    });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        image_urls: form.image_urls,
        image_url: form.image_urls[0] ?? '',
      };
      if (editing) {
        const { error } = await supabase.from('portfolio').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolio').insert({ ...payload, sort_order: items.length, service } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio', service] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setShowForm(false); setEditing(null);
      setForm({ title: '', description: '', category: '', image_urls: [] });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('portfolio').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-portfolio', service] }),
  });

  const startEdit = (item: any) => {
    setEditing(item);
    const urls: string[] = (item.image_urls && item.image_urls.length ? item.image_urls : (item.image_url ? [item.image_url] : []));
    setForm({ title: item.title, description: item.description || '', category: item.category || '', image_urls: urls });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Портфолио ({items.length})</h2>
        <Button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', category: '', image_urls: [] }); }}
          className="neon-glow-btn rounded-full text-primary-foreground"
        >
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Заголовок *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/50 rounded-xl" />
          <Input placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-muted/50 rounded-xl" />

          <div>
            <label className="block text-sm mb-2">
              Изображения ({form.image_urls.length}/{MAX_IMAGES}) — первое будет обложкой
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={form.image_urls.length >= MAX_IMAGES}
              onChange={(e) => e.target.files && uploadImages(e.target.files)}
              className="text-sm"
            />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Загрузка...</p>}

            {form.image_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {form.image_urls.map((url, idx) => (
                  <div key={url + idx} className="relative group rounded-lg overflow-hidden border border-border/50">
                    <img src={url} alt={`img-${idx}`} className="w-full h-24 object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/90 text-background font-semibold">
                        обложка
                      </span>
                    )}
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button type="button" onClick={() => moveImage(idx, -1)} className="px-1.5 py-0.5 text-xs rounded bg-card hover:bg-muted">←</button>
                      <button type="button" onClick={() => moveImage(idx, 1)} className="px-1.5 py-0.5 text-xs rounded bg-card hover:bg-muted">→</button>
                      <button type="button" onClick={() => removeImage(idx)} className="px-1.5 py-0.5 rounded bg-destructive/90 text-destructive-foreground">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => save.mutate()} disabled={!form.title || form.image_urls.length === 0} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>
        </div>
      )}

      <SortableWrapper items={items} strategy="grid" onReorder={(o, n) => reorder.mutate({ items, oldIndex: o, newIndex: n })}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => {
            const urls: string[] = (item.image_urls && item.image_urls.length ? item.image_urls : (item.image_url ? [item.image_url] : []));
            return (
              <SortableItem key={item.id} id={item.id} className="glass rounded-2xl overflow-hidden">
                <div className="relative">
                  <img src={urls[0]} alt={item.title} className="w-full h-48 object-cover" />
                  {urls.length > 1 && (
                    <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold text-neon-cyan">
                      {urls.length} фото
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.category && <span className="text-xs text-neon-cyan">{item.category}</span>}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>Ред.</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate(item.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </div>
  );
}
