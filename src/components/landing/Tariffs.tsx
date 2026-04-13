import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';

export default function Tariffs() {
  const { data: tariffs = [] } = useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tariffs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      return data || [];
    },
  });

  const scrollToBooking = (tariffId: string) => {
    const el = document.querySelector('#booking');
    el?.scrollIntoView({ behavior: 'smooth' });
    // Store selected tariff for the form
    window.dispatchEvent(new CustomEvent('select-tariff', { detail: tariffId }));
  };

  const accentClasses = [
    'from-neon-blue to-neon-cyan',
    'from-neon-purple to-neon-pink',
    'from-neon-cyan to-neon-purple',
  ];

  return (
    <section id="tariffs" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="gradient-text">Тарифы</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Выберите подходящий пакет для вашей нейрофотосессии
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tariffs.map((tariff, i) => {
            const features = Array.isArray(tariff.features) ? tariff.features as string[] : [];
            const gradient = accentClasses[i % accentClasses.length];
            const isMiddle = tariffs.length === 3 && i === 1;

            return (
              <motion.div
                key={tariff.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`glass rounded-3xl p-8 flex flex-col gradient-border ${
                  isMiddle ? 'lg:-mt-4 lg:mb-4 ring-1 ring-neon-purple/30' : ''
                }`}
              >
                {isMiddle && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-neon-purple mb-4">
                    Популярный
                  </span>
                )}
                <h3 className="text-2xl font-heading font-bold mb-2">{tariff.name}</h3>
                {tariff.description && (
                  <p className="text-muted-foreground text-sm mb-6">{tariff.description}</p>
                )}
                <div className="mb-6">
                  <span className={`text-4xl font-heading font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    {tariff.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-neon-cyan mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToBooking(tariff.id)}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    isMiddle
                      ? 'neon-glow-btn text-primary-foreground'
                      : 'glass hover:bg-card/80'
                  }`}
                >
                  Выбрать
                </button>
              </motion.div>
            );
          })}
        </div>

        {tariffs.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>Тарифы скоро появятся</p>
          </div>
        )}
      </div>
    </section>
  );
}
