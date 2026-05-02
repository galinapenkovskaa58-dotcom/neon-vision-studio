import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, X, Eye, Crop, RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import PortfolioLightbox from '@/components/portfolio/PortfolioLightbox';
import FocalPointEditor from '@/components/portfolio/FocalPointEditor';

const MAX_IMAGES = 10;
const DEFAULT_POS = '50% 50%';

type FormState = {
  title: string;
  description: string;
  category: string;
  image_urls: string[];
  image_positions: string[];
};

export default function AdminPortfolio({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<FormState>({
    title: '', description: '', category: '', image_urls: [], image_positions: [],
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<null | 'card' | 'lightbox'>(null);
  const [showFocalEditor, setShowFocalEditor] = useState(false);
  const replaceIdxRef = useRef<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-portfolio', service],
    queryFn: async () => {
      const { data } = await supabase.from('portfolio').select('*').eq('service', service).order('sort_order');
      return data || [];
    },
  });

  const reorder = useReorder('portfolio', ['admin-portfolio', service]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (error) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path);
    return publicUrl;
  };

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const remaining = MAX_IMAGES - form.image_urls.length;
    const list = Array.from(files).slice(0, remaining);
    const uploaded: string[] = [];
    for (const file of list) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }
    setForm((prev) => ({
      ...prev,
      image_urls: [...prev.image_urls, ...uploaded].slice(0, MAX_IMAGES),
      image_positions: [...prev.image_positions, ...uploaded.map(() => DEFAULT_POS)].slice(0, MAX_IMAGES),
    }));
    setUploading(false);
  };

  const handleReplace = (idx: number) => {
    replaceIdxRef.current = idx;
    replaceInputRef.current?.click();
  };

  const onReplaceFile = async (files: FileList | null) => {
    const idx = replaceIdxRef.current;
    if (!files || files.length === 0 || idx === null) return;
    setUploading(true);
    const url = await uploadFile(files[0]);
    setUploading(false);
    if (!url) return;
    setForm((prev) => {
      const urls = [...prev.image_urls];
      const positions = [...prev.image_positions];
      urls[idx] = url;
      positions[idx] = DEFAULT_POS;
      return { ...prev, image_urls: urls, image_positions: positions };
    });
    replaceIdxRef.current = null;
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== idx),
      image_positions: prev.image_positions.filter((_, i) => i !== idx),
    }));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const arr = [...prev.image_urls];
      const pos = [...prev.image_positions];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      [pos[idx], pos[j]] = [pos[j], pos[idx]];
      return { ...prev, image_urls: arr, image_positions: pos };
    });
  };

  const setPosition = (idx: number, p: string) => {
    setForm((prev) => {
      const positions = [...prev.image_positions];
      while (positions.length < prev.image_urls.length) positions.push(DEFAULT_POS);
      positions[idx] = p;
      return { ...prev, image_positions: positions };
    });
  };

  const save = useMutation({
    mutationFn: async () => {
      const positions = form.image_urls.map((_, i) => form.image_positions[i] || DEFAULT_POS);
      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        image_urls: form.image_urls,
        image_positions: positions,
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
      setForm({ title: '', description: '', category: '', image_urls: [], image_positions: [] });
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
    const positions: string[] = (item.image_positions && item.image_positions.length
      ? item.image_positions
      : urls.map(() => DEFAULT_POS));
    while (positions.length < urls.length) positions.push(DEFAULT_POS);
    setForm({ title: item.title, description: item.description || '', category: item.category || '', image_urls: urls, image_positions: positions.slice(0, urls.length) });
    setShowForm(true);
  };

  const focalTiles = form.image_urls.slice(0, 9);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Портфолио ({items.length})</h2>
        <Button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', category: '', image_urls: [], image_positions: [] }); }}
          className="neon-glow-btn rounded-full text-primary-foreground"
        >
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {/* hidden input for replacing a single image */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onReplaceFile(e.target.files)}
      />

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
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {form.image_urls.map((url, idx) => (
                  <div key={url + idx} className="relative group rounded-md overflow-hidden border border-border/50">
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      className="w-full h-16 object-cover"
                      style={{ objectPosition: form.image_positions[idx] || DEFAULT_POS }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-0.5 left-0.5 text-[9px] px-1 py-0.5 rounded bg-neon-cyan/90 text-background font-semibold leading-none">
                        обл.
                      </span>
                    )}
                    <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5 flex-wrap p-0.5">
                      <button type="button" onClick={() => moveImage(idx, -1)} className="px-1 py-0.5 text-[10px] rounded bg-card hover:bg-muted">←</button>
                      <button type="button" onClick={() => moveImage(idx, 1)} className="px-1 py-0.5 text-[10px] rounded bg-card hover:bg-muted">→</button>
                      <button type="button" title="Заменить" onClick={() => handleReplace(idx)} className="p-1 rounded bg-card hover:bg-muted">
                        <RefreshCw size={10} />
                      </button>
                      <button type="button" onClick={() => removeImage(idx)} className="p-1 rounded bg-destructive/90 text-destructive-foreground">
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => save.mutate()} disabled={!form.title || form.image_urls.length === 0} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFocalEditor((v) => !v)}
              disabled={form.image_urls.length === 0}
              className="rounded-full"
            >
              <Crop size={16} /> {showFocalEditor ? 'Скрыть сетку 3×3' : 'Кадрировать сетку 3×3'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreview('card')}
              disabled={form.image_urls.length === 0}
              className="rounded-full"
            >
              <Eye size={16} /> Предварительный просмотр
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>

          {showFocalEditor && focalTiles.length > 0 && (
            <div className="mt-4 pt-6 border-t border-border/40">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold">Сетка обложки 3×3</p>
                  <p className="text-xs text-muted-foreground">
                    Кликайте или перетаскивайте точку на каждой плитке, чтобы выбрать видимую часть фотографии (например, лицо).
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setForm((prev) => ({ ...prev, image_positions: prev.image_urls.map(() => DEFAULT_POS) }))}
                >
                  Сбросить все по центру
                </Button>
              </div>
              <div className="max-w-md mx-auto grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-card/40 rounded-xl">
                {focalTiles.map((src, idx) => (
                  <FocalPointEditor
                    key={src + idx}
                    src={src}
                    position={form.image_positions[idx] || DEFAULT_POS}
                    onChange={(p) => setPosition(idx, p)}
                  />
                ))}
                {Array.from({ length: Math.max(0, 9 - focalTiles.length) }).map((_, idx) => (
                  <div key={`fp-empty-${idx}`} className="rounded-md bg-card/40 aspect-square" />
                ))}
              </div>
            </div>
          )}

          {preview === 'card' && (
            <div className="mt-6 pt-6 border-t border-border/40">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  Так подборка будет выглядеть на странице сайта. Нажмите на карточку, чтобы открыть галерею.
                </p>
                <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>
                  <X size={14} /> Скрыть
                </Button>
              </div>
              <div className="max-w-sm mx-auto">
                <PortfolioCard
                  data={{
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    images: form.image_urls,
                    positions: form.image_positions,
                  }}
                  onClick={() => setPreview('lightbox')}
                />
              </div>
            </div>
          )}

          <AnimatePresence>
            {preview === 'lightbox' && (
              <PortfolioLightbox
                title={form.title || 'Предпросмотр'}
                images={form.image_urls}
                onClose={() => setPreview('card')}
              />
            )}
          </AnimatePresence>
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
