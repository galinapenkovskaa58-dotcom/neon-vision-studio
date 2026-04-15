import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { arrayMove } from '@dnd-kit/sortable';

type SortableTable = 'styles' | 'portfolio' | 'tariffs' | 'reviews';

export function useReorder(table: SortableTable, queryKeys: string[]) {
  const queryClient = useQueryClient();

  const reorder = useMutation({
    mutationFn: async ({ items, oldIndex, newIndex }: { items: any[]; oldIndex: number; newIndex: number }) => {
      const reordered = arrayMove(items, oldIndex, newIndex);
      const updates = reordered.map((item, i) => 
        supabase.from(table).update({ sort_order: i } as any).eq('id', item.id)
      );
      await Promise.all(updates);
      return reordered;
    },
    onSuccess: () => {
      queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });

  return reorder;
}
