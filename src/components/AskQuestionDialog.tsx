import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Send, CheckCircle, MessageCircleQuestion } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

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

const schema = z.object({
  question: z.string().trim().min(5, 'Опишите вопрос подробнее').max(2000, 'Слишком длинный текст'),
  name: z.string().trim().min(2, 'Введите имя').max(100),
  messenger: z.enum(['telegram', 'vk', 'max', 'other'] as const),
  contact: z.string().trim().min(2, 'Введите контакт').max(200),
  consent: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласие' }) }),
});

type FormData = z.infer<typeof schema>;

interface AskQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AskQuestionDialog({ open, onOpenChange }: AskQuestionDialogProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    question: '',
    name: '',
    messenger: 'telegram' as MessengerType,
    contact: '',
    consent: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const dbMessenger: 'telegram' | 'whatsapp' | 'other' =
        data.messenger === 'telegram' ? 'telegram' : 'other';
      const phone = data.messenger === 'max' ? data.contact : '—';

      const { error } = await supabase.from('questions').insert({
        name: data.name,
        phone,
        messenger: dbMessenger,
        messenger_username: `[${data.messenger.toUpperCase()}] ${data.contact}`,
        question: data.question,
      });
      if (error) throw error;
    },
    onSuccess: () => setSubmitted(true),
    onError: () =>
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить вопрос. Попробуйте позже.',
        variant: 'destructive',
      }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
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

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Reset on close so a fresh open is clean
      setTimeout(() => {
        setSubmitted(false);
        setErrors({});
        setForm({ question: '', name: '', messenger: 'telegram', contact: '', consent: false });
      }, 200);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-strong border-border/40 rounded-3xl p-0">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <DialogTitle className="sr-only">Вопрос отправлен</DialogTitle>
            <DialogDescription className="sr-only">
              Ваш вопрос успешно отправлен, мы скоро свяжемся с вами.
            </DialogDescription>
            <CheckCircle size={64} className="text-neon-cyan mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-bold mb-3">Вопрос отправлен!</h3>
            <p className="text-muted-foreground">
              Мы свяжемся с вами в ближайшее время и ответим на все вопросы.
            </p>
          </motion.div>
        ) : (
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center shrink-0">
                <MessageCircleQuestion size={28} className="text-neon-cyan" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-heading font-bold">
                  <span className="gradient-text">Задать вопрос</span>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1">
                  Расскажите, что вас интересует — мы ответим в выбранном мессенджере
                </DialogDescription>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Ваш вопрос *</label>
                <Textarea
                  value={form.question}
                  onChange={(e) => update('question', e.target.value)}
                  placeholder="Опишите, что вы хотите узнать..."
                  rows={4}
                  className="bg-muted/50 border-border/50 rounded-xl resize-none"
                />
                {errors.question && (
                  <p className="text-destructive text-xs mt-1">{errors.question}</p>
                )}
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <label className="block text-sm font-medium mb-2">
                    {contactLabels[form.messenger]} *
                  </label>
                  <Input
                    value={form.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    placeholder={contactPlaceholders[form.messenger]}
                    className="bg-muted/50 border-border/50 rounded-xl h-12"
                  />
                  {errors.contact && (
                    <p className="text-destructive text-xs mt-1">{errors.contact}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="ask-consent"
                  checked={form.consent}
                  onCheckedChange={(v) => update('consent', v === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="ask-consent"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  Я ознакомлен(а) и согласен(на) с{' '}
                  <Link to="/privacy" target="_blank" className="text-neon-cyan hover:underline">
                    политикой конфиденциальности
                  </Link>{' '}
                  и даю согласие на обработку персональных данных.
                </label>
              </div>
              {errors.consent && (
                <p className="text-destructive text-xs -mt-3">{errors.consent}</p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full neon-glow-btn text-primary-foreground py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  'Отправка...'
                ) : (
                  <>
                    <Send size={20} />
                    Отправить вопрос
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
