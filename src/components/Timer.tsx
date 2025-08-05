interface TimerProps {
  seconds: number;
  className?: string;
}

export function Timer({ seconds, className = '' }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${minutes}:${secs.toString().padStart(2, '0')}`;
  
  const isWarning = seconds < 60;
  const isCritical = seconds < 30;

  // Determine status for accessibility
  const getTimerStatus = () => {
    if (isCritical) return 'Critical - less than 30 seconds remaining';
    if (isWarning) return 'Warning - less than 1 minute remaining';
    return `${minutes} minutes and ${secs} seconds remaining`;
  };

  const getTimerClasses = () => {
    if (isCritical) {
      return 'text-red-600 dark:text-red-400 animate-pulse';
    }
    if (isWarning) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    return 'text-foreground-secondary';
  };

  const getIconClasses = () => {
    const baseClasses = 'w-5 h-5';
    if (isCritical) {
      return `${baseClasses} text-red-600 dark:text-red-400 animate-pulse`;
    }
    if (isWarning) {
      return `${baseClasses} text-yellow-600 dark:text-yellow-400`;
    }
    return `${baseClasses} text-foreground-secondary`;
  };

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      role="timer"
      aria-live={isWarning ? 'polite' : 'off'}
      aria-label={getTimerStatus()}
    >
      <svg className={getIconClasses()} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`font-semibold ${getTimerClasses()}`}>
        {timeString}
      </span>
      {/* Visual status indicators for non-color users */}
      {isCritical && (
        <span className="ml-1 text-red-600 dark:text-red-400 font-bold" aria-hidden="true">
          !
        </span>
      )}
      {isWarning && !isCritical && (
        <span className="ml-1 text-yellow-600 dark:text-yellow-400 font-bold" aria-hidden="true">
          ?
        </span>
      )}
      {/* Screen reader only status */}
      <span className="sr-only">
        {isCritical ? 'Critical time remaining' : isWarning ? 'Low time remaining' : 'Normal time remaining'}
      </span>
    </div>
  );
}