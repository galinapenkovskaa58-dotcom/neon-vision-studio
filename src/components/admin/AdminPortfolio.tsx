import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, X, Crop, RefreshCw } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';
import FocalPointEditor from '@/components/portfolio/FocalPointEditor';
import PortfolioNode from '@/components/portfolio/PortfolioNode';

const MAX_IMAGES = 10;
const DEFAULT_POS = '50% 50%';

type DisplayMode = 'fan' | 'grid';

type FormState = {
  category: string;
  image_urls: string[];
  image_positions: string[];
  original_url: string;
  original_name: string;
  original_position: string;
  display_mode: DisplayMode;
};

const emptyForm = (): FormState => ({
  category: '', image_urls: [], image_positions: [], original_url: '', original_name: '', original_position: DEFAULT_POS, display_mode: 'fan',
});

export default function AdminPortfolio({ service = 'neurophoto' }: { service?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [uploading, setUploading] = useState(false);
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

  const reorder = useReorder('portfolio', ['admin-portfolio', service, 'portfolio']);

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
        title: form.original_name || form.category || 'Подборка',
        category: form.category,
        image_urls: form.image_urls,
        image_positions: positions,
        image_url: form.image_urls[0] ?? '',
        original_url: form.original_url || null,
        original_name: form.original_name || null,
        original_position: form.original_position || DEFAULT_POS,
        display_mode: form.display_mode,
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
      setForm(emptyForm());
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('portfolio').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio', service] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  const bulkSetMode = useMutation({
    mutationFn: async (mode: DisplayMode) => {
      const { error } = await supabase.from('portfolio').update({ display_mode: mode }).eq('service', service);
      if (error) throw error;
    },
    onSuccess: (_d, mode) => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio', service] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({ title: 'Готово', description: `Все портфолио — ${mode === 'fan' ? 'веером' : 'сеткой'}` });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const startEdit = (item: any) => {
    setEditing(item);
    const urls: string[] = (item.image_urls && item.image_urls.length ? item.image_urls : (item.image_url ? [item.image_url] : []));
    const positions: string[] = (item.image_positions && item.image_positions.length
      ? item.image_positions
      : urls.map(() => DEFAULT_POS));
    while (positions.length < urls.length) positions.push(DEFAULT_POS);
    setForm({
      category: item.category || '',
      image_urls: urls,
      image_positions: positions.slice(0, urls.length),
      original_url: item.original_url || '',
      original_name: item.original_name || '',
      original_position: item.original_position || DEFAULT_POS,
      display_mode: (item.display_mode === 'grid' ? 'grid' : 'fan'),
    });
    setShowForm(true);
  };

  const focalTiles = form.image_urls.slice(0, 9);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-heading font-bold">Портфолио ({items.length})</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-muted-foreground mr-1">Применить ко всем:</span>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => bulkSetMode.mutate('fan')} disabled={bulkSetMode.isPending}>Веером</Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => bulkSetMode.mutate('grid')} disabled={bulkSetMode.isPending}>Сеткой</Button>
          <Button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm()); }}
            className="neon-glow-btn rounded-full text-primary-foreground"
          >
            <Plus size={16} /> Добавить
          </Button>
        </div>
      </div>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onReplaceFile(e.target.files)}
      />

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-muted/50 rounded-xl" />

          {/* Display mode */}
          <div>
            <label className="block text-sm mb-2">Способ публикации</label>
            <div className="flex gap-2 flex-wrap">
              {(['fan', 'grid'] as DisplayMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, display_mode: m })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    form.display_mode === m ? 'neon-glow-btn text-primary-foreground' : 'glass hover:bg-card/80'
                  }`}
                >
                  {m === 'fan' ? 'Веером (кружок)' : 'Сеткой (мини)'}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview matches public site */}
          {form.image_urls.length > 0 && (
            <div>
              <label className="block text-sm mb-2">Предпросмотр (как на сайте)</label>
              <div className="relative flex justify-center items-end py-12 bg-card/30 rounded-xl border border-border/40 overflow-visible min-h-[260px]">
                <PortfolioNode
                  category={form.category}
                  images={form.image_urls}
                  positions={form.image_positions}
                  originalUrl={form.original_url || null}
                  originalName={form.original_name || null}
                  originalPosition={form.original_position}
                  tone="pink"
                  displayMode={form.display_mode}
                  onClick={() => {}}
                />
              </div>
            </div>
          )}

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

          {/* Original */}
          <div className="space-y-3">
            <Input
              placeholder="Имя для фото-оригинала (например: Анна)"
              value={form.original_name}
              onChange={(e) => setForm({ ...form, original_name: e.target.value })}
              className="bg-muted/50 rounded-xl"
            />
            <label className="block text-sm">Оригинал клиента (фото до нейрообработки)</label>
            <div className="flex items-start gap-4 flex-wrap">
              {form.original_url ? (
                <div className="space-y-2">
                  <div
                    className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-neon-pink/60"
                    style={{ boxShadow: '0 0 18px hsl(var(--neon-pink) / 0.5)' }}
                  >
                    <img
                      src={form.original_url}
                      alt="original"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: form.original_position }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, original_url: '', original_position: DEFAULT_POS }))}
                      className="absolute top-0 right-0 p-0.5 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <div className="w-40">
                    <p className="text-[11px] text-muted-foreground mb-1">Кликайте, чтобы центровать лицо:</p>
                    <FocalPointEditor
                      src={form.original_url}
                      position={form.original_position}
                      onChange={(p) => setForm((prev) => ({ ...prev, original_position: p }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-card/40 border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                  нет фото
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploading(true);
                  const url = await uploadFile(f);
                  setUploading(false);
                  if (url) setForm((p) => ({ ...p, original_url: url, original_position: DEFAULT_POS }));
                  e.target.value = '';
                }}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => save.mutate()} disabled={form.image_urls.length === 0} className="neon-glow-btn rounded-full text-primary-foreground">
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFocalEditor((v) => !v)}
              disabled={form.image_urls.length === 0}
              className="rounded-full"
            >
              <Crop size={16} /> {showFocalEditor ? 'Скрыть кадрирование' : 'Кадрировать фото'}
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Отмена</Button>
          </div>

          {showFocalEditor && focalTiles.length > 0 && (
            <div className="mt-4 pt-6 border-t border-border/40">
              <p className="text-sm font-semibold mb-1">Кадрирование</p>
              <p className="text-xs text-muted-foreground mb-3">
                Кликайте или перетаскивайте точку на каждой плитке, чтобы выбрать видимую часть фотографии.
              </p>
              <div className="max-w-md mx-auto grid grid-cols-3 gap-1 p-1 bg-card/40 rounded-xl">
                {focalTiles.map((src, idx) => (
                  <FocalPointEditor
                    key={src + idx}
                    src={src}
                    position={form.image_positions[idx] || DEFAULT_POS}
                    onChange={(p) => setPosition(idx, p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SortableWrapper items={items} strategy="grid" onReorder={(o, n) => reorder.mutate({ items, oldIndex: o, newIndex: n })}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any) => {
            const urls: string[] = (item.image_urls && item.image_urls.length ? item.image_urls : (item.image_url ? [item.image_url] : []));
            const positions: string[] = item.image_positions || [];
            const isGrid = item.display_mode === 'grid';
            const tiles = urls.slice(0, 9);
            const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tiles.length))));
            return (
              <SortableItem key={item.id} id={item.id} className="glass rounded-2xl overflow-hidden">
                <div className="relative h-56 flex items-center justify-center bg-gradient-to-br from-card/30 to-background/60 overflow-hidden">
                  {isGrid ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-neon-cyan/60 p-[1px] bg-neon-cyan/10 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.45)]">
                      <div className="grid gap-px w-full h-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                        {tiles.map((src, i) => (
                          <div key={src + i} className="relative overflow-hidden rounded-[2px]">
                            <img src={src} alt="" className="w-full h-full object-cover" style={{ objectPosition: positions[i] || DEFAULT_POS }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-neon-pink/60 shadow-[0_0_28px_hsl(var(--neon-pink)/0.55)]">
                      {urls[0] && (
                        <img src={urls[0]} alt={item.original_name || ''} className="w-full h-full object-cover" style={{ objectPosition: positions[0] || DEFAULT_POS }} />
                      )}
                    </div>
                  )}
                  {urls.length > 1 && (
                    <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold text-neon-cyan">
                      {urls.length} фото
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] font-semibold text-neon-purple">
                    {isGrid ? 'сетка' : 'веер'}
                  </span>
                </div>
                <div className="p-4">
                  {item.original_name && <div className="neon-name text-base mb-1">{item.original_name}</div>}
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
