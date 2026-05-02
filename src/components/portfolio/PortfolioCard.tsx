import { Images } from 'lucide-react';

export type PortfolioCardData = {
  title: string;
  description?: string | null;
  category?: string | null;
  images: string[];
  positions?: string[];
};

export default function PortfolioCard({
  data,
  onClick,
}: {
  data: PortfolioCardData;
  onClick?: () => void;
}) {
  const tiles = data.images.slice(0, 9);
  const moreCount = Math.max(0, data.images.length - 9);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative rounded-2xl overflow-hidden gradient-border"
    >
      <div className="relative aspect-square overflow-hidden bg-card/40">
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-1">
          {tiles.map((src, idx) => {
            const isLast = idx === tiles.length - 1 && moreCount > 0;
            const pos = data.positions?.[idx] || '50% 50%';
            return (
              <div key={src + idx} className="relative overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={`${data.title} ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ objectPosition: pos }}
                  loading="lazy"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-neon-cyan">
                    +{moreCount}
                  </div>
                )}
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 9 - tiles.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="rounded-md bg-card/40" />
          ))}
        </div>

        {data.images.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md text-xs font-semibold text-foreground border border-neon-cyan/30">
            <Images size={13} className="text-neon-cyan" />
            {data.images.length}
          </div>
        )}
      </div>

      <div className="p-5 bg-card/40">
        <h3 className="font-heading font-semibold text-lg">{data.title || 'Без названия'}</h3>
        {data.description && (
          <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{data.description}</p>
        )}
        {data.category && (
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
            {data.category}
          </span>
        )}
      </div>
    </div>
  );
}
