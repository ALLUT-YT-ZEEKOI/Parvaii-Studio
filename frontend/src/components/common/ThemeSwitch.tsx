import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitchProps {
  variant?: 'segmented' | 'slider';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  variant = 'segmented',
  size = 'md',
  showLabels = true,
  className = '',
}) => {
  const { isDarkMode, setTheme, toggleTheme } = useTheme();

  if (variant === 'slider') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {showLabels && (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 select-none">
            {isDarkMode ? 'Navy Dark' : 'White Light'}
          </span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isDarkMode}
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Midnight Navy Dark Mode'}
          className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border border-slate-300 dark:border-[#1E3760] bg-slate-200/90 dark:bg-[#071328] p-0.5 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C9B7A5]/50 shadow-inner"
        >
          {/* Background icons */}
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none transition-opacity duration-200">
            <Sun className="w-3 h-3" />
          </span>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#C9B7A5] pointer-events-none transition-opacity duration-200">
            <Moon className="w-3 h-3" />
          </span>

          {/* Sliding Knob */}
          <span
            className={`pointer-events-none inline-flex h-5.5 w-5.5 transform items-center justify-center rounded-full bg-white dark:bg-gradient-to-tr dark:from-[#C9B7A5] dark:to-[#E5D7C9] text-slate-800 dark:text-[#0B162A] shadow-md ring-0 transition duration-300 ease-in-out ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3 h-3 fill-current" />
            ) : (
              <Sun className="w-3 h-3 fill-amber-500 text-amber-500" />
            )}
          </span>
        </button>
      </div>
    );
  }

  // Segmented Dual-Pill Switch (Default)
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const containerPadding = isSm ? 'p-0.5' : isLg ? 'p-1.5' : 'p-1';
  const buttonPadding = isSm
    ? 'px-2 py-0.5 text-[11px]'
    : isLg
    ? 'px-4 py-1.5 text-xs font-bold'
    : 'px-2.5 sm:px-3 py-1 text-xs font-semibold';
  const iconSize = isSm ? 'w-3 h-3' : isLg ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div
      role="radiogroup"
      aria-label="Color Theme Switcher"
      className={`inline-flex items-center rounded-full bg-slate-200/90 dark:bg-[#071329] border border-slate-300/80 dark:border-[#1E3760] shadow-inner select-none transition-colors duration-200 ${containerPadding} ${className}`}
    >
      {/* Light Mode Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDarkMode}
        onClick={() => setTheme('light')}
        title="Switch to White Light Mode"
        className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ease-in-out cursor-pointer ${buttonPadding} ${
          !isDarkMode
            ? 'bg-white text-[#0B162A] shadow-sm border border-slate-200/90 font-bold scale-[1.02]'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Sun
          className={`${iconSize} shrink-0 transition-colors ${
            !isDarkMode ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
          }`}
        />
        {showLabels && <span className="tracking-wide">Light</span>}
      </button>

      {/* Midnight Navy Dark Mode Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isDarkMode}
        onClick={() => setTheme('dark')}
        title="Switch to Midnight Navy Dark Mode"
        className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ease-in-out cursor-pointer ${buttonPadding} ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#0F2347] to-[#152E5A] text-[#C9B7A5] shadow-sm border border-[#23457A] font-bold scale-[1.02]'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        <Moon
          className={`${iconSize} shrink-0 transition-colors ${
            isDarkMode ? 'text-[#C9B7A5] fill-[#C9B7A5]' : 'text-slate-400'
          }`}
        />
        {showLabels && <span className="tracking-wide">Dark</span>}
      </button>
    </div>
  );
};
