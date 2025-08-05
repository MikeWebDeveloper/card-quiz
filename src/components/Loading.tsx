export function Loading() {
  return (
    <div 
      className="fixed inset-0 bg-background-primary flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-border-primary rounded-full animate-spin" aria-hidden="true"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-brand-primary rounded-full animate-spin" aria-hidden="true"></div>
        </div>
        <p className="mt-4 text-foreground-secondary font-medium animate-pulse">Loading...</p>
        <span className="sr-only">Please wait while content is loading</span>
      </div>
    </div>
  );
}

export function QuestionLoading() {
  return (
    <div 
      className="max-w-3xl mx-auto animate-fade-in px-4 sm:px-0"
      role="status"
      aria-live="polite"
      aria-label="Loading question"
    >
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="h-6 md:h-8 bg-surface-secondary rounded-lg w-3/4 mb-6 md:mb-8 animate-pulse" aria-hidden="true"></div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 md:h-20 bg-surface-secondary rounded-xl animate-pulse" aria-hidden="true"></div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading quiz question and answer options</span>
    </div>
  );
}