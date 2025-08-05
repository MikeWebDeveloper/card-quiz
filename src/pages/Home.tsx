import { Link } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';

export function Home() {
  const userStats = useQuizStore((state) => state.userStats);
  
  // Combine legacy and new stats for backward compatibility with proper null checks
  const totalQuestions = (userStats.totalQuestionsAnswered || 0) + 
    (userStats.practice?.totalQuestionsAttempted || 0);
  const totalCorrect = (userStats.correctAnswers || 0) + 
    (userStats.practice?.totalCorrectAnswers || 0);
  const overallPercentage = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 animate-slide-up">
          <span className="gradient-text">IT Essential 7.0</span>
          <span className="text-foreground-primary block mt-2">Exam Preparation</span>
        </h1>
        <p className="text-xl text-foreground-secondary animate-slide-up animation-delay-200">
          Master the Cisco IT Essentials certification with interactive quizzes and practice exams
        </p>
      </div>

      {/* Quick Stats */}
      {totalQuestions > 0 && (
        <div className="glass rounded-2xl p-8 mb-10 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 text-foreground-primary">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-linear-to-br bg-linear-from-blue-50 bg-linear-to-blue-100-50 dark:bg-linear-from-blue-900-20 dark:bg-linear-to-blue-800-30 border border-blue-200-30 dark:border-blue-700-30 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 animate-bounce-in transition-number">
                {totalQuestions}
              </div>
              <div className="text-foreground-secondary font-medium">Questions Answered</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-linear-to-br bg-linear-from-green-50 bg-linear-to-green-100-50 dark:bg-linear-from-green-900-20 dark:bg-linear-to-green-800-30 border border-green-200-30 dark:border-green-700-30 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2 animate-bounce-in animation-delay-100 transition-number">
                {totalCorrect}
              </div>
              <div className="text-foreground-secondary font-medium">Correct Answers</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-linear-to-br bg-linear-from-purple-50 bg-linear-to-purple-100-50 dark:bg-linear-from-purple-900-20 dark:bg-linear-to-purple-800-30 border border-purple-200-30 dark:border-purple-700-30 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 animate-bounce-in animation-delay-200 transition-number">
                {overallPercentage}%
              </div>
              <div className="text-foreground-secondary font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Study Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        <Link to="/practice" className="group h-full">
          <div className="relative glass rounded-2xl p-8 card-hover overflow-hidden hover:animate-lift active:animate-micro-bounce transition-all duration-300 h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br bg-linear-from-blue-400-10 bg-linear-to-blue-600-10 dark:bg-linear-from-blue-400-5 dark:bg-linear-to-blue-600-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-linear-to-br bg-linear-from-blue-500 bg-linear-to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow dark:group-hover:shadow-glow-dark transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Practice Mode
              </h3>
              <p className="text-foreground-secondary leading-relaxed flex-grow">
                Study individual chapters at your own pace with instant feedback
              </p>
            </div>
          </div>
        </Link>

        <Link to="/exam" className="group h-full">
          <div className="relative glass rounded-2xl p-8 card-hover overflow-hidden hover:animate-lift active:animate-micro-bounce transition-all duration-300 h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br bg-linear-from-green-400-10 bg-linear-to-green-600-10 dark:bg-linear-from-green-400-5 dark:bg-linear-to-green-600-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-linear-to-br bg-linear-from-green-500 bg-linear-to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow dark:group-hover:shadow-glow-dark transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground-primary group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Exam Mode
              </h3>
              <p className="text-foreground-secondary leading-relaxed flex-grow">
                Take checkpoint or final exams under timed conditions
              </p>
            </div>
          </div>
        </Link>

        <Link to="/stats" className="group h-full">
          <div className="relative glass rounded-2xl p-8 card-hover overflow-hidden hover:animate-lift active:animate-micro-bounce transition-all duration-300 h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br bg-linear-from-purple-400-10 bg-linear-to-purple-600-10 dark:bg-linear-from-purple-400-5 dark:bg-linear-to-purple-600-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col h-full">
              <div className="w-16 h-16 bg-linear-to-br bg-linear-from-purple-500 bg-linear-to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow dark:group-hover:shadow-glow-dark transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground-primary group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Statistics
              </h3>
              <p className="text-foreground-secondary leading-relaxed flex-grow">
                Track your progress and identify areas for improvement
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Course Overview */}
      <div className="mt-12 glass rounded-2xl p-10 animate-slide-up">
        <h2 className="text-3xl font-bold mb-6 text-foreground-primary">Course Overview</h2>
        <p className="text-foreground-secondary mb-8 text-lg">
          The IT Essentials 7.0 course covers 14 comprehensive chapters:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-linear-to-br bg-linear-from-blue-50-50 bg-linear-to-purple-50-50 dark:bg-linear-from-blue-900-10 dark:bg-linear-to-purple-900-10 border border-blue-200-20 dark:border-blue-700-20">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 1-4: Hardware & Safety</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 5-6: Operating Systems</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 7-8: Networking</span>
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-linear-to-br bg-linear-from-purple-50-50 bg-linear-to-pink-50-50 dark:bg-linear-from-purple-900-10 dark:bg-linear-to-pink-900-10 border border-purple-200-20 dark:border-purple-700-20">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 10-11: Security</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 12-13: Troubleshooting</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="text-foreground-secondary font-medium">Chapter 14: Professional Skills</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}