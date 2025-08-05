import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

export function Header() {
  return (
    <header className="glass border-b border-border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br bg-linear-from-blue-500 bg-linear-to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow dark:group-hover:shadow-glow-dark transition-all duration-300 group-hover:scale-110 animate-float">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-bold text-foreground-primary group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors hidden sm:block">
              IT Essential 7.0 Quiz
            </span>
            <span className="text-base font-bold text-foreground-primary group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors sm:hidden">
              IT Essential
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <nav>
              <ul className="flex space-x-1 sm:space-x-2">
                <li>
                  <Link 
                    to="/practice" 
                    className="group px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-foreground-secondary hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary-10 dark:hover:bg-brand-primary-20 transition-all duration-300 flex items-center gap-1 sm:gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="hidden sm:inline">Practice</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/exam" 
                    className="group px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-foreground-secondary hover:text-green-500 dark:hover:text-green-400 hover:bg-green-500-10 dark:hover:bg-green-400-20 transition-all duration-300 flex items-center gap-1 sm:gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Exam Mode</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/stats" 
                    className="group px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-foreground-secondary hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500-10 dark:hover:bg-purple-400-20 transition-all duration-300 flex items-center gap-1 sm:gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden sm:inline">Statistics</span>
                  </Link>
                </li>
              </ul>
            </nav>
            
            <div className="border-l border-border-primary dark:border-border-secondary pl-2 sm:pl-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}