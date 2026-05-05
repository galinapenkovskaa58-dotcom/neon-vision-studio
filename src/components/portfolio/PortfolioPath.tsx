import { useEffect, useState, RefObject, useMemo } from 'react';
import { toneStyles, NeonTone } from './PortfolioNode';

type Props = {
  containerRef: RefObject<HTMLDivElement>;
  nodeRefs: RefObject<HTMLDivElement>[];
  tones: NeonTone[];
  hoveredIndex?: number | null;
};

type Point = { x: number; y: number };

export default function PortfolioPath({ containerRef, nodeRefs, tones, hoveredIndex = null }: Props) {
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
          const circle = el.querySelector('button');
          const cb2 = circle ? circle.getBoundingClientRect() : el.getBoundingClientRect();
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

  // Pre-compute segments
  const segments = useMemo(() => {
    if (points.length < 2) return [] as Array<{
      d: string;
      from: string;
      to: string;
      i: number;
    }>;
    return points.slice(0, -1).map((p, i) => {
      const n = points[i + 1];
      const dx = n.x - p.x;
      const dy = n.y - p.y;
      const r = 70;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const sx = p.x + ux * r;
      const sy = p.y + uy * r;
      const ex = n.x - ux * r;
      const ey = n.y - uy * r;
      const sign = i % 2 === 0 ? 1 : -1;
      const curveAmp = Math.min(160, len * 0.5) * sign;
      const px = -uy * curveAmp;
      const py = ux * curveAmp;
      const c1x = sx + dx * 0.3 + px;
      const c1y = sy + dy * 0.3 + py;
      const c2x = sx + dx * 0.7 + px;
      const c2y = sy + dy * 0.7 + py;
      return {
        d: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`,
        from: toneStyles[tones[i] || 'cyan'].hex,
        to: toneStyles[tones[i + 1] || 'purple'].hex,
        i,
      };
    });
  }, [points, tones]);

  if (segments.length === 0 || size.w === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none hidden md:block"
      width={size.w}
      height={size.h}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {segments.map((s) => (
          <linearGradient key={`g-${s.i}`} id={`pp-grad-${s.i}`} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={s.from} stopOpacity="0.85" />
            <stop offset="50%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.7" />
            <stop offset="100%" stopColor={s.to} stopOpacity="0.85" />
          </linearGradient>
        ))}
        <filter id="pp-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pp-particle-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {segments.map((s) => {
        const isActive = hoveredIndex !== null && (hoveredIndex === s.i || hoveredIndex === s.i + 1);
        const isDimmed = hoveredIndex !== null && !isActive;
        const baseOp = isDimmed ? 0.12 : isActive ? 1 : 0.55;
        const grad = `url(#pp-grad-${s.i})`;
        const pathId = `pp-path-${s.i}`;

        // particles per segment - slight chaos via varied delays/durations
        const particles = [
          { dur: 7.5, delay: 0, r: 2.2 },
          { dur: 9, delay: -2.4, r: 1.8 },
          { dur: 11, delay: -5.5, r: 2.6 },
          { dur: 8.2, delay: -3.7, r: 1.6 },
        ];
        const speedFactor = isActive ? 0.55 : 1;

        return (
          <g
            key={s.i}
            style={{
              opacity: baseOp,
              transition: 'opacity 0.5s ease',
            }}
          >
            <path id={pathId} d={s.d} fill="none" stroke="transparent" />
            {/* Outer halo */}
            <path
              d={s.d}
              fill="none"
              stroke={grad}
              strokeWidth={isActive ? 8 : 6}
              strokeLinecap="round"
              opacity={isActive ? 0.35 : 0.18}
              filter="url(#pp-soft-glow)"
              style={{ transition: 'all 0.5s ease' }}
            />
            {/* Core line */}
            <path
              d={s.d}
              fill="none"
              stroke={grad}
              strokeWidth={isActive ? 1.6 : 1.1}
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.75}
              style={{ transition: 'all 0.5s ease' }}
            />

            {/* Flowing particles */}
            {particles.map((p, pi) => (
              <circle
                key={pi}
                r={isActive ? p.r * 1.3 : p.r}
                fill={pi % 2 === 0 ? s.from : s.to}
                filter="url(#pp-particle-glow)"
                opacity={isActive ? 1 : 0.7}
                style={{ transition: 'all 0.4s ease' }}
              >
                <animateMotion
                  dur={`${p.dur * speedFactor}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyTimes="0;0.15;0.5;0.85;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                  calcMode="spline"
                  values=""
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values={isActive ? '0;1;1;1;0' : '0;0.7;0.9;0.7;0'}
                  dur={`${p.dur * speedFactor}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        );
      })}

      {/* Pulsing nodes when hovered */}
      {points.map((p, i) => {
        const active = hoveredIndex === i;
        if (!active) return null;
        const hex = toneStyles[tones[i] || 'cyan'].hex;
        return (
          <g key={`pulse-${i}`}>
            <circle cx={p.x} cy={p.y} r={70} fill="none" stroke={hex} strokeWidth={1} opacity={0.6}>
              <animate attributeName="r" values="70;95;70" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
