import { useRef, useState, useEffect, useCallback } from 'react';
import { XIcon, GripVerticalIcon, CheckIcon, Copy } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTheme } from '@/components/ui/theme-provider';
import oneLight from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light';
import { useGSAP } from '@gsap/react';
import gsap from '@/gsapSetup';
import type { AlgoInfo } from '@/constants/algoInfo';

(SyntaxHighlighter as any).registerLanguage('python', python);
(SyntaxHighlighter as any).registerLanguage('java', java);
(SyntaxHighlighter as any).registerLanguage('cpp', cpp);
(SyntaxHighlighter as any).registerLanguage('javascript', javascript);
(SyntaxHighlighter as any).registerLanguage('go', go);

interface AlgoSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  algoInfo: AlgoInfo | null;
}

const PRISM_LANG: Record<keyof AlgoInfo['implementations'], string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
  golang: 'go',
};

const LANG_LABELS: { key: keyof AlgoInfo['implementations']; label: string }[] =
  [
    { key: 'python', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'cpp', label: 'C++' },
    { key: 'javascript', label: 'JS' },
    { key: 'golang', label: 'Go' },
  ];

const MIN_WIDTH = 360;
const MAX_WIDTH = 620;
const DEFAULT_WIDTH = 420;

const AlgoSideBar = ({ isOpen, onClose, algoInfo }: AlgoSideBarProps) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [langTab, setLangTab] =
    useState<keyof AlgoInfo['implementations']>('python');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const sidebarRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_WIDTH);

  const onHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartWidth.current = width;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    },
    [width]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      setWidth(
        Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + delta))
      );
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleCopy = () => {
    if (!algoInfo) return;
    navigator.clipboard
      .writeText(algoInfo.implementations[langTab])
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // ── Staggered entrance when sidebar opens or algoInfo changes ────────────
  useGSAP(
    () => {
      if (!isOpen || !algoInfo || !sidebarRef.current) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.32 },
      });

      // Header: eyebrow + title slide in from left
      tl.fromTo(
        '.algo-sidebar-eyebrow, .algo-sidebar-title',
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, stagger: 0.06 }
      );

      // Complexity block: items fade up with a tiny stagger
      tl.fromTo(
        '.algo-complexity-item',
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, stagger: 0.08 },
        '-=0.18'
      );

      // Description paragraph
      tl.fromTo(
        '.algo-sidebar-prose',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0 },
        '-=0.12'
      );

      // Steps: each row springs in with back.out
      tl.fromTo(
        '.algo-step-row',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.055,
          ease: 'back.out(1.4)',
          duration: 0.38,
        },
        '-=0.1'
      );
    },
    {
      scope: sidebarRef,
      dependencies: [isOpen, algoInfo?.name],
      revertOnUpdate: true,
    }
  );

  return (
    <aside
      ref={sidebarRef}
      className="algo-sidebar"
      style={{ width: isOpen ? width : 0 }}
      aria-hidden={!isOpen}
    >
      {/* Drag handle */}
      <div
        className="algo-sidebar-handle"
        onMouseDown={onHandleMouseDown}
        title="Drag to resize"
        style={{ cursor: 'col-resize' }}
      >
        <GripVerticalIcon className="h-3 w-3 text-muted-foreground/50" />
      </div>

      <div className="algo-sidebar-inner">
        {/* ── Header ── */}
        <header className="algo-sidebar-header">
          <div className="min-w-0 flex-1">
            <p className="algo-sidebar-eyebrow">
              {algoInfo?.category ?? 'Algorithm'}
            </p>
            <h2 className="algo-sidebar-title">{algoInfo?.name ?? '—'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="algo-sidebar-close"
            aria-label="Close algorithm panel"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </header>

        {/* ── Complexity two-column block ── */}
        {algoInfo && (
          <div className="algo-complexity-block">
            <div className="algo-complexity-item">
              <span className="algo-complexity-label">Time Complexity</span>
              <span className="algo-complexity-value">
                {algoInfo.complexity.time}
              </span>
            </div>
            <div className="algo-complexity-item algo-complexity-item--right">
              <span className="algo-complexity-label">Space Complexity</span>
              <span className="algo-complexity-value">
                {algoInfo.complexity.space}
              </span>
            </div>
          </div>
        )}

        {/* ── Tabs: Explanation / Code ── */}
        <Tabs defaultValue="explanation" className="algo-sidebar-tabs">
          {/* Main tab bar — no bottom border, borderless */}
          <TabsList className="algo-sidebar-tablist px-2">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="implementation">Code</TabsTrigger>
          </TabsList>

          {/* ── Explanation panel ── */}
          <TabsContent value="explanation" className="algo-sidebar-scroll-wrap">
            <div className="algo-sidebar-scroll algo-panel-animate">
              {algoInfo ? (
                <>
                  <section className="algo-section">
                    <p className="algo-section-label">Overview</p>
                    <p className="algo-sidebar-prose">{algoInfo.description}</p>
                  </section>
                  <section className="algo-section">
                    <p className="algo-section-label">How it works</p>
                    <ol className="algo-sidebar-steps">
                      {algoInfo.steps.map((step, i) => (
                        <li key={i} className="algo-step-row">
                          <span className="algo-step-num">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="algo-step-text">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </>
              ) : (
                <p className="algo-sidebar-empty">No info available.</p>
              )}
            </div>
          </TabsContent>

          {/* ── Implementation panel ── */}
          <TabsContent
            value="implementation"
            className="algo-sidebar-scroll-wrap"
          >
            {algoInfo ? (
              <>
                {/* Language underline tabs — same Tabs component, nested */}
                <Tabs
                  value={langTab}
                  onValueChange={(v) =>
                    setLangTab(v as keyof AlgoInfo['implementations'])
                  }
                  className="flex flex-col flex-1 min-h-0"
                >
                  <div className="algo-lang-tabbar">
                    <TabsList className="gap-1">
                      {LANG_LABELS.map(({ key, label }) => (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="px-4 py-3 text-[12px]"
                        >
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Copy button */}
                    <button
                      type="button"
                      className="algo-copy-btn"
                      onClick={handleCopy}
                      title="Copy code"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-3 w-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* One TabsContent per language — re-keyed for animation */}
                  {LANG_LABELS.map(({ key }) => (
                    <TabsContent
                      key={key}
                      value={key}
                      className="algo-code-wrap algo-panel-animate"
                    >
                      <SyntaxHighlighter
                        language={PRISM_LANG[key]}
                        style={isDark ? vscDarkPlus : oneLight}
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem 1rem',
                          borderRadius: 0,
                          fontSize: '14px',
                          lineHeight: '1.7',
                          background: isDark ? '#0e1117' : '#ffffff',
                          height: '100%',
                          overflowY: 'auto',
                          overflowX: 'auto',
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily:
                              "'IBM Plex Mono', 'Fira Code', monospace",
                          },
                        }}
                        showLineNumbers
                        lineNumberStyle={{
                          minWidth: '2.5em',
                          paddingRight: '1em',
                          color: isDark
                            ? 'rgba(255,255,255,0.18)'
                            : 'rgba(0,0,0,0.25)',
                          userSelect: 'none',
                          fontSize: '12px',
                        }}
                        wrapLongLines={false}
                      >
                        {algoInfo.implementations[key]}
                      </SyntaxHighlighter>
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            ) : (
              <p className="algo-sidebar-empty px-5 py-4">
                No implementations available.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
};

export default AlgoSideBar;
