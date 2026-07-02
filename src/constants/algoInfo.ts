// ── Algorithm Info Registry ─────────────────────────────────────────────────
// Provides the sidebar with explanation text + per-language code snippets.
// Code implementations live in ./algo/* and are imported here.

import { linearSearchImpl } from './algo/linearSearch';
import { binarySearchImpl } from './algo/binarySearch';
import { bubbleSortImpl } from './algo/bubbleSort';
import { selectionSortImpl } from './algo/selectionSort';
import { insertionSortImpl } from './algo/insertionSort';
import { mergeSortImpl } from './algo/mergeSort';
import { quickSortImpl } from './algo/quickSort';
import { stackImpl } from './algo/stack';
import { queueImpl } from './algo/queue';
import { inorderImpl } from './algo/inorder';
import { preorderImpl } from './algo/preorder';
import { postorderImpl } from './algo/postorder';
import { bfsImpl } from './algo/bfs';
import { dfsImpl } from './algo/dfs';
import { dijstrasImpl } from './algo/dijstras';
import { primsImpl } from './algo/prims';
import { kruskalsImpl } from './algo/kruskals';
import { monotonicIncStackImpl } from './algo/montonic-inc-stack';
import { monotonicDecStackImpl } from './algo/monotonic-dec-stack';
import { heapPushImpl } from './algo/heapppush';
import { heapPopImpl } from './algo/heappop';

// ── Types ───────────────────────────────────────────────────────────────────

export interface AlgoImplementations {
  python: string;
  java: string;
  cpp: string;
  javascript: string;
  golang: string;
}

export interface AlgoInfo {
  name: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
  steps: string[];
  implementations: AlgoImplementations;
}

// ── Linear Search ───────────────────────────────────────────────────────────
export const LINEAR_SEARCH_INFO: AlgoInfo = {
  name: 'Linear Search',
  category: 'Search',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Linear search scans each element in the array one by one from left to right until the target value is found or the end is reached. It works on both sorted and unsorted arrays.',
  steps: [
    'Start at index 0.',
    'Compare the current element with the target.',
    'If they match, return the index — target found!',
    'Otherwise move to the next element.',
    'If the end is reached without a match, return -1 (not found).',
  ],
  implementations: linearSearchImpl,
};

// ── Binary Search ───────────────────────────────────────────────────────────
export const BINARY_SEARCH_INFO: AlgoInfo = {
  name: 'Binary Search',
  category: 'Search',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description:
    'Binary search works on a sorted array by repeatedly halving the search space. It compares the target with the middle element and discards the half where the target cannot exist.',
  steps: [
    'Set left = 0, right = n-1.',
    'Calculate mid = (left + right) / 2.',
    'If arr[mid] == target, return mid.',
    'If target < arr[mid], search the left half (right = mid - 1).',
    'If target > arr[mid], search the right half (left = mid + 1).',
    'Repeat until left > right (not found).',
  ],
  implementations: binarySearchImpl,
};

// ── Bubble Sort ─────────────────────────────────────────────────────────────
export const BUBBLE_SORT_INFO: AlgoInfo = {
  name: 'Bubble Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements "bubble up" to the end with each pass.',
  steps: [
    'Iterate over the array n-1 times.',
    'In each pass, compare each adjacent pair.',
    'Swap if the left element is greater than the right.',
    'After each pass, the largest unsorted element is placed correctly.',
    'Stop early if no swaps occur in a pass (optimised).',
  ],
  implementations: bubbleSortImpl,
};

// ── Selection Sort ──────────────────────────────────────────────────────────
export const SELECTION_SORT_INFO: AlgoInfo = {
  name: 'Selection Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Selection sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element in the unsorted region and moves it to the end of the sorted region.',
  steps: [
    'Start with i = 0 (the sorted boundary).',
    'Find the minimum element in arr[i..n-1].',
    'Swap it with arr[i].',
    'Advance i by 1.',
    'Repeat until i reaches n-1.',
  ],
  implementations: selectionSortImpl,
};

// ── Insertion Sort ──────────────────────────────────────────────────────────
export const INSERTION_SORT_INFO: AlgoInfo = {
  name: 'Insertion Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Insertion sort builds a sorted array one element at a time. It picks each element from the unsorted part and inserts it into its correct position in the sorted part.',
  steps: [
    'Start at index 1 (first element is trivially sorted).',
    'Pick arr[i] as the key.',
    'Shift all elements in the sorted region that are greater than key one position right.',
    'Insert key in the correct position.',
    'Repeat for all remaining elements.',
  ],
  implementations: insertionSortImpl,
};

// ── Merge Sort ──────────────────────────────────────────────────────────────
export const MERGE_SORT_INFO: AlgoInfo = {
  name: 'Merge Sort',
  category: 'Sort',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description:
    'Merge sort is a divide-and-conquer algorithm. It recursively splits the array in half, sorts each half, and then merges them back in sorted order.',
  steps: [
    'If the array has 0 or 1 element, it is already sorted.',
    'Split the array into two halves at the midpoint.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the two sorted halves into one sorted array.',
  ],
  implementations: mergeSortImpl,
};

// ── Quick Sort ──────────────────────────────────────────────────────────────
export const QUICK_SORT_INFO: AlgoInfo = {
  name: 'Quick Sort',
  category: 'Sort',
  complexity: { time: 'O(n log n) avg, O(n²) worst', space: 'O(log n)' },
  description:
    'Quick sort picks a pivot element and partitions the array into elements smaller than the pivot (left) and larger (right), then recursively sorts each partition.',
  steps: [
    'Choose a pivot (commonly the last element).',
    'Partition: move elements smaller than pivot to the left, larger to the right.',
    'Place the pivot in its correct sorted position.',
    'Recursively apply to the left and right partitions.',
    'Base case: partitions of size 0 or 1 are already sorted.',
  ],
  implementations: quickSortImpl,
};

// ── Dijkstra's ──────────────────────────────────────────────────────────────
export const DIJKSTRAS_INFO: AlgoInfo = {
  name: "Dijkstra's Algorithm",
  category: 'Graph',
  complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
  description:
    "Dijkstra's algorithm finds the shortest paths from a source node to all other reachable nodes in a graph with non-negative edge weights.",
  steps: [
    'Set distance to the start node as 0, and all others to infinity.',
    'Insert the start node into a priority queue.',
    'Pop the node with the minimum distance from the priority queue.',
    'For each neighbor, calculate the tentative distance through the current node.',
    'If the tentative distance is less than the known distance, update and push the neighbor into the queue.',
    'Repeat until the priority queue is empty.',
  ],
  implementations: dijstrasImpl,
};

// ── Prim's ──────────────────────────────────────────────────────────────────
export const PRIMS_INFO: AlgoInfo = {
  name: "Prim's Algorithm",
  category: 'Graph',
  complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
  description:
    "Prim's algorithm finds a Minimum Spanning Tree (MST) for a weighted undirected graph. It builds the MST one vertex at a time by always picking the next cheapest vertex connected to the growing tree.",
  steps: [
    'Initialize a priority queue to keep track of edges, starting from an arbitrary node with cost 0.',
    'Pop the edge with the minimum weight.',
    'If the node is already visited, discard it.',
    'Mark the node as visited and add the edge weight to the total MST cost.',
    'For all unvisited neighbors of the current node, push their connecting edges into the priority queue.',
    'Repeat until all nodes are visited.',
  ],
  implementations: primsImpl,
};

// ── Kruskal's ───────────────────────────────────────────────────────────────
export const KRUSKALS_INFO: AlgoInfo = {
  name: "Kruskal's Algorithm",
  category: 'Graph',
  complexity: { time: 'O(E log E)', space: 'O(V)' },
  description:
    "Kruskal's algorithm finds a Minimum Spanning Tree (MST) for a connected weighted graph. It sorts all edges and incrementally adds the smallest edge that doesn't form a cycle using a Disjoint Set (Union-Find) data structure.",
  steps: [
    'Sort all edges in the graph in ascending order of their weight.',
    'Initialize a Union-Find data structure with each vertex in its own set.',
    'Iterate through the sorted edges one by one.',
    'For each edge, check if its two endpoints belong to different sets (no cycle).',
    'If they do, union the two sets and add the edge weight to the total MST cost.',
    'Repeat until the MST contains V-1 edges.',
  ],
  implementations: kruskalsImpl,
};

// ── Heap Push ────────────────────────────────────────────────────────────────
export const HEAP_PUSH_INFO: AlgoInfo = {
  name: 'Heap Push',
  category: 'Heap',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description:
    'Heap push adds a new element to a Min-Heap/Max-Heap. The element is added at the end of the heap array and then "sifted up" to maintain the heap property.',
  steps: [
    'Add the new element to the end of the heap array.',
    'Compare the added element with its parent.',
    'If the heap property is violated, swap them (sift up).',
    'Repeat the process until the heap property is restored or the element reaches the root.',
  ],
  implementations: heapPushImpl,
};

// ── Heap Pop ─────────────────────────────────────────────────────────────────
export const HEAP_POP_INFO: AlgoInfo = {
  name: 'Heap Pop',
  category: 'Heap',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description:
    'Heap pop removes and returns the root element from a Min-Heap/Max-Heap. The last element replaces the root and is "sifted down" to restore the heap property.',
  steps: [
    'Remove the root element and save it.',
    'Move the last element of the heap array to the root position.',
    'Compare the new root with its children.',
    'Swap it with the extreme child (smallest or largest depending on heap type) if the heap property is violated.',
    'Repeat the process (sift down) until the heap property is restored.',
  ],
  implementations: heapPopImpl,
};

// ── Stack ────────────────────────────────────────────────────────────────────
export const STACK_INFO: AlgoInfo = {
  name: 'Stack',
  category: 'Data Structure',
  complexity: { time: 'O(1) push/pop', space: 'O(n)' },
  description:
    'A stack is a Last-In-First-Out (LIFO) data structure. Elements are added and removed from the same end (the top). Think of a stack of plates.',
  steps: [
    'Push: add an element to the top.',
    'Pop: remove the top element.',
    'Peek: view the top element without removing it.',
    'isEmpty: check if the stack has no elements.',
    'All operations run in O(1) time.',
  ],
  implementations: stackImpl,
};

// ── Monotonic Increasing Stack ───────────────────────────────────────────────
export const MONOTONIC_INC_STACK_INFO: AlgoInfo = {
  name: 'Monotonic Increasing Stack',
  category: 'Data Structure',
  complexity: { time: 'O(n)', space: 'O(n)' },
  description:
    'A monotonic increasing stack maintains elements in strictly increasing order from bottom to top. When a new element is pushed, all top elements that are greater than or equal to it are popped first. This is the key tool for finding the "Next Smaller Element" to the right.',
  steps: [
    'For each element num in the array:',
    'While the stack is not empty AND stack.top() >= num → pop.',
    'Push num onto the stack.',
    'After processing, the stack holds the increasing subsequence.',
    'Classic use: Next Smaller Element — when you pop, the current num is the answer for the popped element.',
  ],
  implementations: monotonicIncStackImpl,
};

// ── Monotonic Decreasing Stack ───────────────────────────────────────────────
export const MONOTONIC_DEC_STACK_INFO: AlgoInfo = {
  name: 'Monotonic Decreasing Stack',
  category: 'Data Structure',
  complexity: { time: 'O(n)', space: 'O(n)' },
  description:
    'A monotonic decreasing stack maintains elements in strictly decreasing order from bottom to top. When a new element is pushed, all top elements that are smaller than or equal to it are popped first. This is the key tool for finding the "Next Greater Element" to the right.',
  steps: [
    'For each element num in the array:',
    'While the stack is not empty AND stack.top() <= num → pop.',
    'Push num onto the stack.',
    'After processing, the stack holds the decreasing subsequence.',
    'Classic use: Next Greater Element — when you pop, the current num is the answer for the popped element.',
  ],
  implementations: monotonicDecStackImpl,
};

// ── Queue ────────────────────────────────────────────────────────────────────
export const QUEUE_INFO: AlgoInfo = {
  name: 'Queue',
  category: 'Data Structure',
  complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
  description:
    'A queue is a First-In-First-Out (FIFO) data structure. Elements are added to the back (enqueue) and removed from the front (dequeue). Think of a line of people.',
  steps: [
    'Enqueue: add an element to the back.',
    'Dequeue: remove the front element.',
    'Front: view the front element without removing it.',
    'isEmpty: check if the queue has no elements.',
    'All operations run in O(1) with a deque or linked list.',
  ],
  implementations: queueImpl,
};

// ── Inorder Traversal ────────────────────────────────────────────────────────
export const INORDER_INFO: AlgoInfo = {
  name: 'Inorder Traversal',
  category: 'Tree',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description:
    'Inorder traversal visits nodes in Left → Root → Right order. For a binary search tree this produces elements in sorted ascending order.',
  steps: [
    'Recursively traverse the left subtree.',
    'Visit (process) the current root node.',
    'Recursively traverse the right subtree.',
    'Base case: if the node is null, return immediately.',
    'Result: nodes are visited in ascending sorted order for a BST.',
  ],
  implementations: inorderImpl,
};

// ── Preorder Traversal ───────────────────────────────────────────────────────
export const PREORDER_INFO: AlgoInfo = {
  name: 'Preorder Traversal',
  category: 'Tree',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description:
    'Preorder traversal visits nodes in Root → Left → Right order. It is useful for copying a tree or generating prefix expressions.',
  steps: [
    'Visit (process) the current root node first.',
    'Recursively traverse the left subtree.',
    'Recursively traverse the right subtree.',
    'Base case: if the node is null, return immediately.',
    'Result: the root is always the first element in the output.',
  ],
  implementations: preorderImpl,
};

// ── Postorder Traversal ──────────────────────────────────────────────────────
export const POSTORDER_INFO: AlgoInfo = {
  name: 'Postorder Traversal',
  category: 'Tree',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description:
    'Postorder traversal visits nodes in Left → Right → Root order. It is useful for deleting a tree or evaluating postfix expressions.',
  steps: [
    'Recursively traverse the left subtree.',
    'Recursively traverse the right subtree.',
    'Visit (process) the current root node last.',
    'Base case: if the node is null, return immediately.',
    'Result: the root is always the last element in the output.',
  ],
  implementations: postorderImpl,
};

// ── BFS ──────────────────────────────────────────────────────────────────────
export const BFS_INFO: AlgoInfo = {
  name: 'Breadth-First Search',
  category: 'Graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  description:
    'BFS explores a graph level by level using a queue. It visits all neighbours of the current node before moving deeper, guaranteeing the shortest path in an unweighted graph.',
  steps: [
    'Enqueue the start node and mark it as visited.',
    'Dequeue the front node and process it.',
    'Enqueue all unvisited neighbours and mark them visited.',
    'Repeat until the queue is empty.',
    'Result: nodes are visited in order of increasing distance from the start.',
  ],
  implementations: bfsImpl,
};

// ── DFS ──────────────────────────────────────────────────────────────────────
export const DFS_INFO: AlgoInfo = {
  name: 'Depth-First Search',
  category: 'Graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  description:
    'DFS explores a graph by going as deep as possible along each branch before backtracking. It uses recursion (or an explicit stack) and a visited set to avoid revisiting nodes.',
  steps: [
    'Start at the chosen node and mark it as visited.',
    'Recursively visit each unvisited neighbour.',
    'If all neighbours are visited, backtrack to the previous node.',
    'Repeat until all reachable nodes have been visited.',
    'Result: a depth-first traversal that explores full paths before backtracking.',
  ],
  implementations: dfsImpl,
};

// ── Lookup Maps (page key → AlgoInfo) ────────────────────────────────────────

/** Sort page: algo key → info */
export const SORT_ALGO_INFO: Record<string, AlgoInfo> = {
  bubble: BUBBLE_SORT_INFO,
  selection: SELECTION_SORT_INFO,
  insertion: INSERTION_SORT_INFO,
  merge: MERGE_SORT_INFO,
  quick: QUICK_SORT_INFO,
};

/** Search page: algo key → info */
export const SEARCH_ALGO_INFO: Record<string, AlgoInfo> = {
  linear: LINEAR_SEARCH_INFO,
  binary: BINARY_SEARCH_INFO,
};

/** Tree page: traversal key → info */
export const TREE_ALGO_INFO: Record<string, AlgoInfo> = {
  inorder: INORDER_INFO,
  preorder: PREORDER_INFO,
  postorder: POSTORDER_INFO,
};

/** Graph page: algo key → info (keys match graphConfig.ts algo names) */
export const GRAPH_ALGO_INFO: Record<string, AlgoInfo> = {
  BFS: BFS_INFO,
  DFS: DFS_INFO,
  "Dijkstra's Algorithm": DIJKSTRAS_INFO,
  "Prim's Algorithm": PRIMS_INFO,
  "Kruskal's Algorithm": KRUSKALS_INFO,
};

/** Heap page: active operation → info */
export const HEAP_ALGO_INFO: Record<string, AlgoInfo> = {
  push: HEAP_PUSH_INFO,
  pop: HEAP_POP_INFO,
};

/** Stack page: algo mode → info */
export const STACK_ALGO_INFO: Record<string, AlgoInfo> = {
  stack: STACK_INFO,
  'monotonic inc stack': MONOTONIC_INC_STACK_INFO,
  'monotonic dec stack': MONOTONIC_DEC_STACK_INFO,
};
