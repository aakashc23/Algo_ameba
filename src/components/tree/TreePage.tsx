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
import AlgoBookShell from '@/components/AlgoBookShell';
import { TREE_ALGO_INFO } from '@/constants/algoInfo';
import ColorLegend, { TREE_GRAPH_LEGEND } from '../ColorLegend';
import ControllerFooter from '@/components/ControllerFooter';

interface TreeNode {
  id: string;
  val: number;
  right: TreeNode | null;
  left: TreeNode | null;
}

export interface RenderNode {
  id: string;
  val: number;
  x: number;
  y: number;
}

export interface RenderEdge {
  id: string;
  d: string;
}

// ─── PURE ALGORITHM FUNCTIONS ─────────────────────────────────────────────────

function insertBST(node: TreeNode | null | undefined, val: number): TreeNode {
  if (!node) {
    return { id: crypto.randomUUID(), val, left: null, right: null };
  }
  if (val < node.val) {
    return { ...node, left: insertBST(node.left, val) };
  }
  if (val > node.val) {
    return { ...node, right: insertBST(node.right, val) };
  }
  return node;
}

function deleteBST(
  node: TreeNode | null,
  val: number
): { tree: TreeNode | null; successorId: string | null } {
  function _delete(
    node: TreeNode | null,
    val: number,
    successorId: { current: string | null }
  ): TreeNode | null {
    if (!node) return null;
    if (val < node.val) {
      return { ...node, left: _delete(node.left, val, successorId) };
    }
    if (val > node.val) {
      return { ...node, right: _delete(node.right, val, successorId) };
    }
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let successor = node.right;
    while (successor.left) {
      successor = successor.left;
    }
    successorId.current = successor.id;

    return {
      ...node,
      val: successor.val,
      id: successor.id,
      right: _delete(node.right, successor.val, successorId),
    };
  }

  const successorId = { current: null as string | null };
  const tree = _delete(node, val, successorId);
  return { tree, successorId: successorId.current };
}

function searchBST(node: TreeNode | null, val: number): string | null {
  if (!node) return null;
  if (val === node.val) return node.id;
  return val < node.val
    ? searchBST(node.left, val)
    : searchBST(node.right, val);
}

function inOrderTraversal(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  inOrderTraversal(node.left, result);
  result.push(node.val);
  inOrderTraversal(node.right, result);
  return result;
}

function preOrderTraversal(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  result.push(node.val);
  preOrderTraversal(node.left, result);
  preOrderTraversal(node.right, result);
  return result;
}

function postOrderTraversal(
  node: TreeNode | null,
  result: number[] = []
): number[] {
  if (!node) return result;
  postOrderTraversal(node.left, result);
  postOrderTraversal(node.right, result);
  result.push(node.val);
  return result;
}

function levelOrderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  if (!root) return result;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// ─── REACT COMPONENT ──────────────────────────────────────────────────────────

const TreePage = () => {
  const [algo, setAlgo] = useState('Binary Search Tree');
  const [traversal, setTraversal] = useState('Preorder');
  const [inputValue, setInputValue] = useState('');
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  const [phaseLabel, setPhaseLabel] = useState(' ');

  // ── Playback state ──────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.75);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const labelsRef = useRef<string[]>([]);
  const isClearedRef = useRef(false); // true when user explicitly cleared — skip auto-regen

  // Two refs needed: one for the canvas, one for the moveable group
  const containerRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);

  const traversalOptions: Record<string, (node: TreeNode | null) => number[]> =
    {
      Preorder: preOrderTraversal,
      Inorder: inOrderTraversal,
      Postorder: postOrderTraversal,
      LevelOrder: levelOrderTraversal,
    };

  const algorithms: Record<string, string[]> = {
    'Binary Tree': ['Preorder', 'Inorder', 'Postorder'],
    'Binary Search Tree': ['Preorder', 'Inorder', 'Postorder'],
    'AVL Tree': ['Preorder', 'Inorder', 'Postorder'],
    'Red-Black Tree': ['Preorder', 'Inorder', 'Postorder'],
    'Segment Tree': ['Preorder', 'Inorder', 'Postorder'],
    'Fenwick Tree': ['Preorder', 'Inorder', 'Postorder'],
  };

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

  // ─── D3 LAYOUT ENGINE ─────────────────────────────────────────────────────

  const { nodes, edges } = useMemo(() => {
    if (!treeRoot) {
      return { nodes: [] as RenderNode[], edges: [] as RenderEdge[] };
    }

    const hierarchyRoot = d3.hierarchy(treeRoot, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : null;
    });

    const treeLayout = d3.tree<TreeNode>().nodeSize([80, 100]);
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
      id: `edge-${link.source.data.id}-${link.target.data.id}`,
      d: pathGenerator(link) as string,
    }));

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [treeRoot]);

  // ─── D3 PAN & ZOOM INTEGRATION ────────────────────────────────────────────

  useEffect(() => {
    if (!containerRef.current || !zoomGroupRef.current) return;

    const svg = d3.select(containerRef.current);
    const zoomGroup = d3.select(zoomGroupRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    const containerWidth =
      containerRef.current.clientWidth || window.innerWidth;
    const initialTransform = d3.zoomIdentity
      .translate(containerWidth / 2, 80)
      .scale(1);
    svg.call(zoom.transform, initialTransform);
  }, []); // Run once on mount

  // ─── EFFECTS & GSAP ───────────────────────────────────────────────────────

  useEffect(() => {
    if (treeRoot == null) {
      if (isClearedRef.current) {
        isClearedRef.current = false;
        return; // user cleared intentionally — show empty canvas
      }
      onRandom();
    }
  }, [treeRoot]);

  const { contextSafe } = useGSAP(
    () => {
      if (edges.length === 0) return;

      gsap.fromTo(
        '.edge',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power1.out' }
      );

      gsap.fromTo(
        '.node circle',
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.7)' }
      );
    },
    { scope: containerRef, dependencies: [edges] }
  );

  // Soft fade when traversal type switches
  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0.4, scale: 0.985 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          transformOrigin: 'center center',
        }
      );
    },
    { scope: containerRef, dependencies: [traversal], revertOnUpdate: true }
  );

  const MAX_TREE_SIZE = 40;

  const onInsert = (val: string) => {
    const vals = val
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v) && v.toString() !== '');
    if (vals.length === 0) {
      toast('Please enter a valid number', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }
    const countNodes = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + countNodes(node.left) + countNodes(node.right);
    };
    if (countNodes(treeRoot) + vals.length > MAX_TREE_SIZE) {
      toast(`Tree is full! (max ${MAX_TREE_SIZE} nodes)`, {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }
    setTreeRoot((prev) => {
      let curr = prev;
      vals.forEach((num) => {
        curr = insertBST(curr, num);
      });
      return curr;
    });
    setInputValue('');
  };

  const onRandom = () => {
    let newTree: TreeNode | null = null;
    const randomValues = new Set<number>();
    while (randomValues.size < 7) {
      randomValues.add(Math.floor(Math.random() * 100));
    }
    randomValues.forEach((val) => {
      newTree = insertBST(newTree, val);
    });
    setTreeRoot(newTree);
    // Reset controls
    timelineRef.current?.clear().pause(0);
    labelsRef.current = [];
    setIsPlaying(false);
    setPhaseLabel(' ');
  };

  const onDelete = contextSafe((val: string) => {
    if (val.trim() === '') return;

    const result = deleteBST(treeRoot, Number(val));
    setTreeRoot(result.tree);

    if (result.successorId) {
      gsap.to(`#node-${result.successorId}`, {
        fill: '#e53e3e',
        stroke: '#9b2c2c',
        strokeWidth: 4,
        duration: 1.5,
        ease: 'power1.inOut',
      });
    }

    setInputValue('');
  });

  // ── Build and store the traversal timeline into timelineRef ─────────────────
  const onRun = contextSafe(() => {
    const traversalFn = traversalOptions[traversal];
    if (!treeRoot || !traversalFn) return;

    const tl = timelineRef.current;
    if (!tl) return;

    tl.clear().pause(0);
    labelsRef.current = [];

    const addLabel = (key: string) => {
      tl.addLabel(key);
      labelsRef.current.push(key);
    };

    tl.eventCallback('onComplete', () => {
      setIsPlaying(false);
      setPhaseLabel(`${traversal} traversal complete!`);
    });

    // Reset all node colours first
    addLabel('step-reset');
    tl.call(
      () => {
        setPhaseLabel(`Starting ${traversal} traversal…`);
      },
      undefined,
      'step-reset'
    );
    tl.to(
      '.node circle',
      {
        fill: 'var(--node)',
        stroke: 'var(--node-stroke)',
        strokeWidth: 2,
        filter: 'none',
        r: 24,
        duration: 0.35,
      },
      'step-reset'
    );
    tl.to({}, { duration: 0.4 });

    const sequence = traversalFn(treeRoot);
    const pathStr = sequence.join(' → ');
    console.log(`🌳 ${traversal} Traversal: [${pathStr}]`);

    const nodeMap = new Map<number, string>();
    nodes.forEach((node) => nodeMap.set(node.val, node.id));

    sequence.forEach((val, i) => {
      const nodeId = nodeMap.get(val);
      if (!nodeId) return;

      const stepLabel = `step-visit-${i}`;
      addLabel(stepLabel);

      tl.call(
        () =>
          setPhaseLabel(
            `Visiting node ${val}  (step ${i + 1} / ${sequence.length})`
          ),
        undefined,
        stepLabel
      );

      // 1. Flash amber — "currently visiting"
      tl.to(
        `#node-${nodeId}`,
        {
          fill: '#fbbf24',
          stroke: '#f59e0b',
          strokeWidth: 3,
          scale: 1.15,
          filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
          duration: 0.4,
          ease: 'back.out(1.7)',
        },
        stepLabel
      );

      // 2. Pulse radius
      tl.to(
        `#node-${nodeId}`,
        { r: 30, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 },
        `${stepLabel}+=0.18`
      );

      // 3. Settle to "visited" green
      tl.to(
        `#node-${nodeId}`,
        {
          fill: '#10b981',
          stroke: '#16a34a',
          strokeWidth: 2,
          scale: 1,
          r: 24,
          filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))',
          duration: 0.35,
          ease: 'power1.inOut',
        },
        `${stepLabel}+=0.65`
      );

      // Breathing pause between nodes
      tl.to({}, { duration: 0.2 });
    });

    // Final cleanup — revert all to default
    addLabel('step-cleanup');
    tl.call(
      () => setPhaseLabel(`${traversal}: ${pathStr}`),
      undefined,
      'step-cleanup'
    );
    tl.to(
      '.node circle',
      {
        fill: 'var(--node)',
        stroke: 'var(--node-stroke)',
        strokeWidth: 2,
        filter: 'none',
        r: 24,
        duration: 0.5,
        ease: 'power1.out',
      },
      '>-0.4'
    );

    tl.timeScale(speed);
    tl.play(0);
    setIsPlaying(true);
  });

  const onSearch = contextSafe((val: string) => {
    if (val.trim() === '') return;
    setInputValue('');

    const id = searchBST(treeRoot, Number(val));
    if (id) {
      gsap.to(`#node-${id}`, {
        fill: '#22c55e',
        stroke: '#ffffff',
        strokeWidth: 4,
        duration: 1.3,
        yoyo: true,
        repeat: 3,
        ease: 'power1.inOut',
      });
    } else {
      toast('Value not found!', {
        position: 'bottom-right',
        closeButton: true,
      });
    }
  });

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
      algoInfo={TREE_ALGO_INFO[traversal.toLowerCase()] ?? null}
      helper={{ text: phaseLabel || ' ', defaultVisible: true }}
    >
      <div className="flex flex-col h-screen bg-background font-audiowide shell">
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="algo-toolbar">
          <div className="flex flex-wrap justify-between items-center gap-2 w-full">
            <div className="flex flex-wrap justify-start items-center gap-2 px-3 py-1 mx-2">
              <Input
                className="input w-fit px-2 max-w-[140px] py-1"
                placeholder="Enter Number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onInsert(inputValue)}
              />
              <div className="flex flex-wrap justify-center items-center gap-2 text-white">
                <button
                  className="btn-primary"
                  onClick={() => onInsert(inputValue)}
                >
                  Enter
                </button>
                <button
                  className="btn-danger"
                  onClick={() => onDelete(inputValue)}
                >
                  Delete
                </button>
                <button
                  className="btn-neutral"
                  onClick={() => onSearch(inputValue)}
                >
                  Search
                </button>
                <button className="btn-neutral bg-purple" onClick={onRandom}>
                  Generate Random
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    isClearedRef.current = true;
                    setTreeRoot(null);
                    timelineRef.current?.clear().pause(0);
                    labelsRef.current = [];
                    setIsPlaying(false);
                    setPhaseLabel(' ');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 px-3 py-1">
              <Select value={algo} onValueChange={setAlgo}>
                <SelectTrigger className="w-44 select-trigger">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectGroup>
                    <SelectLabel>Tree Algorithm</SelectLabel>
                    {Object.keys(algorithms).map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex flex-wrap justify-center items-center gap-2">
                <Select
                  value={traversal}
                  onValueChange={(val) => {
                    setTraversal(val);
                    // Reset timeline on traversal switch
                    timelineRef.current?.clear().pause(0);
                    labelsRef.current = [];
                    setIsPlaying(false);
                    setPhaseLabel(' ');
                    const fn = traversalOptions[val];
                    if (fn && treeRoot) {
                      console.log(`${val}:`, fn(treeRoot));
                    }
                  }}
                >
                  <SelectTrigger className="w-44 select-trigger">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectGroup>
                      <SelectLabel>Traversal</SelectLabel>
                      {Object.keys(traversalOptions).map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <button
                  className="btn-success flex h-fit w-fit px-4 py-2"
                  onClick={onRun}
                >
                  Run
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tree Canvas ───────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 relative w-full viz-canvas overflow-hidden bg-background">
          <svg
            ref={containerRef}
            className="tree canvas border-0 absolute inset-0 w-full h-full m-0 p-0 cursor-grab active:cursor-grabbing block"
          >
            <g ref={zoomGroupRef}>
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
                  key={node.id}
                  className="node"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  <circle
                    id={`node-${node.id}`}
                    r={24}
                    fill="var(--node)"
                    stroke="var(--node-stroke)"
                    strokeWidth="2"
                  />
                  <text
                    textAnchor="middle"
                    dy=".3em"
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

        {/* ── Footer: Color Legend + Controller ─────────────────────────────── */}
        <footer className="footer flex flex-col gap-0 w-full">
          <div className="w-full flex justify-center">
            <ColorLegend entries={TREE_GRAPH_LEGEND} className="px-4 py-1.5" />
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

export default TreePage;
