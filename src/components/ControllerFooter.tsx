import {
  FastForwardIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RewindIcon,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider.tsx';

type ControllerFooterProps = {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  isPlaying: boolean;
  speed?: number;
  onSpeedChange?: (value: number) => void;
  onSpeedIncrease?: () => void;
  onSpeedDecrease?: () => void;
};

const ControllerFooter = ({
  onPlay,
  onPause,
  onNext,
  onPrev,
  isPlaying,
  speed = 1,
  onSpeedChange,
  onSpeedIncrease,
  onSpeedDecrease,
}: ControllerFooterProps) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 sm:px-6 w-full">
      {/* Speed Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSpeedDecrease}
          disabled={!onSpeedDecrease}
          className="controller-btn"
          aria-label="Decrease speed"
        >
          <MinusIcon className="size-3.5" />
        </button>

        <Slider
          value={[Math.round(speed * 100)]}
          onValueChange={(values) => {
            const next = (values[0] ?? 100) / 100;
            onSpeedChange?.(next);
          }}
          min={25}
          max={300}
          step={5}
          className="w-20 sm:w-32 md:w-48 controller-slider"
        />

        <button
          onClick={onSpeedIncrease}
          disabled={!onSpeedIncrease}
          className="controller-btn"
          aria-label="Increase speed"
        >
          <PlusIcon className="size-3.5" />
        </button>

        <span
          className="text-xs font-mono tracking-tight min-w-[3rem] text-right"
          style={{ color: 'var(--muted-text)' }}
        >
          {speed.toFixed(2)}x
        </span>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          className="controller-btn"
          aria-label="Previous step"
        >
          <RewindIcon className="size-3.5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="controller-play-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4 ml-0.5" />
          )}
        </button>

        <button
          onClick={onNext}
          className="controller-btn"
          aria-label="Next step"
        >
          <FastForwardIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ControllerFooter;
