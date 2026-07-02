import { useRef, useState, type ReactNode } from 'react';
import { BookOpenIcon } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from '@/gsapSetup';
import AlgoSideBar from '@/components/AlgoSideBar';
import FloatingHelper, {
  type FloatingHelperProps,
} from '@/components/FloatingHelper';
import type { AlgoInfo } from '@/constants/algoInfo';

type AlgoBookShellProps = {
  children: ReactNode;
  algoInfo: AlgoInfo | null;
  helper?: Omit<FloatingHelperProps, 'boundsRef'>;
};

/** Side-by-side viz + algorithm reference panel. */
const AlgoBookShell = ({ children, algoInfo, helper }: AlgoBookShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const vizRef = useRef<HTMLDivElement>(null);
  const bookBtnRef = useRef<HTMLButtonElement>(null);

  // Bounce-in the book button when algoInfo becomes available
  useGSAP(
    () => {
      if (!bookBtnRef.current || !algoInfo || sidebarOpen) return;
      gsap.fromTo(
        bookBtnRef.current,
        { scale: 0, rotation: -25, autoAlpha: 0 },
        {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: 'back.out(2)',
        }
      );
    },
    { dependencies: [!!algoInfo, sidebarOpen], scope: vizRef }
  );

  return (
    <div className="algo-book-shell flex h-screen w-full overflow-hidden bg-background">
      <div
        ref={vizRef}
        className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      >
        {children}

        {/* Book toggle — bounces in when algoInfo is present */}
        {!sidebarOpen && (
          <button
            ref={bookBtnRef}
            type="button"
            className="algo-book-btn"
            style={{ display: !algoInfo ? 'none' : undefined }}
            onClick={() => setSidebarOpen(true)}
            title="Algorithm reference"
            aria-label="Open algorithm reference"
          >
            <BookOpenIcon className="h-4 w-4" />
          </button>
        )}

        <FloatingHelper boundsRef={vizRef} {...helper} />
      </div>

      <AlgoSideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        algoInfo={algoInfo}
      />
    </div>
  );
};

export default AlgoBookShell;
