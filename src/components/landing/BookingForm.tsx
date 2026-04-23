import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import bookingIcon from '@/assets/booking-icon.png';

type MessengerType = 'telegram' | 'vk' | 'max' | 'other';

const contactLabels: Record<MessengerType, string> = {
  telegram: 'Ник / username',
  vk: 'Ссылка на аккаунт',
  max: 'Номер телефона',
  other: 'Контакт (телефон или ссылка)',
};

const contactPlaceholders: Record<MessengerType, string> = {
  telegram: '@username',
  vk: 'https://vk.com/...',
  max: '+7 (999) 123-45-67',
  other: 'Телефон или ссылка',
};

const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя').max(100),
  messenger: z.enum(['telegram', 'vk', 'max', 'other'] as const),
  contact: z.string().trim().min(2, 'Введите контакт').max(200),
  consent: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласие' }) }),
});

type BookingData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    messenger: 'telegram' as MessengerType,
    contact: '',
    consent: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingData) => {
      // Map our messenger types to DB enum: telegram | whatsapp | other
      const dbMessenger: 'telegram' | 'whatsapp' | 'other' =
        data.messenger === 'telegram' ? 'telegram' : 'other';

      // Phone field is required in DB; use contact for max, placeholder otherwise
      const phone = data.messenger === 'max' ? data.contact : '—';

      const insertData: any = {
        name: data.name,
        phone,
        messenger: dbMessenger,
        messenger_username: `[${data.messenger.toUpperCase()}] ${data.contact}`,
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

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: '' }));
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
          className="mb-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          <img
            src={bookingIcon}
            alt=""
            aria-hidden="true"
            className="w-28 h-28 md:w-36 md:h-36 shrink-0 object-contain"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle at center, black 55%, transparent 80%)',
              maskImage:
                'radial-gradient(circle at center, black 55%, transparent 80%)',
            }}
          />
          <div className="text-center sm:text-left">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              <span className="gradient-text">Записаться</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Заполните форму, и я свяжусь с вами для обсуждения деталей
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto glass rounded-3xl p-8 md:p-10 space-y-6"
        >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Мессенджер *</label>
              <Select
                value={form.messenger}
                onValueChange={(v) => {
                  update('messenger', v as MessengerType);
                  update('contact', '');
                }}
              >
                <SelectTrigger className="bg-muted/50 border-border/50 rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="vk">ВКонтакте</SelectItem>
                  <SelectItem value="max">МАХ</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{contactLabels[form.messenger]} *</label>
              <Input
                value={form.contact}
                onChange={(e) => update('contact', e.target.value)}
                placeholder={contactPlaceholders[form.messenger]}
                className="bg-muted/50 border-border/50 rounded-xl h-12"
              />
              {errors.contact && <p className="text-destructive text-xs mt-1">{errors.contact}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="consent"
              checked={form.consent}
              onCheckedChange={(v) => update('consent', v === true)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Я ознакомлен(а) и согласен(на) с{' '}
              <Link to="/privacy" target="_blank" className="text-neon-cyan hover:underline">
                политикой конфиденциальности
              </Link>{' '}
              и даю согласие на обработку персональных данных.
            </label>
          </div>
          {errors.consent && <p className="text-destructive text-xs -mt-4">{errors.consent}</p>}

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
