import { useRef, useState, useCallback, useEffect } from 'react';

interface Props {
  src: string;
  position: string; // "x% y%"
  onChange: (position: string) => void;
  size?: number;
}

function parsePos(p: string): { x: number; y: number } {
  const m = p.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  if (!m) return { x: 50, y: 50 };
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

export default function FocalPointEditor({ src, position, onChange, size }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const { x, y } = parsePos(position || '50% 50%');

  const setFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const ny = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      onChange(`${nx.toFixed(1)}% ${ny.toFixed(1)}%`);
    },
    [onChange]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromEvent(e.clientX, e.clientY);
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, setFromEvent]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        setDragging(true);
        setFromEvent(e.clientX, e.clientY);
      }}
      className="relative w-full overflow-hidden rounded-md cursor-crosshair select-none touch-none border border-border/50"
      style={{ aspectRatio: '1 / 1', height: size }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: `${x}% ${y}%` }}
      />
      <div
        className="absolute w-5 h-5 rounded-full border-2 border-neon-cyan bg-background/40 shadow-[0_0_10px_hsl(var(--neon-cyan))] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
    </div>
  );
}
