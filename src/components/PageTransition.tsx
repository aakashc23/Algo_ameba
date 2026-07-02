import { useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from '@/gsapSetup';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps a page with a subtle GSAP enter animation.
 * On mount: fades in and lifts up from y:18 with power2.out.
 * Uses useGSAP so cleanup is automatic on unmount.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useGSAP(
    () => {
      if (!ref.current) return;
      // useGSAP uses useLayoutEffect internally, so this fromTo executes synchronously
      // before the browser paints the new route, preventing any flash.
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }
      );
    },
    { dependencies: [location.pathname], scope: ref }
  );

  return (
    <div ref={ref} style={{ height: '100%' }}>
      {children}
    </div>
  );
}
