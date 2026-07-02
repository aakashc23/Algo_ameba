import { useState, useEffect, useRef, type RefObject } from 'react';
import { EyeIcon, XIcon, GripVerticalIcon } from 'lucide-react';
import gsap from '../gsapSetup';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export interface FloatingHelperProps {
  text?: string;
  textId?: string;
  defaultVisible?: boolean;
  nextExploring?: number[];
  pathFollowed?: number[];
  algo?: string;
  /** When set, helper is positioned inside this container. */
  boundsRef?: RefObject<HTMLElement | null>;
}

const FloatingHelper = ({
  text = ' ',
  textId = 'helper-text',
  defaultVisible = true,
  nextExploring,
  pathFollowed,
  algo,
  boundsRef,
}: FloatingHelperProps) => {
  const [visible, setVisible] = useState(defaultVisible);
  const helperRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | undefined>(undefined);

  const anchored = Boolean(boundsRef);
  const isEmpty = !text || text.trim() === '';
  const positionClass = anchored
    ? 'absolute top-[80px] left-3 z-30'
    : 'fixed top-[80px] right-3 z-50';

  // Recreate Draggable whenever visibility changes to update the trigger element.
  useEffect(() => {
    if (!helperRef.current) return;

    // The trigger is the header when visible, or the whole element (icon) when hidden
    const triggerEl = visible ? dragHandleRef.current : helperRef.current;
    if (!triggerEl) return;

    const bounds = boundsRef?.current ?? document.body;

    draggableRef.current = Draggable.create(helperRef.current, {
      type: 'x,y',
      trigger: triggerEl,
      bounds,
      zIndexBoost: false,
      // Allow buttons to be dragged, and handle their clicks via GSAP to ensure mobile compatibility
      dragClickables: true,
      onClick: (e) => {
        const target = e.target as HTMLElement | SVGElement;
        if (!visible) {
          if (target.closest('.floating-helper-icon-btn')) {
            setVisible(true);
          }
        } else {
          if (target.closest('.floating-helper-close')) {
            setVisible(false);
          }
        }
      },
    });

    return () => {
      draggableRef.current?.forEach((d) => d.kill());
      draggableRef.current = undefined;
    };
  }, [visible, boundsRef]);

  return (
    <div
      ref={helperRef}
      className={`${positionClass} flex flex-col items-start gap-2`}
      style={{ touchAction: 'none' }}
    >
      {!visible && (
        <button
          type="button"
          className="floating-helper-icon-btn cursor-move"
          title="Show helper"
          aria-label="Show helper"
        >
          <EyeIcon className="h-5 w-5 text-brand pointer-events-none" />
        </button>
      )}

      {visible && (
        <div
          className="floating-helper-card"
          style={{
            /* ── Resizable card ──────────────────────────────────────────
             * BOTH axes need an explicit size for `resize` to work.
             * Without a concrete height the browser can only resize width.
             * overflow:auto enables the native resize grip (◢ corner).
             * ─────────────────────────────────────────────────────────── */
            resize: 'both',
            overflow: 'hidden', // outer clips; inner scrolls
            width: 'min(100vw - 1.5rem, 320px)',
            height: '240px', // explicit → vertical resize works
            minWidth: '200px',
            maxWidth: '560px',
            minHeight: '120px',
            maxHeight: '80vh',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drag handle — only this strip initiates GSAP drag */}
          <div
            ref={dragHandleRef}
            className="floating-helper-drag-handle flex w-full items-center justify-between gap-2 px-3 py-1.5 cursor-move select-none"
            style={{
              borderBottom:
                '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
              borderRadius: 'inherit',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              background:
                'color-mix(in srgb, var(--panel-bg) 60%, transparent)',
            }}
          >
            <div className="flex items-center gap-1.5 opacity-60 pointer-events-none">
              <GripVerticalIcon
                className="h-3.5 w-3.5"
                style={{ color: 'var(--muted-text)' }}
              />
              <span
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--muted-text)' }}
              >
                Step log
              </span>
            </div>
            <button
              type="button"
              className="floating-helper-close cursor-pointer"
              aria-label="Hide helper"
            >
              <XIcon className="h-4 w-4 pointer-events-none" />
            </button>
          </div>

          {/* Content area — takes remaining height, scrolls if content overflows */}
          <div
            className="floating-helper-panel"
            style={{
              borderTop: 'none',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <p
              id={textId}
              className={`font-plex text-sm font-medium leading-relaxed ${
                isEmpty ? 'italic' : 'text-foreground'
              }`}
              style={isEmpty ? { color: 'var(--muted-text)' } : undefined}
            >
              {isEmpty
                ? 'Run the algorithm to see step-by-step hints here.'
                : text}
            </p>

            {nextExploring && nextExploring.length > 0 && (
              <div className="floating-helper-section">
                <p className="floating-helper-section-title">
                  Next exploring {algo === 'DFS' ? '(stack)' : '(queue)'}
                </p>
                <div
                  className={`flex flex-wrap gap-2 pr-1 ${algo === 'DFS' ? 'flex-col-reverse' : 'flex-row'}`}
                >
                  {nextExploring.map((node, idx) => (
                    <span
                      key={`exploring-${node}-${idx}`}
                      className="floating-helper-chip floating-helper-chip--warn"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pathFollowed && pathFollowed.length > 0 && (
              <div className="floating-helper-section">
                <p className="floating-helper-section-title">Path followed</p>
                <div className="flex flex-row flex-wrap gap-2 pr-1">
                  {pathFollowed.map((node, idx) => (
                    <span
                      key={`path-${node}-${idx}`}
                      className="floating-helper-chip floating-helper-chip--info"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingHelper;
