import { useState, useEffect } from 'react';

/**
 * Returns the current window inner width and updates on resize.
 * Used to compute responsive scale factors for visualizer elements
 * that cannot be driven purely by CSS (e.g. GSAP-animated bar heights).
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return width;
}
