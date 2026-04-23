import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function HashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }
    // Wait for content (sections fetch data) to mount
    let attempts = 0;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts++ < 20) setTimeout(tryScroll, 100);
    };
    tryScroll();
  }, [pathname, hash]);

  return null;
}
