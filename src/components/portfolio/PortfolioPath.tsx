import { useEffect, useState, RefObject } from 'react';
import { toneStyles, NeonTone } from './PortfolioNode';

type Props = {
  containerRef: RefObject<HTMLDivElement>;
  nodeRefs: RefObject<HTMLDivElement>[];
  tones: NeonTone[];
};

type Point = { x: number; y: number };

export default function PortfolioPath({ containerRef, nodeRefs, tones }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const compute = () => {
      const c = containerRef.current;
      if (!c) return;
      const cb = c.getBoundingClientRect();
      setSize({ w: cb.width, h: cb.height });
      const pts: Point[] = nodeRefs
        .map((r) => {
          const el = r.current;
          if (!el) return null;
          const b = el.getBoundingClientRect();
          // Anchor at top-center of node (circle is at top of label stack)
          const circle = el.querySelector('button');
          const cb2 = circle ? circle.getBoundingClientRect() : b;
          return {
            x: cb2.left + cb2.width / 2 - cb.left,
            y: cb2.top + cb2.height / 2 - cb.top,
          };
        })
        .filter(Boolean) as Point[];
      setPoints(pts);
    };

    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    nodeRefs.forEach((r) => r.current && ro.observe(r.current));
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    const t = setTimeout(compute, 100);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
      clearTimeout(t);
    };
  }, [containerRef, nodeRefs]);

  if (points.length < 2 || size.w === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none hidden md:block"
      width={size.w}
      height={size.h}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {points.slice(0, -1).map((_, i) => {
          const from = toneStyles[tones[i] || 'cyan'].hex;
          const to = toneStyles[tones[i + 1] || 'purple'].hex;
          return (
            <linearGradient key={`g-${i}`} id={`pp-grad-${i}`} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={from} stopOpacity="0.9" />
              <stop offset="100%" stopColor={to} stopOpacity="0.9" />
            </linearGradient>
          );
        })}
      </defs>
      {points.slice(0, -1).map((p, i) => {
        const n = points[i + 1];
        const dx = n.x - p.x;
        const dy = n.y - p.y;
        // Start/end offset so arrow doesn't overlap circles (~70px radius)
        const r = 72;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const sx = p.x + ux * r;
        const sy = p.y + uy * r;
        const ex = n.x - ux * r;
        const ey = n.y - uy * r;

        // Curvy: perpendicular offset, alternating direction
        const sign = i % 2 === 0 ? 1 : -1;
        const curveAmp = Math.min(140, len * 0.45) * sign;
        const px = -uy * curveAmp;
        const py = ux * curveAmp;
        const c1x = sx + dx * 0.3 + px;
        const c1y = sy + dy * 0.3 + py;
        const c2x = sx + dx * 0.7 + px;
        const c2y = sy + dy * 0.7 + py;

        const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
        const grad = `url(#pp-grad-${i})`;

        // Arrow head
        const angle = Math.atan2(ey - c2y, ex - c2x);
        const ah = 10;
        const aw = 6;
        const ax1 = ex - Math.cos(angle) * ah - Math.sin(angle) * aw;
        const ay1 = ey - Math.sin(angle) * ah + Math.cos(angle) * aw;
        const ax2 = ex - Math.cos(angle) * ah + Math.sin(angle) * aw;
        const ay2 = ey - Math.sin(angle) * ah - Math.cos(angle) * aw;

        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={grad}
              strokeWidth={2}
              strokeDasharray="6 6"
              strokeLinecap="round"
              opacity={0.85}
            />
            <polygon
              points={`${ex},${ey} ${ax1},${ay1} ${ax2},${ay2}`}
              fill={toneStyles[tones[i + 1] || 'purple'].hex}
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
}
