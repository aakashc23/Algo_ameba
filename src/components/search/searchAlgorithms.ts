export type SearchMode = 'linear' | 'binary';

export type SearchBar = {
  id: string;
  value: number;
};

export type SearchBarState =
  | 'checking'
  | 'found'
  | 'discarded'
  | 'active'
  | 'mid';

/**
 * xFraction: horizontal spread offset (-1…+1). Multiplied by a pixel constant in SearchPage.
 * yLevel  : 0 = baseline, positive = lifted above.
 */
export type SearchBarOffset = {
  xFraction: number;
  yLevel: number;
};

export type SearchFrame = {
  states: Record<string, SearchBarState>;
  duration: number;
  activeIds?: string[];
  discardedIds?: string[];
  // Binary search: which side was just eliminated
  leftDiscardedIds?: string[]; // fly to -x
  rightDiscardedIds?: string[]; // fly to +x
  focusId?: string;
  isFinalFound?: boolean;
  isNotFound?: boolean;
  /** Step label shown above bars (merge-sort style) */
  phaseLabel?: string;
  /** Per-bar spatial offsets for position animation */
  offsets?: Record<string, SearchBarOffset>;
};

export type SearchRunResult = {
  initialBars: SearchBar[];
  frames: SearchFrame[];
  found: boolean;
  foundId?: string;
};

const linearSearch = (bars: SearchBar[], target: number): SearchRunResult => {
  const frames: SearchFrame[] = [];
  let foundId: string | undefined;

  for (let index = 0; index < bars.length; index++) {
    const current = bars[index];
    frames.push({
      states: { [current.id]: 'checking' },
      duration: 0.8,
      activeIds: [current.id],
      discardedIds: bars
        .filter((bar) => bar.id !== current.id)
        .map((bar) => bar.id),
      focusId: current.id,
      phaseLabel: `Checking index ${index}: value ${current.value} ${current.value === target ? '= ' : '≠ '}${target}`,
    });

    if (current.value === target) {
      foundId = current.id;
      break;
    }
  }

  if (foundId) {
    frames.push({
      states: { [foundId]: 'found' },
      duration: 1.2,
      activeIds: [foundId],
      discardedIds: bars
        .filter((bar) => bar.id !== foundId)
        .map((bar) => bar.id),
      focusId: foundId,
      phaseLabel: `Found ${target}!`,
    });
  } else {
    frames.push({
      states: {},
      duration: 0.8,
      activeIds: [],
      discardedIds: bars.map((bar) => bar.id),
      phaseLabel: `${target} not found in array`,
    });
  }

  return {
    initialBars: bars,
    frames,
    found: Boolean(foundId),
    foundId,
  };
};

const binarySearch = (bars: SearchBar[], target: number): SearchRunResult => {
  const sortedBars = [...bars].sort((left, right) => left.value - right.value);
  const frames: SearchFrame[] = [];
  let low = 0;
  let high = sortedBars.length - 1;
  let foundId: string | undefined;
  let stepNum = 0;

  const eliminatedLeft = new Set<string>();
  const eliminatedRight = new Set<string>();

  // ── Initial frame: show the full sorted array ──
  {
    const states: Record<string, SearchBarState> = {};
    sortedBars.forEach((b) => {
      states[b.id] = 'active';
    });
    frames.push({
      states,
      duration: 1.2,
      activeIds: sortedBars.map((b) => b.id),
      discardedIds: [],
      leftDiscardedIds: [],
      rightDiscardedIds: [],
      phaseLabel: `Sorted array — searching for ${target}`,
      offsets: buildOffsets(sortedBars, 0, sortedBars.length - 1),
    });
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midBar = sortedBars[mid];
    stepNum++;

    // Active range IDs
    const activeIds = sortedBars.slice(low, high + 1).map((b) => b.id);
    const discardedIds = sortedBars
      .filter((_, i) => i < low || i > high)
      .map((b) => b.id);

    // ── Frame: show active range with mid highlighted ──
    const states: Record<string, SearchBarState> = {};
    activeIds.forEach((id) => {
      states[id] = 'active';
    });
    discardedIds.forEach((id) => {
      states[id] = 'discarded';
    });
    states[midBar.id] = 'mid';

    const offsets = buildOffsets(sortedBars, low, high, mid);

    frames.push({
      states,
      duration: 1.8,
      activeIds,
      discardedIds,
      leftDiscardedIds: [...eliminatedLeft],
      rightDiscardedIds: [...eliminatedRight],
      focusId: midBar.id,
      phaseLabel: `Step ${stepNum}: mid = index ${mid}, value ${midBar.value} ${
        midBar.value === target ? '=' : midBar.value < target ? '<' : '>'
      } ${target}`,
      offsets,
    });

    if (midBar.value === target) {
      foundId = midBar.id;
      break;
    }

    // ── Frame: show which half is being eliminated ──
    if (midBar.value < target) {
      // Eliminate left half (low..mid)
      for (let i = low; i <= mid; i++) eliminatedLeft.add(sortedBars[i].id);

      const elimStates = { ...states };
      for (let i = low; i <= mid; i++)
        elimStates[sortedBars[i].id] = 'discarded';

      frames.push({
        states: elimStates,
        duration: 1.2,
        activeIds: sortedBars.slice(mid + 1, high + 1).map((b) => b.id),
        discardedIds: [
          ...discardedIds,
          ...sortedBars.slice(low, mid + 1).map((b) => b.id),
        ],
        leftDiscardedIds: [...eliminatedLeft],
        rightDiscardedIds: [...eliminatedRight],
        focusId: midBar.id,
        phaseLabel: `${midBar.value} < ${target} → eliminate left half [${low}…${mid}]`,
        offsets: buildEliminateOffsets(sortedBars, low, mid, high, 'left'),
      });

      low = mid + 1;
    } else {
      // Eliminate right half (mid..high)
      for (let i = mid; i <= high; i++) eliminatedRight.add(sortedBars[i].id);

      const elimStates = { ...states };
      for (let i = mid; i <= high; i++)
        elimStates[sortedBars[i].id] = 'discarded';

      frames.push({
        states: elimStates,
        duration: 1.2,
        activeIds: sortedBars.slice(low, mid).map((b) => b.id),
        discardedIds: [
          ...discardedIds,
          ...sortedBars.slice(mid, high + 1).map((b) => b.id),
        ],
        leftDiscardedIds: [...eliminatedLeft],
        rightDiscardedIds: [...eliminatedRight],
        focusId: midBar.id,
        phaseLabel: `${midBar.value} > ${target} → eliminate right half [${mid}…${high}]`,
        offsets: buildEliminateOffsets(sortedBars, low, mid, high, 'right'),
      });

      high = mid - 1;
    }
  }

  // ── Final frame ──
  if (foundId) {
    const discardedIds = sortedBars
      .filter((bar) => bar.id !== foundId)
      .map((bar) => bar.id);
    frames.push({
      states: {
        ...Object.fromEntries(
          discardedIds.map((id) => [id, 'discarded' as const])
        ),
        [foundId]: 'found',
      },
      duration: 2.5,
      activeIds: [foundId],
      discardedIds,
      leftDiscardedIds: [...eliminatedLeft],
      rightDiscardedIds: [...eliminatedRight],
      focusId: foundId,
      isFinalFound: true,
      phaseLabel: `Found ${target} at index ${sortedBars.findIndex((b) => b.id === foundId)}!`,
    });
  } else {
    frames.push({
      states: Object.fromEntries(
        sortedBars.map((bar) => [bar.id, 'discarded' as const])
      ),
      duration: 1.5,
      activeIds: [],
      discardedIds: sortedBars.map((bar) => bar.id),
      leftDiscardedIds: [...eliminatedLeft],
      rightDiscardedIds: [...eliminatedRight],
      isNotFound: true,
      phaseLabel: `${target} not found in array`,
    });
  }

  return {
    initialBars: sortedBars,
    frames,
    found: Boolean(foundId),
    foundId,
  };
};

// ── Offset helpers (merge-sort style spatial positioning) ──────────────────

/**
 * Build offsets for the current active range.
 * Active bars stay at x=0, mid bar lifts (yLevel=1).
 */
function buildOffsets(
  bars: SearchBar[],
  low: number,
  high: number,
  midIndex?: number
): Record<string, SearchBarOffset> {
  const result: Record<string, SearchBarOffset> = {};
  for (let i = 0; i < bars.length; i++) {
    if (i >= low && i <= high) {
      result[bars[i].id] = {
        xFraction: 0,
        yLevel: midIndex !== undefined && i === midIndex ? 1 : 0,
      };
    } else {
      // Out of range bars keep their position but are not animated by offsets
      result[bars[i].id] = { xFraction: 0, yLevel: 0 };
    }
  }
  return result;
}

/**
 * Build offsets showing elimination animation.
 * The eliminated side slides away (xFraction ±0.8), the remaining side stays centred.
 */
function buildEliminateOffsets(
  bars: SearchBar[],
  low: number,
  mid: number,
  high: number,
  side: 'left' | 'right'
): Record<string, SearchBarOffset> {
  const result: Record<string, SearchBarOffset> = {};
  for (let i = 0; i < bars.length; i++) {
    if (side === 'left') {
      // Eliminating low..mid
      if (i >= low && i <= mid) {
        result[bars[i].id] = { xFraction: -0.85, yLevel: 0 };
      } else if (i > mid && i <= high) {
        result[bars[i].id] = { xFraction: 0, yLevel: 0 };
      } else {
        result[bars[i].id] = { xFraction: 0, yLevel: 0 };
      }
    } else {
      // Eliminating mid..high
      if (i >= mid && i <= high) {
        result[bars[i].id] = { xFraction: 0.85, yLevel: 0 };
      } else if (i >= low && i < mid) {
        result[bars[i].id] = { xFraction: 0, yLevel: 0 };
      } else {
        result[bars[i].id] = { xFraction: 0, yLevel: 0 };
      }
    }
  }
  return result;
}

export const searchAlgorithms: Record<
  SearchMode,
  (bars: SearchBar[], target: number) => SearchRunResult
> = {
  linear: linearSearch,
  binary: binarySearch,
};
