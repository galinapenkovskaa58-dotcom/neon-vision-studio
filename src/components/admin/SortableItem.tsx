import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SortableItem({ id, children, className = '' }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group/sort ${className}`}>
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-muted/80 opacity-0 group-hover/sort:opacity-100 transition-opacity"
        title="Перетащить"
      >
        <GripVertical size={14} className="text-muted-foreground" />
      </button>
      {children}
    </div>
  );
}
