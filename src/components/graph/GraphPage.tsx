import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useGSAP } from '@gsap/react';
import gsap from '../../gsapSetup';
import { toast } from 'sonner';
import AlgoBookShell from '@/components/AlgoBookShell';
import { GRAPH_ALGO_INFO } from '@/constants/algoInfo';
import ColorLegend, { TREE_GRAPH_LEGEND } from '../ColorLegend';
import ControllerFooter from '@/components/ControllerFooter';
import algorithms from './graphConfig';
import {
  runBFS,
  runDFS,
  runDijstras,
  buildAdjList,
  runPrims,
  runKruskals,
} from './graphAlgorithms';

const EDGE_BASE_COLOR = '#64748b'; // slate-500: visible on light and dark backgrounds

// Resolve a CSS custom property value at call-time (respects current theme)
const getCSSVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

const GraphPage = () => {
  // --- 1. State Management ---
  const [algo, setAlgo] = useState('BFS');

  // Separate states for different inputs
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [numNodes, setNumNodes] = useState<string>('');
  const [pathFollowed, setPathFollowed] = useState<number[]>([]);
  // Graph property states
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(true);

  const [nextExploring, setNextExploring] = useState<number[]>([]);
  const [phaseLabel, setPhaseLabel] = useState(' ');

  // --- Playback state (mirrors SortPage) ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.75);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const labelsRef = useRef<string[]>([]);

  const graphRef = useRef<SVGSVGElement>(null);

  // Clamp speed within reasonable bounds
  const clampSpeed = (v: number) => Math.min(3, Math.max(0.25, v));

  // Sync speed → GSAP timeScale whenever speed changes
  useEffect(() => {
    timelineRef.current?.timeScale(speed);
  }, [speed]);

  // Initialise (and clean up) the master timeline once
  useGSAP(() => {
    timelineRef.current = gsap.timeline({ paused: true });
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  // Generate random graph
  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 5) + 3; // 3-7 nodes
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
    }));

    const links: { source: number; target: number; weight: number }[] = [];
    const edgeSet = new Set<string>();
    const maxEdges = Math.floor((nodeCount * (nodeCount - 1)) / 2);
    const edgeCount =
      Math.floor(Math.random() * (maxEdges - nodeCount + 1)) + nodeCount;

    for (let i = 0; i < edgeCount; i++) {
      const source = Math.floor(Math.random() * nodeCount) + 1;
      let target = Math.floor(Math.random() * nodeCount) + 1;
      while (target === source) {
        target = Math.floor(Math.random() * nodeCount) + 1;
      }
      const key = [Math.min(source, target), Math.max(source, target)].join(
        '-'
      );
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        links.push({
          source,
          target,
          weight: Math.floor(Math.random() * 10) + 1,
        });
      }
    }
    return { nodes, links };
  };

  const { contextSafe } = useGSAP({ scope: graphRef });

  // ── Reset timeline helpers ────────────────────────────────────────────────
  const resetTimeline = () => {
    timelineRef.current?.clear().pause(0);
    labelsRef.current = [];
    setIsPlaying(false);
    setPhaseLabel(' ');
    setNextExploring([]);
    setPathFollowed([]);
  };

  // ── Build and play a labelled GSAP timeline ────────────────────────────────
  const buildGraphTimeline = (
    animateNodes: number[],
    animateEdges: { source: number; target: number }[],
    exploringStates: number[][],
    pathStates: number[][],
    shortestPathNodes?: number[],
    shortestPathEdges?: { source: number; target: number }[]
  ) => {
    const tl = timelineRef.current;
    if (!tl) return;

    tl.clear().pause(0);
    labelsRef.current = [];

    tl.eventCallback('onComplete', () => {
      setIsPlaying(false);
      setPhaseLabel('Done!');
    });

    const addLabel = (key: string) => {
      tl.addLabel(key);
      labelsRef.current.push(key);
    };

    // --- Step 0: Reset colours ---
    addLabel('step-reset');
    tl.call(
      () => {
        setNextExploring([]);
        setPathFollowed([]);
        setPhaseLabel(`Initializing ${algo}…`);
      },
      undefined,
      'step-reset'
    );
    tl.to(
      'circle',
      { fill: getCSSVar('--node'), duration: 0.35 },
      'step-reset'
    );
    tl.to(
      'line',
      { stroke: EDGE_BASE_COLOR, strokeWidth: 2, duration: 0.35 },
      'step-reset'
    );
    // breathing room after reset
    tl.to({}, { duration: 0.5 });

    // --- Step 1: Highlight start node ---
    const startLabel = 'step-start';
    addLabel(startLabel);
    tl.call(
      () => {
        if (exploringStates[0]) setNextExploring(exploringStates[0]);
        if (pathStates[0]) setPathFollowed(pathStates[0]);
        setPhaseLabel(`Starting at node ${animateNodes[0]}`);
      },
      undefined,
      startLabel
    );
    tl.to(
      `#node-${animateNodes[0]}`,
      {
        fill: getCSSVar('--compare'),
        scale: 1.15,
        duration: 0.45,
        ease: 'back.out(1.7)',
      },
      startLabel
    );
    tl.to({}, { duration: 0.4 });

    // --- Steps: edge + node exploration ---
    for (let i = 0; i < animateEdges.length; i++) {
      const edge = animateEdges[i];
      const nextNode = animateNodes[i + 1];
      const stepLabel = `step-explore-${i}`;

      addLabel(stepLabel);

      tl.call(
        () => {
          if (exploringStates[i + 1]) setNextExploring(exploringStates[i + 1]);
          if (pathStates[i + 1]) setPathFollowed(pathStates[i + 1]);
          setPhaseLabel(`Exploring edge ${edge.source} → ${edge.target}`);
        },
        undefined,
        stepLabel
      );

      // Animate the traversed edge
      tl.to(
        `#edge-${edge.source}-${edge.target}, #edge-${edge.target}-${edge.source}`,
        {
          stroke: getCSSVar('--node-visited'),
          strokeWidth: 5,
          duration: 0.5,
          ease: 'power2.out',
        },
        stepLabel
      );

      // Animate the newly visited node  (slight stagger after edge)
      tl.to(
        `#node-${nextNode}`,
        {
          fill: getCSSVar('--node-visited'),
          scale: 1.12,
          duration: 0.45,
          ease: 'back.out(1.5)',
        },
        `${stepLabel}+=0.25`
      );

      // Settle scale back
      tl.to(`#node-${nextNode}`, {
        scale: 1,
        duration: 0.25,
        ease: 'power1.out',
      });

      // Brief pause so each step breathes
      tl.to({}, { duration: 0.25 });
    }

    // --- Optional: Dijkstra shortest-path highlight ---
    if (
      shortestPathEdges &&
      shortestPathEdges.length > 0 &&
      shortestPathNodes
    ) {
      tl.to({}, { duration: 0.6 }); // pause before path reveal

      const pathRevealLabel = 'step-shortest-path';
      addLabel(pathRevealLabel);
      tl.call(
        () => setPhaseLabel('Highlighting shortest path…'),
        undefined,
        pathRevealLabel
      );

      for (let i = 0; i < shortestPathEdges.length; i++) {
        const edge = shortestPathEdges[i];
        const nextNode = shortestPathNodes[i + 1];
        const spLabel = `step-sp-${i}`;
        addLabel(spLabel);

        tl.to(
          `#edge-${edge.source}-${edge.target}, #edge-${edge.target}-${edge.source}`,
          {
            stroke: getCSSVar('--node-active'),
            strokeWidth: 7,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          spLabel
        );

        if (nextNode !== undefined && nextNode !== animateNodes[0]) {
          tl.to(
            `#node-${nextNode}`,
            {
              fill: getCSSVar('--node-active'),
              scale: 1.18,
              duration: 0.4,
              ease: 'back.out(1.5)',
              onStart: () => setPhaseLabel(`Shortest path: node ${nextNode}`),
            },
            `${spLabel}+=0.15`
          );
          tl.to(`#node-${nextNode}`, {
            scale: 1,
            duration: 0.25,
            ease: 'power1.out',
          });
        }

        tl.to({}, { duration: 0.2 });
      }
    }

    tl.timeScale(speed);
    tl.play(0);
    setIsPlaying(true);
  };

  const onRun = contextSafe(() => {
    // Build the set of node IDs that actually exist in the current graph
    const validNodeIds = new Set(graphData.nodes.map((n) => n.id));
    const existingNodesList = graphData.nodes.map((n) => n.id).join(', ');

    const adjList = buildAdjList(graphData.nodes, graphData.links, isDirected);

    if (currentConfig.startNode) {
      const startNum = parseInt(startNode);
      if (isNaN(startNum)) {
        toast.error('Please enter a valid start node', {
          position: 'bottom-right',
          closeButton: true,
        });
        return;
      }
      if (!validNodeIds.has(startNum)) {
        toast.error(
          `Node ${startNum} doesn't exist. Current nodes: ${existingNodesList}`,
          { position: 'bottom-right', closeButton: true }
        );
        return;
      }
    }

    const startNum = parseInt(startNode);

    // Validate end node if one was provided
    let endNum: number | undefined = undefined;
    if (endNode.trim() !== '') {
      const parsedEnd = parseInt(endNode);
      if (isNaN(parsedEnd)) {
        toast.error('Please enter a valid end node', {
          position: 'bottom-right',
          closeButton: true,
        });
        return;
      }
      if (!validNodeIds.has(parsedEnd)) {
        toast.error(
          `Node ${parsedEnd} doesn't exist. Current nodes: ${existingNodesList}`,
          { position: 'bottom-right', closeButton: true }
        );
        return;
      }
      endNum = parsedEnd;
    }

    if (algo === 'BFS') {
      const { animateNodes, animateEdges, exploringStates, pathStates } =
        runBFS(adjList, startNum, endNum);
      buildGraphTimeline(
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates
      );
    } else if (algo === 'DFS') {
      const { animateNodes, animateEdges, exploringStates, pathStates } =
        runDFS(adjList, startNum, endNum);
      buildGraphTimeline(
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates
      );
    } else if (algo === "Prim's Algorithm") {
      const data = runPrims(adjList, startNum);
      if (!data) return;
      const { animateNodes, animateEdges, exploringStates, pathStates } = data;
      buildGraphTimeline(
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates
      );
    } else if (algo === "Kruskal's Algorithm") {
      const { animateNodes, animateEdges, exploringStates, pathStates } =
        runKruskals(adjList);
      buildGraphTimeline(
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates
      );
    } else if (algo === "Dijkstra's Algorithm") {
      const {
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates,
        shortestPathNodes,
        shortestPathEdges,
      } = runDijstras(adjList, startNum, endNum) as any;
      buildGraphTimeline(
        animateNodes,
        animateEdges,
        exploringStates,
        pathStates,
        shortestPathNodes,
        shortestPathEdges
      );
    }
  });

  const [graphData, setGraphData] = useState(generateRandomGraph());

  // Keep D3 effects in sync with isDirected toggle
  useEffect(() => {
    if (!graphRef.current) return;

    const svg = d3.select(graphRef.current);
    const width = graphRef.current.clientWidth || 800;
    const height = graphRef.current.clientHeight || 600;

    svg.selectAll('*').remove();

    // Reset animation state whenever graph is redrawn
    resetTimeline();

    // Setup arrow markers for directed graphs
    if (isDirected) {
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', EDGE_BASE_COLOR)
        .style('stroke', 'none');
    }

    const nodes = graphData.nodes.map((d) => ({ ...d }));
    const links = graphData.links.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(140)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr(
        'id',
        (d: any) => `edge-${d.source.id ?? d.source}-${d.target.id ?? d.target}`
      )
      .attr('stroke', EDGE_BASE_COLOR)
      .attr('stroke-width', (d: any) => Math.sqrt(d.weight || 1) * 1.5)
      .attr('marker-end', isDirected ? 'url(#arrowhead)' : '');

    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag<SVGGElement, any>()
          .on('start', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event: any, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append('circle')
      .attr('id', (d: any) => `node-${d.id}`)
      .attr('r', 30)
      .attr('fill', getCSSVar('--node'))
      .attr('stroke', getCSSVar('--node-stroke'))
      .attr('stroke-width', 2);

    node
      .append('text')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', getCSSVar('--text'))
      .attr('font-size', '22px')
      .attr('font-family', 'monospace');

    const edgeLabels = svg
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .text((d: any) => (isWeighted ? d.weight : ''))
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', getCSSVar('--foreground'));

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      edgeLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 5);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, isDirected, isWeighted]);

  const onRandom = () => {
    const parsedInput = parseInt(numNodes);
    const MAX_GRAPH_NODES = 10;

    if (!isNaN(parsedInput) && parsedInput > MAX_GRAPH_NODES) {
      toast.error(
        `Max ${MAX_GRAPH_NODES} nodes for Graph. Using ${MAX_GRAPH_NODES} instead.`,
        { position: 'bottom-right', closeButton: true }
      );
      setGraphData(generateRandomGraph());
      return;
    }

    const nodeCount =
      !isNaN(parsedInput) && parsedInput > 1
        ? parsedInput
        : Math.floor(Math.random() * 5) + 3;

    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i + 1,
      label: `${i + 1}`,
    }));

    const newLinks: Array<{ source: number; target: number; weight: number }> =
      [];

    for (let i = 1; i < nodeCount; i++) {
      const targetNode = Math.floor(Math.random() * i);
      newLinks.push({
        source: i + 1,
        target: targetNode + 1,
        weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1,
      });
    }

    const extraEdges = Math.floor(Math.random() * nodeCount);
    for (let i = 0; i < extraEdges; i++) {
      const source = Math.floor(Math.random() * nodeCount) + 1;
      let target = Math.floor(Math.random() * nodeCount) + 1;

      while (target === source) {
        target = Math.floor(Math.random() * nodeCount) + 1;
      }

      const edgeExists = newLinks.some(
        (l) =>
          (l.source === source && l.target === target) ||
          (!isDirected && l.source === target && l.target === source)
      );

      if (!edgeExists) {
        newLinks.push({
          source,
          target,
          weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1,
        });
      }
    }

    setGraphData({ nodes: newNodes, links: newLinks });
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

  const currentConfig = algorithms[algo];

  return (
    <AlgoBookShell
      algoInfo={GRAPH_ALGO_INFO[algo] ?? null}
      helper={{
        text: phaseLabel || ' ',
        nextExploring,
        pathFollowed,
        algo,
        defaultVisible: false,
      }}
    >
      <div className="flex flex-col h-screen w-full shell">
        {/* ── Toolbar ────────────────────────────────────────────────────────── */}
        <div className="algo-toolbar w-full mt-0 sm:px-8">
          {/* Dynamic Inputs */}
          <div className="left-section flex flex-wrap justify-start items-center gap-2">
            {currentConfig.startNode && (
              <input
                className="input w-[120px]"
                placeholder="Start Node"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
              />
            )}

            {currentConfig.endNode && (
              <input
                className="input w-[120px]"
                placeholder="End Node"
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
              />
            )}

            {(currentConfig.startNode || currentConfig.endNode) && (
              <button className="btn-primary">Enter</button>
            )}

            <div className="flex flex-wrap gap-1 ml-1">
              <input
                className="input max-w-[140px]"
                placeholder="No. of Nodes"
                value={numNodes}
                onChange={(e) => setNumNodes(e.target.value)}
              />
              <button onClick={onRandom} className="btn-neutral">
                Generate Random
              </button>
            </div>

            {/* Dynamic Property Toggles */}
            <div className="flex flex-wrap gap-2 ml-2">
              {currentConfig.allowedNodeTypes.includes('directed') && (
                <button
                  className="btn-toggle"
                  data-active={isDirected ? 'true' : undefined}
                  onClick={() => setIsDirected(true)}
                >
                  Directed
                </button>
              )}
              {currentConfig.allowedNodeTypes.includes('undirected') && (
                <button
                  className="btn-toggle"
                  data-active={!isDirected ? 'true' : undefined}
                  onClick={() => setIsDirected(false)}
                >
                  Undirected
                </button>
              )}
              {currentConfig.weighted && (
                <button
                  className="btn-toggle"
                  data-active={isWeighted ? 'true' : undefined}
                  onClick={() => setIsWeighted(!isWeighted)}
                >
                  {isWeighted ? 'Weighted' : 'Unweighted'}
                </button>
              )}
            </div>
          </div>

          {/* Algorithm Selector + Run */}
          <div className="right-section flex justify-center items-center gap-4">
            <Select
              value={algo}
              onValueChange={(v) => {
                setAlgo(v);
                resetTimeline();
              }}
            >
              <SelectTrigger className="w-56 select-trigger">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectGroup>
                  <SelectLabel>Graph Algorithm</SelectLabel>
                  {Object.keys(algorithms).map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <button className="btn-success" onClick={onRun}>
              Run
            </button>
          </div>
        </div>

        {/* ── Graph Canvas ──────────────────────────────────────────────────── */}
        <div className="flex-grow w-full flex justify-center items-center overflow-hidden">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full relative">
            <svg ref={graphRef} className="w-full h-full min-h-[600px]"></svg>
          </div>
        </div>

        {/* ── Footer: Color Legend + Controller ─────────────────────────────── */}
        <footer
          className="footer flex flex-col gap-0 w-full"
          style={{ position: 'relative', zIndex: 20 }}
        >
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

export default GraphPage;
