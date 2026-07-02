import { Select } from '@radix-ui/react-select';
import { Input } from '../ui/input';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useGSAP } from '@gsap/react';
import gsap from '../../gsapSetup';
import { toast } from 'sonner';
import { pushToHeap, popFromHeap, buildTreeFromArray } from './heapAlgorithms';
import { type HeapNode, type RenderNode, type RenderEdge } from './heapTypes';
import AlgoBookShell from '@/components/AlgoBookShell';
import ColorLegend, { HEAP_LEGEND } from '../ColorLegend';
import ControllerFooter from '@/components/ControllerFooter';
import { HEAP_ALGO_INFO } from '@/constants/algoInfo';

const HeapPage = () => {
  const MAX_HEAP_SIZE = 15;
  const [algo, setAlgo] = useState('Min-Heap');
  const [inputValue, setInputValue] = useState('');
  const [activeOp, setActiveOp] = useState<'push' | 'pop'>('push');
  const [phaseLabel, setPhaseLabel] = useState(' ');

  const [heap, setHeap] = useState<number[]>([]);

  // ── Playback state ──────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.75);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const labelsRef = useRef<string[]>([]);

  const containerRef = useRef<SVGSVGElement>(null);

  const algorithms: string[] = ['Min-Heap', 'Max-Heap'];

  const heapRoot = useMemo(() => buildTreeFromArray(heap), [heap]);

  useEffect(() => {
    if (heap.length === 0) {
      onRandom();
    }
  }, [heap]);

  // Clamp speed
  const clampSpeed = (v: number) => Math.min(3, Math.max(0.25, v));

  // Sync speed → GSAP timeScale
  useEffect(() => {
    timelineRef.current?.timeScale(speed);
  }, [speed]);

  // Initialise (and clean up) the master timeline
  useGSAP(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!heapRoot)
      return { nodes: [] as RenderNode[], edges: [] as RenderEdge[] };

    const hierarchyRoot = d3.hierarchy(heapRoot, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : null;
    });

    const treeLayout = d3.tree<HeapNode>().nodeSize([80, 100]);
    treeLayout(hierarchyRoot);

    const pathGenerator = d3
      .linkVertical<any, any>()
      .x((d) => d.x)
      .y((d) => d.y);

    const calculatedNodes: RenderNode[] = hierarchyRoot
      .descendants()
      .map((d) => ({
        id: d.data.id,
        val: d.data.val,
        x: d.x ?? 0,
        y: d.y ?? 0,
      }));

    const calculatedEdges: RenderEdge[] = hierarchyRoot.links().map((link) => ({
      // Use HeapNode.index (the array position) NOT D3's own .index — the latter
      // can duplicate when D3 re-numbers nodes during layout.
      id: `h-${link.source.data.index}-${link.target.data.index}`,
      d: pathGenerator(link) as string,
    }));

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [heapRoot]);

  const pendingAnimationRef = useRef<{
    type: 'push' | 'pop';
    animateNodes: { childIdx: number; parentIdx: number }[];
    newIndex?: number;
  } | null>(null);

  // Stores the final (post-swap) heap to commit after push animation finishes
  const finalHeapRef = useRef<number[] | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (nodes.length === 0) return;

      const pending = pendingAnimationRef.current;
      if (pending && pending.type === 'push') {
        playPendingAnimation(pending);
      } else if (!pending) {
        gsap.fromTo(
          '.edge',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power1.out' }
        );

        gsap.fromTo(
          '.node circle',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }
        );
      }
    },
    { scope: containerRef, dependencies: [nodes, edges] }
  );

  // ── Build and register a labelled timeline into timelineRef ─────────────────
  const playPendingAnimation = (
    pending: typeof pendingAnimationRef.current,
    onComplete?: () => void
  ) => {
    if (!pending) {
      onComplete?.();
      return;
    }

    // Clear and rebuild the master timeline so controls work
    const tl = timelineRef.current;
    if (!tl) return;

    tl.clear().pause(0);
    labelsRef.current = [];

    const addLabel = (key: string) => {
      tl.addLabel(key);
      labelsRef.current.push(key);
    };

    tl.eventCallback('onComplete', () => {
      pendingAnimationRef.current = null;
      if (pending.type === 'push' && finalHeapRef.current) {
        setHeap(finalHeapRef.current);
        finalHeapRef.current = null;
      }
      setIsPlaying(false);
      setPhaseLabel(
        pending.type === 'push' ? 'Push complete.' : 'Pop complete.'
      );
      onComplete?.();
    });

    // Step 0 – reset colours
    addLabel('reset');
    tl.call(
      () =>
        setPhaseLabel(
          pending.type === 'push' ? 'Inserting into heap…' : 'Popping root…'
        ),
      undefined,
      'reset'
    );
    tl.to(
      '.node circle',
      {
        fill: 'var(--node)',
        stroke: 'var(--node-stroke)',
        filter: 'none',
        scale: 1,
        duration: 0.4,
      },
      'reset'
    );
    tl.to(
      '.edge',
      { stroke: 'var(--edge)', strokeWidth: 2, duration: 0.4 },
      'reset'
    );
    tl.to({}, { duration: 0.3 });

    if (
      pending.type === 'push' &&
      pending.animateNodes.length === 0 &&
      pending.newIndex !== undefined
    ) {
      // No swaps needed — just pulse the inserted node
      addLabel('inserted');
      tl.call(
        () => setPhaseLabel('Inserted at correct position (no swaps needed).'),
        undefined,
        'inserted'
      );
      tl.to(
        `#node-${pending.newIndex}`, // <-- node- prefix required; bare #10 is invalid CSS
        {
          fill: 'var(--node-visited)',
          scale: 1.15,
          duration: 0.45,
          yoyo: true,
          repeat: 1,
        },
        'inserted'
      );
      tl.to(`#node-${pending.newIndex}`, { scale: 1, duration: 0.25 });
    } else {
      pending.animateNodes.forEach(({ childIdx, parentIdx }, i) => {
        const swapLabel = `swap-${i}`;
        addLabel(swapLabel);

        tl.call(
          () => {
            const pVal = document.getElementById(
              `text-node-${parentIdx}`
            )?.textContent;
            const cVal = document.getElementById(
              `text-node-${childIdx}`
            )?.textContent;
            if (pVal && cVal) {
              setPhaseLabel(
                `Node ${cVal} is ${algo === 'Max-Heap' ? 'Greater' : 'Smaller'} than Node ${pVal} → Swap`
              );
            } else {
              setPhaseLabel('Swapping nodes…');
            }
          },
          undefined,
          swapLabel
        );

        // Highlight both nodes
        tl.to(
          [`#node-${childIdx}`, `#node-${parentIdx}`],
          {
            fill: '#f59e0b',
            scale: 1.18,
            duration: 0.6,
            ease: 'back.out(1.5)',
          },
          swapLabel
        );

        // Swap text at animation peak
        tl.call(
          () => {
            const parentText = document.getElementById(
              `text-node-${parentIdx}`
            );
            const childText = document.getElementById(`text-node-${childIdx}`);
            if (parentText && childText) {
              const temp = parentText.textContent;
              parentText.textContent = childText.textContent;
              childText.textContent = temp;
            }
          },
          undefined,
          `${swapLabel}+=0.3`
        );

        // Highlight connecting edge
        const minIdx = Math.min(parentIdx, childIdx);
        const maxIdx = Math.max(parentIdx, childIdx);
        tl.to(
          `#edge-h-${minIdx}-${maxIdx}`,
          { stroke: 'var(--node-visited)', strokeWidth: 4, duration: 0.35 },
          swapLabel
        );

        // Settle back
        tl.to(
          [`#node-${childIdx}`, `#node-${parentIdx}`],
          {
            fill: 'var(--node-visited)',
            scale: 1,
            duration: 0.35,
            ease: 'power1.out',
          },
          `${swapLabel}+=0.6`
        );

        tl.to({}, { duration: 0.25 });
      });
    }

    // Cleanup
    addLabel('cleanup');
    tl.to(
      '.edge',
      { stroke: 'var(--edge)', strokeWidth: 2, duration: 0.5 },
      'cleanup'
    );
    tl.to(
      '.node circle',
      {
        fill: 'var(--node)',
        stroke: 'var(--node-stroke)',
        strokeWidth: 2,
        filter: 'none',
        scale: 1,
        duration: 0.4,
        ease: 'power1.out',
      },
      'cleanup'
    );

    tl.timeScale(speed);
    tl.play(0);
    setIsPlaying(true);
  };

  const onInsert = contextSafe((val: string) => {
    setActiveOp('push');
    const values = val
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v) && val.trim() !== '');
    if (values.length === 0) {
      toast.error('Please enter valid numbers', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }
    if (heap.length + values.length > MAX_HEAP_SIZE) {
      toast.error(`Heap is full! (max ${MAX_HEAP_SIZE} nodes)`, {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }

    if (values.length === 1) {
      const num = values[0];
      const { newHeap, preSwapHeap, animateNodes } = pushToHeap(
        heap,
        num,
        algo === 'Max-Heap'
      );

      setPhaseLabel(`Pushing ${num} into heap…`);

      pendingAnimationRef.current = {
        type: 'push',
        animateNodes,
        newIndex: preSwapHeap.length - 1,
      };

      finalHeapRef.current = newHeap;

      gsap.delayedCall(0.1, () => {
        setHeap(preSwapHeap);
      });

      setInputValue('');
    } else {
      let currentHeap = [...heap];
      for (const num of values) {
        currentHeap = pushToHeap(currentHeap, num, algo === 'Max-Heap').newHeap;
      }
      setHeap(currentHeap);
      setInputValue('');
    }
  });

  const onDelete = contextSafe(() => {
    if (heap.length === 0) return;
    setActiveOp('pop');

    const rootValue = heap[0];
    const lastIdx = heap.length - 1;
    const { newHeap, animateNodes } = popFromHeap(heap, algo === 'Max-Heap');

    setPhaseLabel(`Popping root (${rootValue})…`);

    pendingAnimationRef.current = {
      type: 'pop',
      animateNodes,
    };

    // Root removal flash timeline (runs before the sift-down master timeline)
    const removeTl = gsap.timeline({
      onComplete: () => {
        const pending = pendingAnimationRef.current;
        playPendingAnimation(pending, () => {
          setHeap(newHeap);
        });
      },
    });

    if (heap.length === 1) {
      removeTl.to('#node-0', { scale: 0, opacity: 0, duration: 0.3 });
      return;
    }

    removeTl
      .to(
        '#node-0',
        {
          fill: '#ef4444',
          stroke: '#dc2626',
          strokeWidth: 4,
          filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.9))',
          scale: 1.15,
          duration: 0.5,
          ease: 'power2.out',
        },
        'start'
      )
      .to(
        `#node-${lastIdx}`,
        {
          fill: '#22c55e',
          stroke: '#16a34a',
          strokeWidth: 4,
          filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.9))',
          scale: 1.15,
          duration: 0.5,
          ease: 'power2.out',
        },
        'start'
      );

    removeTl
      .to(
        `#text-node-0`,
        { textContent: String(heap[lastIdx]), duration: 0 },
        '+=0.4'
      )
      .to(
        '#node-0',
        {
          fill: 'var(--node-visited)',
          stroke: 'var(--node-stroke)',
          filter: 'none',
          scale: 1.1,
          duration: 0.6,
        },
        '<'
      )
      .to(
        [`#node-${lastIdx}`, `#text-node-${lastIdx}`],
        { opacity: 0, duration: 0.6 },
        '<'
      );
  });

  const onRandom = () => {
    let currentHeap: number[] = [];
    const randomValues = new Set<number>();

    while (randomValues.size < 10) {
      randomValues.add(Math.floor(Math.random() * 100));
    }

    for (const val of randomValues) {
      currentHeap = pushToHeap(currentHeap, val, algo === 'Max-Heap').newHeap;
    }

    setHeap(currentHeap);
    // Clear controls state on new graph
    labelsRef.current = [];
    setIsPlaying(false);
    setPhaseLabel(' ');
  };

  // ── Playback controls ─────────────────────────────────────────────────────
  const playSteps = () => {
    timelineRef.current?.play();
    setIsPlaying(true);
  };

  const pauseSteps = () => {
    timelineRef.current?.pause();
    setIsPlaying(false);
  };

  const nextStep = () => {
    const tl = timelineRef.current;
    const labels = labelsRef.current;
    if (!tl || isPlaying || labels.length === 0) return;
    const ci = labels.indexOf(tl.currentLabel() ?? '');
    tl.seek(labels[Math.min(ci < 0 ? 0 : ci + 1, labels.length - 1)]);
  };

  const prevStep = () => {
    const tl = timelineRef.current;
    const labels = labelsRef.current;
    if (!tl || isPlaying || labels.length === 0) return;
    const ci = labels.indexOf(tl.currentLabel() ?? '');
    tl.seek(labels[Math.max(ci <= 0 ? 0 : ci - 1, 0)]);
  };

  return (
    <AlgoBookShell
      algoInfo={HEAP_ALGO_INFO[activeOp] ?? null}
      helper={{ text: phaseLabel || ' ', defaultVisible: true }}
    >
      <div className="flex flex-col h-screen bg-background font-audiowide shell">
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="sticky w-full backdrop-blur z-10 border-b border-border/40">
          <div className="flex flex-wrap items-center gap-2 px-4 py-2">
            {/* Left: Input + action buttons */}
            <Input
              className="input w-[160px]"
              placeholder="Enter number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onInsert(inputValue)}
            />

            <button
              className="btn-primary"
              onClick={() => onInsert(inputValue)}
            >
              Heappush
            </button>
            <button className="btn-danger" onClick={onDelete}>
              Heappop
            </button>
            <button
              className="btn-danger"
              onClick={() => {
                setHeap([]);
                labelsRef.current = [];
                setIsPlaying(false);
                setPhaseLabel(' ');
              }}
            >
              Clear
            </button>
            <button className="btn-neutral" onClick={onRandom}>
              Random
            </button>

            {/* Right: Algo select */}
            <div className="flex items-center gap-2 ml-auto">
              <Select
                value={algo}
                onValueChange={(v) => {
                  setAlgo(v);
                  onRandom();
                }}
              >
                <SelectTrigger className="w-40 select-trigger">
                  <SelectValue placeholder="Heap type" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectGroup>
                    <SelectLabel>Heap Algorithm</SelectLabel>
                    {algorithms.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Heap Canvas ───────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 flex-row justify-center items-start viz-canvas overflow-auto bg-background">
          <div className="flex flex-row tree-container justify-center items-start w-full min-h-full pt-5 relative">
            <svg
              ref={containerRef}
              className="tree canvas flex overflow-hidden justify-center items-start border-0 w-full h-full m-0 p-0 max-h-[800px]"
              width="100%"
              height="100%"
              viewBox="0 0 700 450"
              preserveAspectRatio="xMidYMin meet"
            >
              <g transform="translate(350, 60)">
                {edges.map((edge: RenderEdge) => (
                  <path
                    className="edge"
                    key={edge.id}
                    d={edge.d}
                    id={`edge-${edge.id}`}
                    stroke="var(--edge)"
                    strokeWidth="2"
                    fill="none"
                  />
                ))}

                {nodes.map((node: RenderNode) => (
                  <g
                    key={`grp-${node.id}`}
                    className="node"
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    <circle
                      id={node.id}
                      r={20}
                      fill="var(--node)"
                      stroke="var(--node-stroke)"
                      strokeWidth="2"
                    />
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      id={`text-${node.id}`}
                      fill="var(--text)"
                      fontSize="16px"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      {node.val}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* ── Footer: Color Legend + Controller ─────────────────────────────── */}
        <footer className="footer flex flex-col gap-0 w-full">
          <div className="w-full flex justify-center">
            <ColorLegend entries={HEAP_LEGEND} className="px-4 py-1.5" />
          </div>
          <ControllerFooter
            isPlaying={isPlaying}
            onPlay={playSteps}
            onPause={pauseSteps}
            onNext={nextStep}
            onPrev={prevStep}
            speed={speed}
            onSpeedChange={(v) => setSpeed(clampSpeed(v))}
            onSpeedIncrease={() => setSpeed((p) => clampSpeed(p + 0.25))}
            onSpeedDecrease={() => setSpeed((p) => clampSpeed(p - 0.25))}
          />
        </footer>
      </div>
    </AlgoBookShell>
  );
};

export default HeapPage;
