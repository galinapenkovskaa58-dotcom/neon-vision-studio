import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusLabels: Record<string, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  answered: 'Отвечен',
  closed: 'Закрыт',
};

const statusColors: Record<string, string> = {
  new: 'bg-neon-cyan/20 text-neon-cyan',
  in_progress: 'bg-neon-blue/20 text-neon-blue',
  answered: 'bg-green-500/20 text-green-400',
  closed: 'bg-muted text-muted-foreground',
};

export default function AdminQuestions() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');

  const { data: questions = [] } = useQuery({
    queryKey: ['admin-questions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('questions')
        .update({ status: status as any })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-questions'] }),
  });

  const filtered = filter === 'all' ? questions : questions.filter((q) => q.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Вопросы ({questions.length})</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-muted/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="answered">Отвеченные</SelectItem>
            <SelectItem value="closed">Закрытые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Контакт</TableHead>
              <TableHead className="min-w-[300px]">Вопрос</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(q.created_at).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell className="font-medium">{q.name}</TableCell>
                <TableCell className="text-xs">
                  {q.messenger}
                  {q.messenger_username ? ` (${q.messenger_username})` : ''}
                  {q.phone && q.phone !== '—' ? ` · ${q.phone}` : ''}
                </TableCell>
                <TableCell className="text-sm whitespace-pre-wrap">{q.question}</TableCell>
                <TableCell>
                  <Select
                    value={q.status || 'new'}
                    onValueChange={(v) => updateStatus.mutate({ id: q.id, status: v })}
                  >
                    <SelectTrigger className={`w-36 rounded-lg text-xs ${statusColors[q.status || 'new']}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">Вопросов пока нет</div>
        )}
      </div>
    </div>
  );
}
