// --- 2. Configuration Object ---

export interface GraphAlgo {
  name: string;
  startNode: boolean;
  endNode: boolean;
  negAllowed: boolean;
  weighted: boolean;
  allowedNodeTypes: ('directed' | 'undirected')[];
}

export interface AdjEdge {
  target: number;
  weight: number;
}

const algorithms: Record<string, GraphAlgo> = {
  "Dijkstra's Algorithm": {
    name: "Dijkstra's Algorithm",
    startNode: true,
    endNode: true,
    negAllowed: false,
    weighted: true,
    allowedNodeTypes: ['directed', 'undirected'],
  },
  "Kruskal's Algorithm": {
    name: "Kruskal's Algorithm",
    startNode: false, // MST doesn't usually need a start node
    endNode: false,
    negAllowed: false,
    weighted: true,
    allowedNodeTypes: ['undirected'],
  },
  "Prim's Algorithm": {
    name: "Prim's Algorithm",
    startNode: true,
    endNode: false,
    negAllowed: false,
    weighted: true,
    allowedNodeTypes: ['undirected'],
  },
  'Bellman-Ford Algorithm': {
    name: 'Bellman-Ford Algorithm',
    startNode: true,
    endNode: true,
    negAllowed: true,
    weighted: true,
    allowedNodeTypes: ['directed'],
  },
  'Floyd-Warshall Algorithm': {
    name: 'Floyd-Warshall Algorithm',
    startNode: true,
    endNode: true,
    negAllowed: true,
    weighted: true,
    allowedNodeTypes: ['directed'],
  },
  'Topological Sort': {
    name: 'Topological Sort',
    startNode: true,
    endNode: true,
    negAllowed: false,
    // Edge weights are not used by the algorithm but the toggle lets users
    // show/hide weight labels on the canvas for clarity.
    weighted: true,
    allowedNodeTypes: ['directed'],
  },
  "Tarjan's Algorithm": {
    name: "Tarjan's Algorithm",
    startNode: true,
    endNode: true,
    negAllowed: false,
    weighted: true,
    allowedNodeTypes: ['directed'],
  },
  BFS: {
    name: 'BFS',
    startNode: true,
    endNode: true,
    negAllowed: false,
    // BFS does not use weights, but show the toggle so the user can
    // hide/show edge weight labels on the canvas (same as Dijkstra's).
    weighted: true,
    allowedNodeTypes: ['directed', 'undirected'],
  },
  DFS: {
    name: 'DFS',
    startNode: true,
    endNode: true,
    negAllowed: false,
    weighted: true,
    allowedNodeTypes: ['directed', 'undirected'],
  },
};

export default algorithms;
