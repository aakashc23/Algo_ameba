import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { type ReactNode } from 'react';
import ControllerFooter from '@/components/ControllerFooter.tsx';
import ColorLegend, { type LegendEntry } from '@/components/ColorLegend';
import { useNavigate } from 'react-router-dom';

interface Algo {
  name: string;
  value: string;
}

// We will use this to track the state for visual rendering
//
export type BarState =
  | 'default'
  | 'checking'
  | 'found'
  | 'discarded'
  | 'mid'
  | 'active';

interface SharedLayoutProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  searchValue?: string;
  setSearchValue?: (val: string) => void;
  handleInsert: () => void;
  handleSearch?: () => void;
  handleClear?: () => void;
  actionLabel?: string;
  generateRandomArray: () => void;
  algoMap: Algo[];
  children: ReactNode;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  selectedAlgorithm?: string;
  onAlgorithmChange?: (value: string) => void;
  speed?: number;
  onSpeedChange?: (value: number) => void;
  onSpeedIncrease?: () => void;
  onSpeedDecrease?: () => void;
  /** Optional color legend entries — rendered in the footer row */
  legend?: LegendEntry[];
}

const SharedLayout = ({
  inputValue,
  setInputValue,
  searchValue,
  setSearchValue,
  handleInsert,
  handleSearch,
  handleClear,
  actionLabel,
  generateRandomArray,
  algoMap,
  children,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  selectedAlgorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  onSpeedIncrease,
  onSpeedDecrease,
  legend,
}: SharedLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="shell flex flex-col h-full w-full min-h-0 bg-background">
      <div className="algo-toolbar">
        {/* Input Insert */}
        <div className={'flex flex-wrap items-center gap-2 min-w-0'}>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input w-28"
              placeholder="Insert number"
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  handleInsert();
                }
              }}
            />
            <button onClick={handleInsert} className="btn-primary">
              Insert
            </button>
          </div>

          {typeof searchValue === 'string' &&
            setSearchValue &&
            handleSearch && (
              <div className="flex items-center gap-2">
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input w-fit pl-3 pr-2 px-2"
                  placeholder="Search value"
                />
                <button onClick={handleSearch} className="btn-success">
                  {actionLabel ?? 'Search'}
                </button>
              </div>
            )}

          {handleSearch &&
            !(typeof searchValue === 'string' && setSearchValue) && (
              <button onClick={handleSearch} className="btn-success">
                {actionLabel ?? 'Sort'}
              </button>
            )}

          {/* Random + Clear buttons */}
          <button onClick={() => generateRandomArray()} className="btn-neutral">
            Generate Random
          </button>
          {handleClear && (
            <button onClick={handleClear} className="btn-danger">
              Clear
            </button>
          )}
        </div>

        {/* Algorithm Dropdown */}
        <Select
          value={selectedAlgorithm}
          onValueChange={(value) => {
            if (onAlgorithmChange) {
              onAlgorithmChange(value);
              return;
            }

            const nextPath = value.startsWith('/') ? value : `/${value}`;
            navigate(nextPath, { replace: true });
          }}
        >
          <SelectTrigger className="w-44 select-trigger h-9 font-mono text-sm">
            <SelectValue placeholder={algoMap[0].name} />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectGroup>
              <SelectLabel>Algorithms</SelectLabel>
              {algoMap.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  {algo.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex justify-center items-center min-h-0">
        {children}
      </div>

      {/* Legend + Controls in the same footer band */}
      <footer className="footer flex flex-col gap-0 w-full">
        {/* Color legend strip — only rendered when entries are provided */}
        {legend && legend.length > 0 && (
          <div className="w-full flex justify-center">
            <ColorLegend entries={legend} />
          </div>
        )}
        <ControllerFooter
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          onNext={onNext}
          onPrev={onPrev}
          speed={speed}
          onSpeedChange={onSpeedChange}
          onSpeedIncrease={onSpeedIncrease}
          onSpeedDecrease={onSpeedDecrease}
        />
      </footer>
    </div>
  );
};

export default SharedLayout;
