import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

const statusColors: Record<string, string> = {
  new: 'bg-neon-cyan/20 text-neon-cyan',
  in_progress: 'bg-neon-blue/20 text-neon-blue',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-destructive/20 text-destructive',
};

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, tariffs(name)')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status as any })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Заявки ({bookings.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-muted/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
            <SelectItem value="cancelled">Отменённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Мессенджер</TableHead>
              <TableHead>Тариф</TableHead>
              <TableHead>Стиль</TableHead>
              <TableHead>Срочность</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(b.created_at!).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>
                  {b.messenger}{b.messenger_username ? ` (${b.messenger_username})` : ''}
                </TableCell>
                <TableCell>{(b as any).tariffs?.name || '—'}</TableCell>
                <TableCell>{b.style || '—'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={b.urgency === 'urgent' ? 'border-neon-pink text-neon-pink' : ''}>
                    {b.urgency === 'urgent' ? '⚡ Срочная' : 'Обычная'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={b.status || 'new'}
                    onValueChange={(v) => updateStatus.mutate({ id: b.id, status: v })}
                  >
                    <SelectTrigger className={`w-36 rounded-lg text-xs ${statusColors[b.status || 'new']}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">Заявок пока нет</div>
        )}
      </div>
    </div>
  );
}
