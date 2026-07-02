import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import gsap from '@/gsapSetup'; // centralized GSAP instance with plugins registered
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import SharedLayout from '@/components/SharedLayout';
import AlgoBookShell from '@/components/AlgoBookShell';
import { SEARCH_ALGO_INFO } from '@/constants/algoInfo';
import { ROUTES } from '@/constants/routes';
import { useSearchVizulizer } from '@/hooks/useSearchVizulizer';
import {
  searchAlgorithms,
  type SearchFrame,
} from '@/components/search/searchAlgorithms';
import {
  SEARCH_LINEAR_LEGEND,
  SEARCH_BINARY_LEGEND,
} from '@/components/ColorLegend';

type SearchMode = 'linear' | 'binary';

const algoMap = [
  { name: 'Linear Search', value: 'linear' },
  { name: 'Binary Search', value: 'binary' },
] as const;

// How many pixels correspond to xFraction = 1.0
const X_OFFSET_SCALE = 220;
// How many pixels does yLevel=1 lift a bar
const Y_LEVEL_PX = 28;

const SearchPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeMode: SearchMode =
    location.pathname === ROUTES.search ? 'binary' : 'linear';
  const queryMode = searchParams.get('mode');
  const initialMode: SearchMode =
    queryMode === 'binary' || queryMode === 'linear' ? queryMode : routeMode;
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [phaseLabel, setPhaseLabel] = useState(' ');
  const barsContainerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    bars,
    setBars,
    setBarStates,
    inputValue,
    setInputValue,
    searchValue,
    setSearchValue,
    isPlaying,
    setIsPlaying,
    timelineRef,
    labelsRef,
    resetAnimation,
    handleInsert,
    generateRandomArray,
    playSteps,
    pauseSteps,
    nextStep,
    prevStep,
    getBarColor,
    speed,
    setPlaybackSpeed,
    increaseSpeed,
    decreaseSpeed,
  } = useSearchVizulizer();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const { contextSafe } = useGSAP({ scope: barsContainerRef });
  const activeLineRef = useRef<SVGPathElement>(null);

  // Subtle fade+lift when search algorithm switches
  useGSAP(
    () => {
      if (!barsContainerRef.current) return;
      gsap.fromTo(
        barsContainerRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    },
    { dependencies: [mode], scope: barsContainerRef, revertOnUpdate: true }
  );

  const getExistingBarElements = (ids: string[]) =>
    ids
      .map((id) => barRefs.current[id])
      .filter((element): element is HTMLDivElement => Boolean(element));

  const clearActiveLine = contextSafe(() => {
    const path = activeLineRef.current;
    if (!path) return;
    gsap.killTweensOf(path);
    gsap.set(path, { attr: { d: '' }, opacity: 0 });
  });

  // ── Celebration: found bar rises, discarded bars sweep home ──
  const animateFoundCelebration = contextSafe((frame: SearchFrame) => {
    const foundId = frame.focusId;
    const allDiscarded = [
      ...(frame.leftDiscardedIds ?? []),
      ...(frame.rightDiscardedIds ?? []),
      ...(frame.discardedIds ?? []),
    ];
    const returnIds = [...new Set(allDiscarded)];
    const returnEls = getExistingBarElements(returnIds);
    const foundEl = foundId ? barRefs.current[foundId] : null;

    clearActiveLine();

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', overwrite: 'auto' },
    });

    // 1. All discarded bars sweep back, stagger edges inward
    if (returnEls.length > 0) {
      tl.to(
        returnEls,
        {
          x: 0,
          y: 0,
          opacity: 0.28,
          filter: 'grayscale(80%)',
          duration: 0.9,
          stagger: { amount: 0.22, from: 'edges' },
          ease: 'power2.out',
        },
        0
      );
    }

    // 2. Found bar resets x, then launches up with a celebratory bounce
    if (foundEl) {
      tl.set(foundEl, { x: 0, y: 0 }, 0);
      tl.to(
        foundEl,
        { y: -36, scale: 1.22, duration: 0.55, ease: 'back.out(2.8)' },
        0.45
      );

      // 3. Neon green glow ring — expands then settles
      tl.to(
        foundEl,
        {
          boxShadow:
            '0 0 0 6px rgba(0,255,17,0.45), 0 0 32px rgba(0,255,17,0.3)',
          duration: 0.35,
          ease: 'power2.out',
        },
        0.8
      );
      tl.to(
        foundEl,
        {
          boxShadow:
            '0 0 0 3px rgba(0,255,17,0.2), 0 0 14px rgba(0,255,17,0.15)',
          duration: 0.6,
          ease: 'power1.inOut',
        },
        1.15
      );
    }
  });

  // ── Not-found ending: everything sinks and desaturates ──
  const animateNotFound = contextSafe((_frame: SearchFrame) => {
    const allEls = getExistingBarElements(bars.map((b) => b.id));
    clearActiveLine();
    gsap.to(allEls, {
      opacity: 0.2,
      y: 12,
      filter: 'grayscale(100%)',
      duration: 0.7,
      stagger: { amount: 0.18, from: 'center' },
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  });

  // ── Main binary animation: uses xFraction + yLevel offsets from frame ──
  const animateBinaryFrame = contextSafe((frame: SearchFrame) => {
    if (frame.isFinalFound) {
      animateFoundCelebration(frame);
      return;
    }
    if (frame.isNotFound) {
      animateNotFound(frame);
      return;
    }

    const offsets = frame.offsets ?? {};
    const activeIds = frame.activeIds ?? [];
    const focusId = frame.focusId;

    const activeEls = getExistingBarElements(activeIds);
    const container = barsContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut', overwrite: 'auto' },
    });

    // ── Apply xFraction / yLevel offsets to every bar ──
    Object.keys(offsets).forEach((id) => {
      const el = barRefs.current[id];
      if (!el) return;
      const { xFraction, yLevel } = offsets[id];
      const targetX = xFraction * X_OFFSET_SCALE;
      const targetY = -yLevel * Y_LEVEL_PX;
      const isMid = id === focusId;

      tl.to(
        el,
        {
          x: targetX,
          y: targetY,
          duration: isMid ? 0.45 : 0.65,
          ease: isMid ? 'back.out(2)' : 'power3.inOut',
          overwrite: 'auto',
        },
        0
      );
    });

    // ── Restore active bars — fully visible ──
    if (activeEls.length > 0) {
      tl.to(
        activeEls,
        { opacity: 1, scale: 1, filter: 'grayscale(0%)', duration: 0.3 },
        0
      );
    }

    // ── Discarded bars fade out ──
    const discardedEls = getExistingBarElements([
      ...(frame.leftDiscardedIds ?? []),
      ...(frame.rightDiscardedIds ?? []),
    ]);
    if (discardedEls.length > 0) {
      tl.to(
        discardedEls,
        {
          opacity: 0.12,
          filter: 'grayscale(100%)',
          duration: 0.55,
          stagger: { amount: 0.1, from: 'edges' },
        },
        0
      );
    }

    // ── Re-centre active range after offsets settle ──
    tl.add(() => {
      if (activeEls.length === 0) return;
      const firstRect = activeEls[0].getBoundingClientRect();
      const lastRect = activeEls[activeEls.length - 1].getBoundingClientRect();
      const rangeCenterX = (firstRect.left + lastRect.right) / 2;
      const containerCenterX = containerRect.left + containerWidth / 2;
      const shiftX = containerCenterX - rangeCenterX;
      if (Math.abs(shiftX) < 4) return; // skip tiny corrections

      gsap.to(activeEls, {
        x: (_, el) => (gsap.getProperty(el, 'x') as number) + shiftX,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
        stagger: { amount: 0.07, from: 'center' },
      });
    }, '+=0.2');

    // ── Dotted bracket line spans the active range ──
    if (activeLineRef.current && activeEls.length > 0) {
      requestAnimationFrame(() => {
        if (!activeLineRef.current) return;

        const first = activeEls[0].getBoundingClientRect();
        const last = activeEls[activeEls.length - 1].getBoundingClientRect();
        const startX = first.left - containerRect.left;
        const endX = last.right - containerRect.left;
        const yPos = first.top - containerRect.top - 16;

        const path = activeLineRef.current;
        gsap.killTweensOf(path);
        gsap.set(path, {
          attr: { d: `M${startX},${yPos} L${endX},${yPos}` },
          strokeDasharray: '6 4',
          stroke: 'var(--brand)',
          strokeWidth: 2,
          fill: 'none',
          opacity: 1,
        });
        gsap.fromTo(
          path,
          { drawSVG: '0%', opacity: 1 },
          {
            drawSVG: '100%',
            duration: 0.55,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(path, {
                opacity: 0,
                duration: 0.45,
                delay: 1.1,
                ease: 'power1.in',
              });
            },
          }
        );
      });
    }
  });

  const resetBarTweens = contextSafe(() => {
    const barElements = getExistingBarElements(bars.map((bar) => bar.id));
    if (barElements.length === 0) return;
    gsap.killTweensOf(barElements);
    gsap.set(barElements, { clearProps: 'x,y,scale,opacity,filter,boxShadow' });
    clearActiveLine();
  });

  const updateMode = (nextMode: string) => {
    const normalizedMode: SearchMode =
      nextMode === 'binary' ? 'binary' : 'linear';
    setMode(normalizedMode);
    setSearchParams({ mode: normalizedMode }, { replace: true });
    setPhaseLabel('');
  };

  const finishTimeline = () => {
    setIsPlaying(false);
  };

  const runSearch = (target: number) => {
    const timeline = timelineRef.current;
    resetAnimation();
    timeline.clear().pause(0);
    resetBarTweens();
    setPhaseLabel('');

    const result = searchAlgorithms[mode](bars, target);
    const labels: string[] = [];

    setBars(result.initialBars);

    result.frames.forEach((frame, index) => {
      const label = `step-${index}`;
      labels.push(label);
      timeline.addLabel(label);

      timeline.call(
        () => {
          setBarStates(frame.states);
          // Update phase label for all modes
          if (frame.phaseLabel !== undefined) {
            setPhaseLabel(frame.phaseLabel);
          }
          if (mode === 'binary') {
            requestAnimationFrame(() => {
              animateBinaryFrame(frame);
            });
          }
        },
        undefined,
        label
      );

      timeline.to({}, { duration: frame.duration }, label);
    });

    timeline.eventCallback('onComplete', () => {
      finishTimeline();
      clearActiveLine();
      if (mode !== 'binary') {
        resetBarTweens();
        setPhaseLabel('');
      }
      if (!result.found) {
        toast.error('Value not found', {
          position: 'bottom-right',
          closeButton: true,
        });
      }
    });
    timeline.eventCallback('onInterrupt', finishTimeline);

    labelsRef.current = labels;

    if (labels.length === 0) {
      finishTimeline();
      return;
    }

    requestAnimationFrame(() => {
      timeline.play(0);
      setIsPlaying(true);
    });
  };

  const handleSearch = () => {
    const target = Number.parseInt(searchValue.trim(), 10);
    if (Number.isNaN(target) || target > 50 || target < -50) {
      toast.error('Enter a valid target between -50 and 50', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }

    if (bars.length === 0) {
      toast.error('No bars available. Generate or insert values first.', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }

    runSearch(target);
  };

  return (
    <AlgoBookShell
      algoInfo={SEARCH_ALGO_INFO[mode] ?? null}
      helper={{ text: phaseLabel, defaultVisible: true }}
    >
      <SharedLayout
        inputValue={inputValue}
        setInputValue={setInputValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleInsert={handleInsert}
        isPlaying={isPlaying}
        handleSearch={handleSearch}
        actionLabel="Search"
        generateRandomArray={generateRandomArray}
        handleClear={() => {
          setBars([]);
          resetAnimation();
          resetBarTweens();
          setPhaseLabel('');
        }}
        algoMap={algoMap.map((algo) => ({
          name: algo.name,
          value: algo.value,
        }))}
        onPlay={playSteps}
        onPause={pauseSteps}
        onNext={nextStep}
        onPrev={prevStep}
        selectedAlgorithm={mode}
        onAlgorithmChange={updateMode}
        speed={speed}
        onSpeedChange={setPlaybackSpeed}
        onSpeedIncrease={increaseSpeed}
        onSpeedDecrease={decreaseSpeed}
        legend={mode === 'binary' ? SEARCH_BINARY_LEGEND : SEARCH_LINEAR_LEGEND}
      >
        <div
          className="w-full flex-1 flex flex-col justify-center items-center max-w-[1600px] px-6 md:px-12 py-4 overflow-visible"
          style={{ minHeight: 'clamp(220px, 50vh, 560px)' }}
        >
          {/* Phase label */}
          <div
            className="mb-2 text-sm font-mono tracking-wide transition-all duration-500 min-h-[1.5rem] text-center"
            style={{ color: 'var(--brand)', opacity: phaseLabel ? 1 : 0 }}
          >
            {phaseLabel}
          </div>

          <div
            ref={barsContainerRef}
            className="relative flex gap-2 justify-center items-end p-4 w-full bar-container overflow-visible"
            style={{ minHeight: 'clamp(160px, 36vh, 340px)' }}
          >
            {bars.map((bar) => (
              <div
                id={`bar-${bar.id}`}
                ref={(node) => {
                  barRefs.current[bar.id] = node;
                }}
                key={bar.id}
                data-flip-id={bar.id}
                className={`bar w-5 sm:w-7 md:w-10 rounded-sm flex items-center justify-center font-mono text-[8px] sm:text-xs md:text-sm transition-colors duration-300 ${getBarColor(bar.id)}`}
                style={{
                  height: `${Math.max(Math.abs(Number(bar.value)) * 4, 30)}px`,
                }}
              >
                {bar.value}
              </div>
            ))}
            {/* SVG overlay for dotted bracket line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path ref={activeLineRef} />
            </svg>
          </div>
        </div>
      </SharedLayout>
    </AlgoBookShell>
  );
};

export default SearchPage;
