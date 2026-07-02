import { type AdjEdge } from './graphConfig';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { UnionFind } from '@easy-data-structure-js/union-find';

function buildAdjList(nodes: any[], links: any[], isDirected: boolean) {
  const adj = new Map<number, AdjEdge[]>();

  nodes.forEach((node) => adj.set(node.id, []));

  links.forEach((link) => {
    const src = link.source.id ?? link.source;
    const dst = link.target.id ?? link.target;
    const wt = link.weight || 1;

    adj.get(src)?.push({ target: dst, weight: wt });

    if (!isDirected) {
      adj.get(dst)?.push({ target: src, weight: wt });
    }
  });

  return adj;
}

function runBFS(
  adj: Map<number, AdjEdge[]>,
  startId: number,
  targetId?: number
) {
  const animateNodes: number[] = [];
  const animateEdges: { source: number; target: number }[] = [];
  const exploringStates: number[][] = [];
  const pathStates: number[][] = [];
  const visited = new Set<number>();

  const queue: number[] = [startId];
  const path: number[] = [startId];

  animateNodes.push(startId);
  visited.add(startId);
  exploringStates.push([...queue]);
  pathStates.push([...path]);

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node == targetId) {
      break;
    }

    const nei = adj.get(node) || [];
    for (const edge of nei) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
        path.push(edge.target);

        animateEdges.push({ source: node, target: edge.target });
        animateNodes.push(edge.target);
        exploringStates.push([...queue]);
        pathStates.push([...path]);
      }
    }
  }

  return { animateNodes, animateEdges, exploringStates, pathStates };
}

function runDFS(
  adj: Map<number, AdjEdge[]>,
  startId: number,
  targetId?: number
) {
  const animateNodes: number[] = [];
  const animateEdges: { source: number; target: number }[] = [];
  const exploringStates: number[][] = [];
  const pathStates: number[][] = [];
  const visited = new Set<number>();

  const stack: { child: number; parent: number | null }[] = [
    { child: startId, parent: null },
  ];
  const path: number[] = [];

  while (stack.length > 0) {
    const { child, parent } = stack.pop()!;

    if (!visited.has(child)) {
      visited.add(child);
      path.push(child);

      // Record for GSAP
      animateNodes.push(child);
      if (parent !== null) {
        animateEdges.push({ source: parent, target: child });
      }

      if (child === targetId) {
        exploringStates.push(stack.map((s) => s.child));
        pathStates.push([...path]);
        break;
      }

      const nei = adj.get(child) || [];
      // Loop backwards to traverse left-to-right visually
      for (let i = nei.length - 1; i >= 0; i--) {
        const edge = nei[i];
        if (!visited.has(edge.target)) {
          stack.push({ child: edge.target, parent: child });
        }
      }
      exploringStates.push(stack.map((s) => s.child));
      pathStates.push([...path]);
    }
  }

  return { animateNodes, animateEdges, exploringStates, pathStates };
}

// ... other imports

function runPrims(adj: Map<number, AdjEdge[]>, startNum: number) {
  const animateNodes: number[] = [];
  const animateEdges: { source: number; target: number }[] = [];
  const exploringStates: number[][] = [];
  const pathStates: number[][] = [];

  const edges = new MinPriorityQueue<{
    curr: number;
    parent: number | null;
    weight: number;
  }>((item) => item.weight);
  const visited = new Set<number>();
  animateNodes.push(startNum);
  const mst: { curr: number; parent: number; weight: number }[] = [];
  const path: number[] = [startNum];

  visited.add(startNum);
  for (const edge of adj.get(startNum) || []) {
    edges.enqueue({ curr: edge.target, parent: startNum, weight: edge.weight });
  }

  exploringStates.push(edges.toArray().map((e) => e.curr));
  pathStates.push([...path]);

  while (edges.size() > 0 && visited.size < adj.size) {
    let dequeued = edges.pop();
    if (!dequeued) return;

    const { curr, parent, weight } = dequeued;

    if (!visited.has(curr)) {
      visited.add(curr);
      animateNodes.push(curr);
      path.push(curr);

      if (parent) {
        mst.push({ curr: curr, parent: parent, weight: weight });
        animateEdges.push({ source: parent, target: curr });
      }

      for (const edge of adj.get(curr) || []) {
        if (!visited.has(edge.target)) {
          edges.enqueue({
            curr: edge.target,
            parent: curr,
            weight: edge.weight,
          });
        }
      }

      exploringStates.push(edges.toArray().map((e) => e.curr));
      pathStates.push([...path]);
    }
  }

  return { animateNodes, animateEdges, exploringStates, pathStates };
}

function runDijstras(
  adj: Map<number, AdjEdge[]>,
  startId: number,
  targetId?: number
) {
  const animateNodes: number[] = [];
  const animateEdges: { source: number; target: number }[] = [];
  const exploringStates: number[][] = [];
  const pathStates: number[][] = [];
  const path: number[] = [];

  const dist = new Map<number, number>();
  // NEW: Keep track of the best parent for the final path reconstruction
  const parentMap = new Map<number, number | null>();

  adj.forEach((_, key) => dist.set(key, Infinity));
  dist.set(startId, 0);
  parentMap.set(startId, null);

  const visited = new Set<number>();

  const pq = new MinPriorityQueue<{
    curr: number;
    cost: number;
    parent: number | null;
  }>((item) => item.cost);
  pq.enqueue({ curr: startId, cost: 0, parent: null });

  while (!pq.isEmpty()) {
    const dequeued = pq.dequeue();
    if (!dequeued) break;

    const { curr, cost, parent } = dequeued;

    if (visited.has(curr)) continue;

    visited.add(curr);
    path.push(curr);

    // Record exploration for GSAP
    animateNodes.push(curr);
    if (parent !== null) {
      animateEdges.push({ source: parent, target: curr });
    }

    if (curr === targetId) {
      exploringStates.push(pq.toArray().map((e) => e.curr));
      pathStates.push([...path]);
      break;
    }

    const nei = adj.get(curr) || [];
    for (const edge of nei) {
      if (!visited.has(edge.target)) {
        const newCost = cost + edge.weight;

        if (newCost < (dist.get(edge.target) || Infinity)) {
          dist.set(edge.target, newCost);
          parentMap.set(edge.target, curr); // Record the path!
          pq.enqueue({ curr: edge.target, cost: newCost, parent: curr });
        }
      }
    }

    exploringStates.push(pq.toArray().map((e) => e.curr));
    pathStates.push([...path]);
  }

  // NEW: Reconstruct the Shortest Path!
  const shortestPathNodes: number[] = [];
  const shortestPathEdges: { source: number; target: number }[] = [];

  // If a target was provided and we successfully reached it
  if (targetId !== undefined && visited.has(targetId)) {
    let current: number | null | undefined = targetId;

    while (current !== null && current !== undefined) {
      shortestPathNodes.push(current);
      const p = parentMap.get(current);
      if (p !== null && p !== undefined) {
        shortestPathEdges.push({ source: p, target: current });
      }
      current = p;
    }

    // Reverse them because we traced backwards from target to start
    shortestPathNodes.reverse();
    shortestPathEdges.reverse();
  }

  // Return the new path arrays to GSAP
  return {
    animateNodes,
    animateEdges,
    shortestPathNodes,
    shortestPathEdges,
    exploringStates,
    pathStates,
  };
}

function runKruskals(adj: Map<number, AdjEdge[]>) {
  // Use a Set to easily manage unique nodes getting animated
  const animatedNodesSet = new Set<number>();
  const animateEdges: { source: number; target: number }[] = [];
  const exploringStates: number[][] = [];
  const pathStates: number[][] = [];
  const uf = new UnionFind(adj.size);

  const edges: { source: number; target: number; weight: number }[] = [];

  adj.forEach((nei, id) => {
    for (const edge of nei) {
      if (id < edge.target) {
        edges.push({ source: id, target: edge.target, weight: edge.weight });
      }
    }
  });

  edges.sort((a, b) => a.weight - b.weight);

  for (const edge of edges) {
    const { source, target } = edge;

    if (uf.union(source, target)) {
      animateEdges.push({ source, target });

      animatedNodesSet.add(source);
      animatedNodesSet.add(target);

      exploringStates.push([]); // Kruskal's doesn't have a traditional queue
      pathStates.push(Array.from(animatedNodesSet));

      if (animateEdges.length === adj.size - 1) {
        break;
      }
    }
  }

  // Convert the Set back to an array for your GSAP timeline
  return {
    animateNodes: Array.from(animatedNodesSet),
    animateEdges,
    exploringStates,
    pathStates,
  };
}

export { buildAdjList, runBFS, runDFS, runDijstras, runKruskals, runPrims };
