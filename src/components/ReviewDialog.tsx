import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  ArrowLeft, ArrowRight, Send, Star, Camera, Video, Music, Code2,
  Sparkles, CheckCircle, Copy, Check, Upload, X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

type ServiceId = 'neurophoto' | 'ai-video' | 'songs' | 'vibe-coding';
type Mode = 'free' | 'guided';

const services: { id: ServiceId; label: string; icon: any; tone: string }[] = [
  { id: 'neurophoto', label: 'Нейрофотосессия', icon: Camera, tone: 'cyan' },
  { id: 'ai-video', label: 'AI Видео & Клипы', icon: Video, tone: 'pink' },
  { id: 'songs', label: 'AI-музыка', icon: Music, tone: 'purple' },
  { id: 'vibe-coding', label: 'Вайб-кодинг', icon: Code2, tone: 'blue' },
];

const guidedQuestions = [
  { key: 'request', label: 'С какой задачей вы обратились?', placeholder: 'Например: хотел получить серию портретов в киберпанк-стиле…' },
  { key: 'process', label: 'Как прошёл процесс работы?', placeholder: 'Что понравилось в общении, скорости, гибкости…' },
  { key: 'result', label: 'Что особенно понравилось в результате?', placeholder: 'Качество, детали, эмоции от работы…' },
  { key: 'recommend', label: 'Кому бы вы порекомендовали и почему?', placeholder: 'Например: тем, кто хочет нестандартный визуал для соцсетей…' },
] as const;

const finalSchema = z.object({
  client_name: z.string().trim().min(2, 'Введите имя').max(100),
  text: z.string().trim().min(20, 'Текст слишком короткий').max(2000),
  rating: z.number().int().min(1).max(5),
  email: z.string().trim().email('Некорректный email').max(200).optional().or(z.literal('')),
});

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'service' | 'mode' | 'write' | 'preview' | 'portfolio' | 'success';

export default function ReviewDialog({ open, onOpenChange }: ReviewDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('service');
  const [service, setService] = useState<ServiceId | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [freeText, setFreeText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  // Portfolio step
  const [shareToPortfolio, setShareToPortfolio] = useState(false);
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [promocode, setPromocode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const assembledText = useMemo(() => {
    if (mode !== 'guided') return '';
    const parts: string[] = [];
    if (answers.request?.trim()) parts.push(answers.request.trim());
    if (answers.process?.trim()) parts.push(answers.process.trim());
    if (answers.result?.trim()) parts.push(answers.result.trim());
    if (answers.recommend?.trim()) parts.push(answers.recommend.trim());
    return parts.join('\n\n');
  }, [mode, answers]);

  const finalText = editing ? editedText : (mode === 'guided' ? assembledText : freeText);

  const reset = () => {
    setStep('service'); setService(null); setMode(null);
    setAnswers({}); setFreeText(''); setName(''); setEmail(''); setRating(5);
    setEditing(false); setEditedText('');
    setShareToPortfolio(false); setPortfolioDesc(''); setPortfolioLink(''); setMediaUrls([]);
    setPromocode(null); setDiscountPercent(10); setCopiedKey(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setTimeout(reset, 250);
    onOpenChange(next);
  };

  const goNext = () => {
    if (step === 'service' && service) setStep('mode');
    else if (step === 'mode' && mode) setStep('write');
    else if (step === 'write') {
      const text = mode === 'guided' ? assembledText : freeText;
      const result = finalSchema.safeParse({ client_name: name, text, rating, email });
      if (!result.success) {
        toast({ title: 'Проверьте поля', description: result.error.issues[0]?.message, variant: 'destructive' });
        return;
      }
      setEditedText(text);
      setStep('preview');
    } else if (step === 'preview') {
      setStep('portfolio');
    }
  };

  const goBack = () => {
    if (step === 'mode') setStep('service');
    else if (step === 'write') setStep('mode');
    else if (step === 'preview') { setEditing(false); setStep('write'); }
    else if (step === 'portfolio') setStep('preview');
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (mediaUrls.length + files.length > 5) {
      toast({ title: 'Максимум 5 файлов', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024) {
          toast({ title: `Файл «${file.name}» больше 20 МБ`, variant: 'destructive' });
          continue;
        }
        const ext = file.name.split('.').pop() ?? 'bin';
        const path = `${service}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from('review-uploads').upload(path, file, { upsert: false });
        if (error) {
          toast({ title: 'Ошибка загрузки', description: error.message, variant: 'destructive' });
          continue;
        }
        const { data } = supabase.storage.from('review-uploads').getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
      setMediaUrls((prev) => [...prev, ...newUrls]);
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (url: string) => setMediaUrls((prev) => prev.filter((u) => u !== url));

  const submit = async (withPortfolio: boolean) => {
    if (!service) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        service,
        client_name: name.trim(),
        text: finalText.trim(),
        rating,
        email: email.trim() || undefined,
        share_to_portfolio: withPortfolio,
      };
      if (withPortfolio) {
        payload.portfolio_description = portfolioDesc.trim() || undefined;
        payload.portfolio_media_urls = mediaUrls;
        payload.portfolio_external_link = portfolioLink.trim() || undefined;
      }
      const { data, error } = await supabase.functions.invoke('submit-review', { body: payload });
      if (error) throw error;
      setPromocode(data?.promocode ?? null);
      setDiscountPercent(data?.discount_percent ?? (withPortfolio ? 15 : 10));
      setStep('success');
    } catch (e: any) {
      toast({ title: 'Не удалось отправить', description: e?.message ?? 'Попробуйте позже', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto glass-strong border-border/40 rounded-3xl p-0">
        <div className="p-8 md:p-10">
          <DialogTitle className="sr-only">Оставить отзыв</DialogTitle>
          <DialogDescription className="sr-only">
            Расскажите о работе со студией и получите промокод на скидку
          </DialogDescription>

          <AnimatePresence mode="wait">
            {step === 'service' && (
              <motion.div key="s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-heading font-bold mb-2 gradient-text">За какой услугой обращались?</h3>
                <p className="text-muted-foreground mb-6">Выберите направление, чтобы отзыв попал на нужную страницу</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const Icon = s.icon;
                    const active = service === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setService(s.id)}
                        className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                          active
                            ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]'
                            : 'border-border/40 bg-muted/30 hover:border-border/80'
                        }`}
                      >
                        <Icon size={28} className={active ? 'text-neon-cyan' : 'text-foreground/70'} />
                        <span className="font-semibold">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'mode' && (
              <motion.div key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-heading font-bold mb-2 gradient-text">Как удобнее написать?</h3>
                <p className="text-muted-foreground mb-6">Можно написать самостоятельно или ответить на короткие вопросы — мы соберём текст за вас</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setMode('free')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      mode === 'free' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-border/40 bg-muted/30 hover:border-border/80'
                    }`}
                  >
                    <div className="font-semibold mb-1">✍️ Написать самостоятельно</div>
                    <div className="text-sm text-muted-foreground">Свободный формат — расскажите своими словами</div>
                  </button>
                  <button
                    onClick={() => setMode('guided')}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      mode === 'guided' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-border/40 bg-muted/30 hover:border-border/80'
                    }`}
                  >
                    <div className="font-semibold mb-1">💬 По наводящим вопросам</div>
                    <div className="text-sm text-muted-foreground">4 коротких вопроса — отзыв соберётся автоматически</div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'write' && (
              <motion.div key="w" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                <h3 className="text-2xl font-heading font-bold gradient-text">
                  {mode === 'guided' ? 'Ответьте на вопросы' : 'Ваш отзыв'}
                </h3>

                {mode === 'guided' ? (
                  guidedQuestions.map((q) => (
                    <div key={q.key}>
                      <label className="block text-sm font-medium mb-2">{q.label}</label>
                      <Textarea
                        value={answers[q.key] ?? ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
                        placeholder={q.placeholder}
                        rows={2}
                        className="bg-muted/50 border-border/50 rounded-xl resize-none"
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Текст отзыва *</label>
                    <Textarea
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      placeholder="Поделитесь впечатлениями о работе…"
                      rows={6}
                      className="bg-muted/50 border-border/50 rounded-xl resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как подписать отзыв" className="bg-muted/50 border-border/50 rounded-xl h-12" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email (необязательно — чтобы прислать промокод)</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="bg-muted/50 border-border/50 rounded-xl h-12" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setRating(n)} className="transition-transform hover:scale-110">
                        <Star size={28} className={n <= rating ? 'fill-neon-cyan text-neon-cyan' : 'text-muted-foreground'} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-2xl font-heading font-bold mb-2 gradient-text">Проверьте отзыв</h3>
                <p className="text-muted-foreground mb-5">Можно скорректировать перед отправкой</p>

                <div className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={18} className="fill-neon-cyan text-neon-cyan" />
                    ))}
                  </div>
                  {editing ? (
                    <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} rows={8} className="bg-muted/50 border-border/50 rounded-xl resize-none" />
                  ) : (
                    <p className="whitespace-pre-line text-foreground/90 leading-relaxed">{finalText}</p>
                  )}
                  <div className="text-sm text-muted-foreground pt-2 border-t border-border/30">— {name}</div>
                </div>

                <div className="flex gap-3 mt-5">
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="px-5 py-3 rounded-full border border-border/60 text-sm font-medium hover:bg-muted/50 transition-colors">
                      Корректировать
                    </button>
                  ) : (
                    <button onClick={() => setEditing(false)} className="px-5 py-3 rounded-full border border-border/60 text-sm font-medium hover:bg-muted/50 transition-colors">
                      Готово
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'portfolio' && (
              <motion.div key="pf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-2 gradient-text">Поделиться результатом? 🎁</h3>
                  <p className="text-muted-foreground">
                    Если разрешите опубликовать ваш материал в разделе «Портфолио» — добавим <span className="text-neon-pink font-semibold">+5% к бонусу</span> (итого <span className="text-neon-pink font-semibold">15%</span>)
                  </p>
                </div>

                <label
                  className={`rounded-2xl border p-5 cursor-pointer transition-all flex items-start gap-3 ${
                    shareToPortfolio ? 'border-neon-pink bg-neon-pink/10' : 'border-border/40 bg-muted/30 hover:border-border/60'
                  }`}
                >
                  <Checkbox checked={shareToPortfolio} onCheckedChange={(v) => setShareToPortfolio(v === true)} className="mt-1" />
                  <span className="text-sm leading-relaxed">
                    Разрешаю опубликовать материал по моему проекту в портфолио DSN Nexoria с указанием моего имени
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => submit(true)}
                    disabled={submitting || !shareToPortfolio}
                    className="flex-1 neon-glow-btn text-primary-foreground py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={18} />
                    Поделиться и получить +15%
                  </button>
                  <button
                    onClick={() => submit(false)}
                    disabled={submitting}
                    className="flex-1 px-5 py-4 rounded-full border border-border/60 text-base font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    Пропустить
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <CheckCircle size={64} className="text-neon-cyan mx-auto mb-5" />
                <h3 className="text-2xl font-heading font-bold mb-2">Спасибо за отзыв!</h3>
                <p className="text-muted-foreground mb-8">
                  Мы проверим его в течение 1–2 дней и опубликуем на странице услуги.
                </p>

                <div className="space-y-4">
                  {promocode && (
                    <div className={`glass rounded-2xl p-5 border ${discountPercent >= 15 ? 'border-neon-pink/40' : 'border-neon-cyan/40'}`}>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        {discountPercent >= 15
                          ? 'Скидка 15% — за отзыв и материал в портфолио'
                          : 'Скидка 10% за отзыв'}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <code className={`text-xl md:text-2xl font-mono font-bold tracking-wider ${discountPercent >= 15 ? 'text-neon-pink' : 'text-neon-cyan'}`}>
                          {promocode}
                        </code>
                        <button onClick={() => copy('p', promocode)} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                          {copiedKey === 'p' ? (
                            <Check size={18} className={discountPercent >= 15 ? 'text-neon-pink' : 'text-neon-cyan'} />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Промокоды одноразовые, действуют на любую услугу. Активируются при оформлении заявки.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer nav (hidden on success) */}
          {step !== 'success' && step !== 'portfolio' && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
              {step !== 'service' ? (
                <button onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={16} /> Назад
                </button>
              ) : <span />}

              <button
                onClick={goNext}
                disabled={
                  (step === 'service' && !service) ||
                  (step === 'mode' && !mode)
                }
                className="flex items-center gap-2 px-6 py-3 rounded-full neon-glow-btn text-primary-foreground text-sm font-semibold disabled:opacity-50"
              >
                {step === 'preview' ? <>Дальше <ArrowRight size={16} /></> : <>Далее <ArrowRight size={16} /></>}
              </button>
            </div>
          )}

          {step === 'portfolio' && (
            <div className="flex items-center justify-start mt-6">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={16} /> Назад
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
