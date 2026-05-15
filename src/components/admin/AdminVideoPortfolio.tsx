import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Upload, X, Pencil } from 'lucide-react';
import { useReorder } from '@/hooks/useSortable';
import SortableItem from './SortableItem';
import SortableWrapper from './SortableWrapper';
import { VIDEO_CATEGORIES, VIDEO_ASPECT_RATIOS } from '@/components/landing/VideoPortfolio';

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  cover_url: string;
  video_url: string;
  sort_order: number;
  is_active: boolean;
  aspect_ratio: string;
};

const emptyForm = {
  title: '',
  description: '',
  category: VIDEO_CATEGORIES[0] as string,
  cover_url: '',
  video_url: '',
  is_active: true,
  aspect_ratio: '16:9' as string,
};

export default function AdminVideoPortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<VideoRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-video-portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_portfolio')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []) as VideoRow[];
    },
  });

  const reorder = useReorder('video_portfolio', ['admin-video-portfolio', 'video-portfolio']);

  const uploadCover = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const path = `video-covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (error) {
      toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Файл слишком большой', description: 'Максимум 5 МБ', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const url = await uploadCover(file);
    if (url) setForm((p) => ({ ...p, cover_url: url }));
    setUploading(false);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        cover_url: form.cover_url,
        video_url: form.video_url.trim(),
        is_active: form.is_active,
        aspect_ratio: form.aspect_ratio,
      };
      if (editing) {
        const { error } = await supabase.from('video_portfolio').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('video_portfolio')
          .insert({ ...payload, sort_order: items.length });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-video-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['video-portfolio'] });
      resetForm();
      toast({ title: editing ? 'Сохранено' : 'Добавлено' });
    },
    onError: (err: any) => toast({ title: 'Ошибка', description: err.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('video_portfolio').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-video-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['video-portfolio'] });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from('video_portfolio').update({ is_active: value }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-video-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['video-portfolio'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (v: VideoRow) => {
    setEditing(v);
    setForm({
      title: v.title,
      description: v.description || '',
      category: v.category,
      cover_url: v.cover_url,
      video_url: v.video_url,
      is_active: v.is_active,
    });
    setShowForm(true);
  };

  const canSave = form.title && form.cover_url && form.video_url && form.category;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-heading font-bold">Видео-портфолио ({items.length})</h2>
          <p className="text-xs text-muted-foreground mt-1">Раздел отображается на странице /ai-video</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="neon-glow-btn rounded-full text-primary-foreground"
        >
          <Plus size={16} /> Добавить
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input
            placeholder="Заголовок *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-muted/50 rounded-xl"
          />
          <Textarea
            placeholder="Короткое описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-muted/50 rounded-xl"
            rows={3}
          />

          <div>
            <label className="block text-sm mb-2">Категория *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-muted/50 rounded-xl px-3 py-2 border border-border/50 text-sm"
            >
              {VIDEO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Обложка *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                if (fileRef.current) fileRef.current.value = '';
              }}
            />
            <div className="flex items-center gap-3 flex-wrap">
              {form.cover_url ? (
                <div className="relative">
                  <img
                    src={form.cover_url}
                    alt=""
                    className="w-40 h-24 object-cover rounded-lg border border-border/50"
                  />
                  <button
                    onClick={() => setForm({ ...form, cover_url: '' })}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="rounded-xl"
              >
                <Upload size={14} /> {uploading ? 'Загрузка…' : form.cover_url ? 'Заменить' : 'Загрузить'}
              </Button>
            </div>
            <Input
              placeholder="…или вставьте URL обложки"
              value={form.cover_url}
              onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
              className="bg-muted/50 rounded-xl mt-2"
            />
          </div>

          <Input
            placeholder="Ссылка на видео * (YouTube, VK, Vimeo, RuTube или mp4)"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            className="bg-muted/50 rounded-xl"
          />

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
            <span className="text-sm">Активно (показывать на сайте)</span>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => save.mutate()}
              disabled={!canSave || save.isPending}
              className="neon-glow-btn rounded-full text-primary-foreground"
            >
              {editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Отмена
            </Button>
          </div>
        </div>
      )}

      <SortableWrapper
        items={items}
        onReorder={(o, n) => reorder.mutate({ items, oldIndex: o, newIndex: n })}
      >
        <div className="space-y-3">
          {items.map((v) => (
            <SortableItem
              key={v.id}
              id={v.id}
              className="glass rounded-2xl p-4 flex items-center gap-4"
            >
              <img
                src={v.cover_url}
                alt={v.title}
                className="w-24 h-14 sm:w-32 sm:h-20 object-cover rounded-lg shrink-0 border border-border/40"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{v.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{v.category}</p>
                {!v.is_active && (
                  <span className="text-[10px] uppercase tracking-wide text-destructive">Скрыто</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={v.is_active}
                  onCheckedChange={(value) => toggleActive.mutate({ id: v.id, value })}
                />
                <Button size="sm" variant="ghost" onClick={() => startEdit(v)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm(`Удалить «${v.title}»?`)) remove.mutate(v.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </SortableItem>
          ))}
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-12 glass rounded-2xl">
              Пока нет видео-работ
            </div>
          )}
        </div>
      </SortableWrapper>
    </div>
  );
}
