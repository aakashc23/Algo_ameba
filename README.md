# 🔬 Algo Ameba

> Interactive, step-by-step algorithm visualizer built for learning and debugging. Powered by React, GSAP, and D3.

Algo Ameba visualizes algorithms with **frame-by-frame animations**, letting you see exactly how each step works — not just final results. Every comparison, swap, traversal, and operation is animated in real-time with full playback controls.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- **Step-by-Step Animations** — Watch algorithms execute frame-by-frame with smooth, timed GSAP timelines
- **Unified Playback Controls** — Play, pause, step forward/back, and adjust speed across every visualizer
- **Dark / Light Theme** — Toggle between modes with a persistent preference and smooth transition
- **Algorithm Reference Panel** — Resizable side-by-side panel with complexity info, explanation, and multi-language code snippets
- **Responsive Design** — Mobile-friendly UI built with Tailwind CSS
- **Clean Architecture** — Modular algorithm modules with registry-based routing; adding a new algorithm requires minimal wiring
- **SVG + D3 Rendering** — Custom SVG layouts powered by D3 hierarchy and force layouts for trees, heaps, and graphs

---

## 📚 Algorithms & Data Structures

### 🔃 Sorting

| Algorithm      | Visualization highlights                             |
| -------------- | ---------------------------------------------------- |
| Bubble Sort    | Pairwise comparison flashes, swap animation          |
| Selection Sort | Minimum scan highlight, in-place placement           |
| Insertion Sort | Shift animation, building sorted prefix step-by-step |
| Merge Sort     | Split/merge tree with placed-element bloom           |
| Quick Sort     | Gold pivot crown, partitioning range highlight       |

### 🔍 Searching

| Algorithm     | Visualization highlights                     |
| ------------- | -------------------------------------------- |
| Linear Search | Sequential highlight, found/not-found states |
| Binary Search | Range reduction, mid-point crown, discard    |

### 🌲 Trees

| Algorithm / Operation | Visualization highlights                |
| --------------------- | --------------------------------------- |
| Insert / Delete       | Node spring-in / fade-out animations    |
| BST Search            | Path highlight to found node            |
| Preorder Traversal    | Amber visit flash → green settled state |
| Inorder Traversal     | ″                                       |
| Postorder Traversal   | ″                                       |
| Level-order Traversal | ″                                       |

### 🏔️ Heap

| Operation | Visualization highlights                       |
| --------- | ---------------------------------------------- |
| Heappush  | Insert animation + sift-up swap sequence       |
| Heappop   | Root removal flash + sift-down swap sequence   |
| Min / Max | Both variants supported with per-step playback |

### 🕸️ Graph

| Algorithm  | Visualization highlights                         |
| ---------- | ------------------------------------------------ |
| BFS        | Queue-driven level-by-level node discovery       |
| DFS        | Stack-driven deep-dive path highlight            |
| Dijkstra's | Shortest-path revelation with edge weight labels |
| Prim's MST | Growing spanning tree with edge selection        |
| Kruskal's  | Edge-sorted union-find with cycle detection      |

### 📦 Linear Data Structures

| Structure   | Operations                                                        |
| ----------- | ----------------------------------------------------------------- |
| Stack       | Push, pop, peek — with monotonic stack variants                   |
| Queue       | Enqueue, dequeue, peek — with deque, monotonic, circular variants |
| Linked List | Insert, delete, traverse — singly, doubly, circular               |

---

## 🛠 Tech Stack

| Layer             | Technology                                        |
| ----------------- | ------------------------------------------------- |
| **Frontend**      | React 19, TypeScript 5.8                          |
| **Routing**       | React Router 7                                    |
| **Animation**     | GSAP 3.13 + `@gsap/react`, Flip plugin            |
| **Visualization** | D3 7 (hierarchy, tree, force layouts), Custom SVG |
| **Styling**       | Tailwind CSS 4, Radix UI primitives               |
| **UI Components** | shadcn/ui (button, input, select, tabs, dropdown) |
| **Notifications** | Sonner                                            |
| **Build**         | Vite 7                                            |
| **Linting**       | ESLint + Prettier                                 |

---

## 📂 Project Structure

```
algo-ameba/
├── src/
│   ├── components/
│   │   ├── AlgoBookShell.tsx         # Viz + resizable algorithm reference sidebar shell
│   │   ├── AlgoSideBar.tsx           # Algorithm info panel (complexity, steps, code)
│   │   ├── SharedLayout.tsx          # Shared visualizer container (sort/search)
│   │   ├── ControllerFooter.tsx      # Unified play/pause/step/speed controls
│   │   ├── ColorLegend.tsx           # Per-page colour key
│   │   ├── FloatingHelper.tsx        # Floating phase-label bubble
│   │   ├── Navbar.tsx                # Top navigation
│   │   ├── mode-toggle.tsx           # Light/dark theme toggle
│   │   ├── sort/
│   │   │   ├── SortPage.tsx          # Sorting visualizer UI
│   │   │   └── SortAlgos.ts          # Bubble/Selection/Insertion/Merge/Quick implementations
│   │   ├── search/
│   │   │   ├── SearchPage.tsx        # Search visualizer UI
│   │   │   └── searchAlgorithms.ts   # Linear/Binary implementations
│   │   ├── graph/
│   │   │   ├── GraphPage.tsx         # Graph visualizer UI
│   │   │   ├── graphAlgorithms.ts    # BFS/DFS/Dijkstra/Prim/Kruskal
│   │   │   └── graphConfig.ts        # Graph layout & node config
│   │   ├── tree/
│   │   │   └── TreePage.tsx          # BST visualizer (insert/delete/search/traversals)
│   │   ├── heap/
│   │   │   ├── HeapPage.tsx          # Heap visualizer (min/max, push/pop)
│   │   │   ├── heapAlgorithms.ts     # Heapify, push, pop implementations
│   │   │   └── heapTypes.ts          # Shared heap type definitions
│   │   ├── stack/
│   │   │   ├── stackPage.tsx         # Stack visualizer (push/pop/peek/monotonic)
│   │   │   └── stackAlgos.ts         # Stack algorithm logic
│   │   ├── queue/
│   │   │   ├── queuePage.tsx         # Queue visualizer (enqueue/dequeue/peek/deque/circular)
│   │   │   └── queueAlgo.ts          # Queue algorithm logic
│   │   ├── linkedlist/
│   │   │   ├── llPage.tsx            # Linked list visualizer
│   │   │   ├── llalgo.ts             # LL operations (insert/delete/traverse)
│   │   │   └── llConfig.ts           # LL node config
│   │   └── ui/                       # Radix UI / shadcn component wrappers
│   ├── pages/
│   │   ├── LandingPage.tsx           # Marketing landing with GSAP animations
│   │   ├── Homepage.tsx              # Algorithm catalog / card grid
│   │   └── AboutPage.tsx             # Project info
│   ├── hooks/
│   │   ├── useSearchVizulizer.tsx    # Search/sort shared state & controls
│   │   ├── useDimensions.ts          # Responsive canvas sizing
│   │   └── useWindowWidth.ts         # Viewport width helper
│   ├── constants/
│   │   ├── routes.ts                 # Centralised route path constants
│   │   ├── algoInfo.ts               # Algorithm metadata (description, complexity, steps, code)
│   │   └── algo/                     # Per-algorithm info files (imported by algoInfo.ts)
│   ├── App.tsx                       # React Router route definitions
│   ├── main.tsx                      # App entry point
│   ├── index.css                     # Global styles, CSS custom properties, theme tokens
│   └── gsapSetup.ts                  # GSAP plugin registration
├── AGENTS.md                         # Agent/contributor development guidelines
├── BUGS.md                           # Known issues & workaround notes
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/algo-ameba.git
cd algo-ameba

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with hot reload (http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Type-check + build optimised bundle
npm run build

# Preview the production build locally
npm run preview
```

### Code Quality

```bash
# Format all files with Prettier
npm run format

# Run ESLint
npm run lint
```

## 📝 License

MIT License — see LICENSE file for details.

**Happy learning! 🚀**
