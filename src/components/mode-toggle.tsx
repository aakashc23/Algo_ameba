import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Resolve the real active mode (handles 'system')
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      if (theme === 'dark') setIsDark(true);
      else if (theme === 'light') setIsDark(false);
      else setIsDark(mq.matches);
    };
    resolve();
    mq.addEventListener('change', resolve);
    return () => mq.removeEventListener('change', resolve);
  }, [theme]);

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      data-dark={isDark ? 'true' : 'false'}
    >
      {/* Track */}
      <span className="theme-toggle__track" aria-hidden="true" />

      {/* Sliding thumb */}
      <span className="theme-toggle__thumb">
        <Sun
          className="theme-toggle__icon theme-toggle__icon--sun"
          aria-hidden="true"
        />
        <Moon
          className="theme-toggle__icon theme-toggle__icon--moon"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
