/**
 * ColorLegend — compact swatch + label strip shown below visualizations.
 * Each page passes entries specific to its current algorithm/mode.
 */

export type LegendEntry = {
  /** CSS color value (hex, rgb, or var(--token)) */
  color: string;
  label: string;
  /** Optional subtle glow color (rgba). Defaults to none. */
  glow?: string;
};

interface ColorLegendProps {
  entries: LegendEntry[];
  className?: string;
}

const ColorLegend = ({ entries, className = '' }: ColorLegendProps) => {
  if (entries.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap justify-center items-center gap-x-6 gap-y-2.5 px-6 py-3 ${className}`}
    >
      {entries.map(({ color, label, glow }) => (
        <span key={label} className="flex items-center gap-2 select-none">
          {/* Swatch */}
          <span
            className="inline-block rounded flex-shrink-0"
            style={{
              width: 16,
              height: 16,
              background: color,
              boxShadow: glow ? `0 0 8px ${glow}` : undefined,
            }}
          />
          {/* Label */}
          <span
            className="font-mono text-[13px] tracking-wide whitespace-nowrap font-medium"
            style={{ color: 'var(--muted-text)' }}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );
};

export default ColorLegend;

// ─── Pre-built entry sets for each page ────────────────────────────────────

/** Sort: Bubble / Selection / Insertion */
export const SORT_BASIC_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-bar-default-bg)', label: 'Default' },
  {
    color: 'var(--viz-bar-checking-bg)',
    label: 'Comparing',
    glow: 'rgba(239,68,68,0.4)',
  },
  {
    color: 'var(--viz-bar-comparing-bg)',
    label: 'Pivot / Min',
    glow: 'rgba(245,158,11,0.4)',
  },
  {
    color: 'var(--viz-bar-swapping-bg)',
    label: 'Swapping',
    glow: 'rgba(244,63,94,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Sorted',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Sort: Merge Sort */
export const SORT_MERGE_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-bar-default-bg)', label: 'Default' },
  {
    color: 'var(--viz-bar-splitting-bg)',
    label: 'Splitting',
    glow: 'rgba(139,92,246,0.4)',
  },
  {
    color: 'var(--viz-bar-merging-bg)',
    label: 'Merging',
    glow: 'rgba(249,115,22,0.4)',
  },
  {
    color: 'var(--viz-bar-placed-bg)',
    label: 'Placed',
    glow: 'rgba(6,182,212,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Sorted',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Sort: Quick Sort */
export const SORT_QUICK_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-bar-default-bg)', label: 'Default' },
  { color: '#eab308', label: 'Pivot', glow: 'rgba(234,179,8,0.4)' },
  {
    color: 'var(--viz-bar-comparing-bg)',
    label: 'Comparing',
    glow: 'rgba(245,158,11,0.4)',
  },
  {
    color: 'var(--viz-bar-swapping-bg)',
    label: 'Swapping',
    glow: 'rgba(244,63,94,0.4)',
  },
  {
    color: 'var(--viz-bar-placed-bg)',
    label: 'Placed',
    glow: 'rgba(6,182,212,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Sorted',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Search: Linear */
export const SEARCH_LINEAR_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-search-default-bg)', label: 'Unchecked' },
  {
    color: 'var(--viz-search-checking-bg)',
    label: 'Checking',
    glow: 'rgba(245,158,11,0.4)',
  },
  { color: 'var(--viz-search-discard-bg)', label: 'Skipped' },
  {
    color: 'var(--viz-search-found-bg)',
    label: 'Found',
    glow: 'rgba(0,255,17,0.4)',
  },
];

/** Search: Binary */
export const SEARCH_BINARY_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-search-active-bg)', label: 'Active range' },
  {
    color: 'var(--viz-search-mid-bg)',
    label: 'Mid (pivot)',
    glow: 'rgba(245,158,11,0.4)',
  },
  { color: 'var(--viz-search-discard-bg)', label: 'Eliminated' },
  {
    color: 'var(--viz-search-found-bg)',
    label: 'Found',
    glow: 'rgba(0,255,17,0.4)',
  },
];

/** Tree / Graph — SVG node colors */
export const TREE_GRAPH_LEGEND: LegendEntry[] = [
  { color: 'var(--node)', label: 'Unvisited', glow: 'var(--node-glow)' },
  {
    color: 'var(--node-active)',
    label: 'Active',
    glow: 'var(--node-active-glow)',
  },
  {
    color: 'var(--node-visited)',
    label: 'Visited',
    glow: 'var(--node-visited-glow)',
  },
];

/** Heap */
export const HEAP_LEGEND: LegendEntry[] = [
  { color: 'var(--box-bg)', label: 'Node' },
  {
    color: 'var(--viz-bar-checking-bg)',
    label: 'Comparing',
    glow: 'rgba(239,68,68,0.4)',
  },
  {
    color: 'var(--viz-bar-swapping-bg)',
    label: 'Swapping',
    glow: 'rgba(244,63,94,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Heapified',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Stack */
export const STACK_LEGEND: LegendEntry[] = [
  { color: 'var(--box-bg)', label: 'Node' },
  {
    color: 'var(--viz-bar-checking-bg)',
    label: 'Push / Active',
    glow: 'rgba(239,68,68,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Top',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Queue */
export const QUEUE_LEGEND: LegendEntry[] = [
  { color: 'var(--box-bg)', label: 'Node' },
  {
    color: 'var(--viz-bar-checking-bg)',
    label: 'Enqueue / Active',
    glow: 'rgba(239,68,68,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Dequeue',
    glow: 'rgba(0,255,17,0.35)',
  },
];

/** Linked List */
export const LINKED_LIST_LEGEND: LegendEntry[] = [
  { color: 'var(--viz-ll-node-bg)', label: 'Node' },
  {
    color: 'var(--viz-bar-checking-bg)',
    label: 'Active / Insert',
    glow: 'rgba(239,68,68,0.4)',
  },
  {
    color: 'var(--viz-bar-sorted-bg)',
    label: 'Target / Found',
    glow: 'rgba(0,255,17,0.35)',
  },
];
