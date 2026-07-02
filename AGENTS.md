# AGENTS.md

## Purpose

This file defines how coding agents should work in this repository.

## Project Context

- This is an algorithm visualizer web app covering sorting, searching, graphs, trees, heaps, stacks, queues, and linked lists.
- Algorithms are visualized step-by-step for learning and debugging.
- GSAP is the primary animation engine used for timeline-based interactions.
- Agents should prioritize clear algorithm process visualization, not just final output states.

## Reference Links (Use When Stuck)

- GSAP Cheatsheet: https://gsap.com/cheatsheet
- GSAP LLM Context: https://gsap.com/llms.txt
- GSAP React Docs: https://gsap.com/resources/React

## Modular Structure Principles

- Keep the project modular so anyone can add, remove, or modify algorithms safely.
- Prefer algorithm registry files (maps/builders) over creating duplicate page components.
- Keep shared UI/control logic in shared components and hooks.
- Keep algorithm-specific logic isolated in dedicated algorithm modules.
- New algorithm additions should require minimal wiring changes.

## Primary Goals

- Keep all visualizers stable and easy to extend across every algorithm category.
- Prefer architecture that allows adding algorithms without cloning pages.
- Preserve unified GSAP timeline controls (play, pause, next, previous, speed) across all pages.
- Avoid regressions in any visualizer when making cross-cutting changes.

## Repository Conventions

- Framework: React + TypeScript + Vite.
- Styling: Tailwind utility classes and shared component classes in `src/index.css`.
- Routing: react-router-dom routes in `src/App.tsx`.
- Shared visualizer shell: `src/components/SharedLayout.tsx` (sort/search) and `src/components/AlgoBookShell.tsx` (all others).
- Playback controls: `src/components/ControllerFooter.tsx` — used by every visualizer page.

## Architecture Rules

Each algorithm category lives in its own folder under `src/components/`:

| Category    | Logic file                   | View file               |
| ----------- | ---------------------------- | ----------------------- |
| Sort        | `sort/SortAlgos.ts`          | `sort/SortPage.tsx`     |
| Search      | `search/searchAlgorithms.ts` | `search/SearchPage.tsx` |
| Graph       | `graph/graphAlgorithms.ts`   | `graph/GraphPage.tsx`   |
| Tree        | _(inline in page)_           | `tree/TreePage.tsx`     |
| Heap        | `heap/heapAlgorithms.ts`     | `heap/HeapPage.tsx`     |
| Stack       | `stack/stackAlgos.ts`        | `stack/stackPage.tsx`   |
| Queue       | `queue/queueAlgo.ts`         | `queue/queuePage.tsx`   |
| Linked List | `linkedlist/llalgo.ts`       | `linkedlist/llPage.tsx` |

- Do not add separate page components for each algorithm variant unless explicitly requested.
- Prefer algorithm registries/maps over switch-heavy duplicated UI files.
- Algorithm metadata (description, complexity, steps, implementations) lives in `src/constants/algoInfo.ts`.

## GSAP Rules

- Use `@gsap/react useGSAP()` for React lifecycle-safe animations.
- Use `contextSafe` for event-driven animation callbacks.
- Store reusable GSAP timeline instances in refs (`timelineRef`).
- Store step labels in a `labelsRef` array to support prev/next seeking.
- Clear or revert GSAP side effects when starting a new run.
- Avoid direct global selectors when a scoped container ref is available.
- Apply `tl.timeScale(speed)` to sync the speed slider with the active timeline.

## Playback Controls Pattern

Every visualizer must implement the following unified control interface:

```ts
const [isPlaying, setIsPlaying] = useState(false);
const [speed, setSpeed] = useState(0.75);
const timelineRef = useRef<gsap.core.Timeline | null>(null);
const labelsRef = useRef<string[]>([]);
```

- On build: clear the timeline, add a label per step, register `onComplete` to set `isPlaying = false`.
- `onPlay` → `tl.play(); setIsPlaying(true)`
- `onPause` → `tl.pause(); setIsPlaying(false)`
- `onNext` → seek to the next label in `labelsRef`
- `onPrev` → seek to the previous label in `labelsRef`
- Speed change → `tl.timeScale(speed)`
- Wire these into `<ControllerFooter>` rendered in the page footer.

## State and Rendering Rules

- Element keys and ids must stay unique in every rendered frame.
- Frame/step builders must never create duplicate ids in the same frame.
- Visual state functions should be deterministic and side-effect free.
- Add explicit visual states for: active, visiting, visited, found/sorted, and discarded/popped elements as needed.

## Interaction Rules

- Dropdown algorithm switching should change algorithm mode in-page without a full route remount.
- "Generate Random" must always produce a valid initial state and reset all animation state.
- Show clear feedback for invalid input and not-found results via toast or phase label.
- Switching algorithm variant or traversal type must clear the active timeline and reset `isPlaying`.

## Testing and Validation

After modifying any visualizer:

1. Run `npx tsc --noEmit` — zero errors required.
2. Run `npm run build` — must succeed.
3. Manually verify the affected visualizer:
   - Play/pause controls respond correctly.
   - Next/prev step navigation works.
   - Speed slider changes animation pace.
   - Generate Random resets state cleanly.
   - Algorithm switching does not leave stale animation state.
4. Confirm no broken imports or duplicate architecture paths.

## Code Quality Rules

- Keep changes minimal and scoped.
- Do not leave unused builders, dead exports, or placeholder code.
- Prefer descriptive names over abbreviations for algorithm/step functions.
- Add brief comments only for non-obvious logic.
- Fix typos in existing comments when you encounter them.

## Animation Rules

- Animations should be explicit — not subtle or instant.
- Give animations time to breathe; don't rush to the finish state.
- Animations should be detailed and highlight the process at each step.
- Animations should be creative and intuitive to understand.
- The algorithm logic is fixed — animation is the primary teaching tool, so invest in it.

## Pull Request Checklist

- [ ] No duplicated algorithm pages for the same feature.
- [ ] New algorithms are wired via registry/map files, not new page clones.
- [ ] `ControllerFooter` controls (play/pause/next/prev/speed) work correctly.
- [ ] GSAP animation lifecycle is safe (no memory leaks, no stale timelines).
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`).
- [ ] `npm run build` succeeds.
