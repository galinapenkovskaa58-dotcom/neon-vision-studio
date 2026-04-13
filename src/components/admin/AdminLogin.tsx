import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Ошибка входа', description: error.message, variant: 'destructive' });
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-heading font-bold gradient-text mb-8 text-center">Админ-панель</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted/50 border-border/50 rounded-xl h-12"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50 border-border/50 rounded-xl h-12"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full neon-glow-btn rounded-full h-12 text-primary-foreground">
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
