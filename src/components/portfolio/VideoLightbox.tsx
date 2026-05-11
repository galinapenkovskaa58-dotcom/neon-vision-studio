import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type Props = {
  videoUrl: string;
  title?: string;
  onClose: () => void;
};

// Преобразуем YouTube/VK ссылки в embed-формат
function toEmbed(url: string): { type: 'iframe' | 'video' | 'link'; src: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    // YouTube
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') || u.pathname.split('/').pop();
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` };
    }

    // VK Video — ожидаем ссылку вида https://vk.com/video_ext.php?... либо https://vk.com/video-XXX_YYY
    if (host.endsWith('vk.com') || host.endsWith('vk.ru')) {
      if (u.pathname.startsWith('/video_ext.php')) {
        return { type: 'iframe', src: url };
      }
      const m = u.pathname.match(/video(-?\d+)_(\d+)/);
      if (m) {
        return {
          type: 'iframe',
          src: `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2&autoplay=1`,
        };
      }
    }

    // RuTube
    if (host.endsWith('rutube.ru')) {
      const m = u.pathname.match(/video\/([a-z0-9]+)/);
      if (m) return { type: 'iframe', src: `https://rutube.ru/play/embed/${m[1]}?autoStart=true` };
    }

    // Vimeo
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }

    // Прямой видеофайл
    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(u.pathname)) {
      return { type: 'video', src: url };
    }
  } catch {
    /* noop */
  }
  return { type: 'link', src: url };
}

export default function VideoLightbox({ videoUrl, title, onClose }: Props) {
  const embed = toEmbed(videoUrl);

  // Если ссылку не распознали — открываем в новой вкладке
  if (embed.type === 'link') {
    if (typeof window !== 'undefined') {
      window.open(embed.src, '_blank', 'noopener,noreferrer');
    }
    onClose();
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-2 sm:-right-12 z-10 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-card/90 transition-colors"
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>

        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl glass-strong"
          style={{
            boxShadow:
              '0 0 40px hsl(var(--neon-purple) / 0.35), 0 0 80px hsl(var(--neon-cyan) / 0.2)',
          }}
        >
          {embed.type === 'iframe' ? (
            <iframe
              src={embed.src}
              title={title || 'Видео'}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={embed.src}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full bg-black"
            />
          )}
        </div>

        {title && (
          <p className="mt-4 text-center text-sm sm:text-base text-foreground/80 font-medium">
            {title}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
