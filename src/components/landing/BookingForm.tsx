import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';

const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя').max(100),
  phone: z.string().trim().min(10, 'Введите корректный номер').max(20),
  messenger: z.enum(['telegram', 'whatsapp', 'other'] as const),
  messenger_username: z.string().max(100).optional(),
  tariff_id: z.string().uuid().optional().or(z.literal('')),
  style: z.string().max(200).optional(),
  references_text: z.string().max(2000).optional(),
  urgency: z.enum(['normal', 'urgent'] as const),
});

type BookingData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BookingData>({
    name: '',
    phone: '',
    messenger: 'telegram',
    messenger_username: '',
    tariff_id: '',
    style: '',
    references_text: '',
    urgency: 'normal',
  });

  const { data: tariffs = [] } = useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tariffs')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order');
      return data || [];
    },
  });

  // Listen for tariff selection from pricing cards
  useEffect(() => {
    const handler = (e: Event) => {
      const tariffId = (e as CustomEvent).detail;
      setForm((prev) => ({ ...prev, tariff_id: tariffId }));
    };
    window.addEventListener('select-tariff', handler);
    return () => window.removeEventListener('select-tariff', handler);
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: BookingData) => {
      const insertData: any = {
        name: data.name,
        phone: data.phone,
        messenger: data.messenger,
        messenger_username: data.messenger_username || null,
        style: data.style || null,
        references_text: data.references_text || null,
        urgency: data.urgency,
        tariff_id: data.tariff_id || null,
      };
      const { error } = await supabase.from('bookings').insert(insertData);
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(result.data);
  };

  const update = (field: keyof BookingData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (submitted) {
    return (
      <section id="booking" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto glass rounded-3xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-neon-cyan mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-bold mb-3">Заявка отправлена!</h3>
            <p className="text-muted-foreground">Я свяжусь с вами в ближайшее время для обсуждения деталей.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-purple/8 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-neon-blue/8 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Записаться</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Заполните форму, и я свяжусь с вами для обсуждения деталей
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto glass rounded-3xl p-8 md:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <Input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ваше имя"
                className="bg-muted/50 border-border/50 rounded-xl h-12"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Телефон *</label>
              <Input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="bg-muted/50 border-border/50 rounded-xl h-12"
              />
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Мессенджер</label>
              <Select value={form.messenger} onValueChange={(v) => update('messenger', v)}>
                <SelectTrigger className="bg-muted/50 border-border/50 rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="other">Другой</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ник / username</label>
              <Input
                value={form.messenger_username}
                onChange={(e) => update('messenger_username', e.target.value)}
                placeholder="@username"
                className="bg-muted/50 border-border/50 rounded-xl h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tariffs.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Тариф</label>
                <Select value={form.tariff_id} onValueChange={(v) => update('tariff_id', v)}>
                  <SelectTrigger className="bg-muted/50 border-border/50 rounded-xl h-12">
                    <SelectValue placeholder="Выберите тариф" />
                  </SelectTrigger>
                  <SelectContent>
                    {tariffs.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Желаемый стиль</label>
              <Input
                value={form.style}
                onChange={(e) => update('style', e.target.value)}
                placeholder="Киберпанк, фэнтези..."
                className="bg-muted/50 border-border/50 rounded-xl h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Референсы / пожелания</label>
            <Textarea
              value={form.references_text}
              onChange={(e) => update('references_text', e.target.value)}
              placeholder="Опишите ваше видение, ссылки на примеры..."
              className="bg-muted/50 border-border/50 rounded-xl min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Срочность</label>
            <div className="flex gap-4">
              {(['normal', 'urgent'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => update('urgency', u)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.urgency === u
                      ? 'neon-glow-btn text-primary-foreground'
                      : 'glass hover:bg-card/80'
                  }`}
                >
                  {u === 'normal' ? '🕐 Обычная' : '⚡ Срочная'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full neon-glow-btn text-primary-foreground py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {mutation.isPending ? 'Отправка...' : (
              <>
                <Send size={20} />
                Отправить заявку
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
