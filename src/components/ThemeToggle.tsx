import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setShowOptions(false);
  };

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (resolvedTheme === 'dark') {
      return (
        <svg className="w-5 h-5 transition-transform duration-300 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5 transition-transform duration-300 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  return (
    <div className="relative">
      {/* Simple toggle button for mobile/quick access */}
      <button
        onClick={toggleTheme}
        className="md:hidden p-2 rounded-xl bg-surface-primary-80 backdrop-blur-sm 
                   border border-border-primary-50 
                   text-foreground-secondary 
                   hover:bg-surface-primary 
                   hover:border-border-secondary
                   hover:text-brand-primary
                   transition-all duration-300 hover:scale-110 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-brand-primary/20
                   active:animate-micro-bounce tap-highlight"
        aria-label="Toggle theme"
      >
        {getIcon()}
      </button>

      {/* Dropdown for desktop */}
      <div className="hidden md:block">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-2 p-2.5 rounded-xl 
                     bg-surface-primary-80 backdrop-blur-sm 
                     border border-border-primary-50 
                     text-foreground-secondary 
                     hover:bg-surface-primary 
                     hover:border-border-secondary
                     hover:text-brand-primary
                     transition-all duration-300 hover:scale-105 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-brand-primary-20"
          aria-label="Theme options"
        >
          {getIcon()}
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${showOptions ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showOptions && (
          <div className="absolute right-0 top-full mt-2 w-48 
                          bg-surface-primary-95 dark:bg-surface-secondary-95 backdrop-blur-lg 
                          border border-border-primary-50 dark:border-border-primary-50 
                          rounded-xl shadow-xl overflow-hidden z-50
                          animate-slide-down">
            <div className="p-1">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                           transition-all duration-200 hover:bg-background-secondary dark:hover:bg-surface-elevated-50
                           ${theme === 'light' ? 'bg-brand-primary-10 dark:bg-brand-primary-20 text-brand-primary dark:text-brand-primary' : 'text-foreground-secondary dark:text-foreground-secondary'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                           transition-all duration-200 hover:bg-background-secondary dark:hover:bg-surface-elevated-50
                           ${theme === 'dark' ? 'bg-brand-primary-10 dark:bg-brand-primary-20 text-brand-primary dark:text-brand-primary' : 'text-foreground-secondary dark:text-foreground-secondary'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </button>
              
              <button
                onClick={() => handleThemeChange('system')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                           transition-all duration-200 hover:bg-background-secondary dark:hover:bg-surface-elevated-50
                           ${theme === 'system' ? 'bg-brand-primary-10 dark:bg-brand-primary-20 text-brand-primary dark:text-brand-primary' : 'text-foreground-secondary dark:text-foreground-secondary'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                System
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile dropdown */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-40 bg-black-20 dark:bg-black-40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" 
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}