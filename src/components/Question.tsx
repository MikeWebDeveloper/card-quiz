import type { Question as QuestionType } from '../types/quiz.types';
import { useState, useEffect } from 'react';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (selectedAnswer: number) => void;
  showResult?: boolean;
  userAnswer?: number;
}

export function Question({ question, onAnswer, showResult = false }: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset selected option when question changes (new question loads)
  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleOptionClick = (index: number) => {
    if (!showResult) {
      setSelectedOption(index);
      onAnswer(index);
    }
  };

  const getOptionClass = (index: number) => {
    const baseClass = "w-full text-left p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform min-h-[80px] sm:min-h-[90px] md:min-h-[100px] flex items-center ";
    
    if (!showResult) {
      return baseClass + (selectedOption === index 
        ? "border-brand-primary dark:border-brand-primary bg-linear-to-r bg-linear-from-blue-50 bg-linear-to-blue-100 dark:bg-linear-from-blue-900-20 dark:bg-linear-to-blue-800-30 shadow-lg scale-[1.02]" 
        : "border-border-primary dark:border-border-secondary hover:border-brand-primary-50 dark:hover:border-brand-primary-50 hover:bg-linear-to-r hover:bg-linear-from-background-secondary hover:bg-linear-to-blue-50 dark:hover:bg-linear-from-surface-elevated-30 dark:hover:bg-linear-to-blue-900-20 hover:shadow-md hover:scale-[1.01]");
    }
    
    // Show results
    if (index === question.correct) {
      return baseClass + "border-green-500 dark:border-green-400 bg-linear-to-r bg-linear-from-green-50 bg-linear-to-green-100 dark:bg-linear-from-green-900-20 dark:bg-linear-to-green-800-30 shadow-lg animate-pulse-slow";
    }
    if (selectedOption === index && index !== question.correct) {
      return baseClass + "border-red-500 dark:border-red-400 bg-linear-to-r bg-linear-from-red-50 bg-linear-to-red-100 dark:bg-linear-from-red-900-20 dark:bg-linear-to-red-800-30 shadow-lg animate-shake";
    }
    return baseClass + "border-border-primary dark:border-border-secondary bg-background-secondary dark:bg-surface-primary-50 opacity-60";
  };
  
  const getIconForOption = (index: number) => {
    switch(index) {
      case 0: // A - Circle with pulse
        return (
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mr-3 sm:mr-4 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-linear-to-br bg-linear-from-blue-400 bg-linear-to-blue-600 dark:bg-linear-from-blue-500 dark:bg-linear-to-blue-700 animate-pulse opacity-30"></div>
            <div className="relative w-full h-full rounded-full bg-linear-to-br bg-linear-from-blue-500 bg-linear-to-blue-600 dark:bg-linear-from-blue-600 dark:bg-linear-to-blue-700 flex items-center justify-center shadow-lg animate-float">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg">A</span>
            </div>
          </div>
        );
      case 1: // B - Diamond with spin
        return (
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mr-3 sm:mr-4 flex-shrink-0">
            <div className="absolute inset-0 transform rotate-45 bg-linear-to-br bg-linear-from-green-400 bg-linear-to-green-600 dark:bg-linear-from-green-500 dark:bg-linear-to-green-700 animate-spin-slow opacity-30"></div>
            <div className="relative w-full h-full transform rotate-45 bg-linear-to-br bg-linear-from-green-500 bg-linear-to-green-600 dark:bg-linear-from-green-600 dark:bg-linear-to-green-700 flex items-center justify-center shadow-lg hover:animate-spin-slow">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg transform -rotate-45">B</span>
            </div>
          </div>
        );
      case 2: // C - Hexagon with bounce
        return (
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mr-3 sm:mr-4 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-bounce-slow">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-purple-500 dark:text-purple-600" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-600 dark:text-purple-700" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="url(#hexGradient)" className="drop-shadow-lg" />
              <text x="50" y="58" textAnchor="middle" className="fill-white font-bold" style={{fontSize: '24px'}}>C</text>
            </svg>
          </div>
        );
      case 3: // D - Star with twinkle
        return (
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mr-3 sm:mr-4 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-glow">
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-orange-500 dark:text-orange-600" stopColor="currentColor" />
                  <stop offset="100%" className="text-orange-600 dark:text-orange-700" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <path d="M50,5 L61,39 L95,39 L68,61 L79,95 L50,73 L21,95 L32,61 L5,39 L39,39 Z" fill="url(#starGradient)" className="drop-shadow-lg" />
              <text x="50" y="58" textAnchor="middle" className="fill-white font-bold" style={{fontSize: '20px'}}>D</text>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4 sm:px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 card-3d">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-foreground-primary animate-slide-up">{question.question}</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={getOptionClass(index) + ` animate-slide-up animation-delay-${index}00 tap-highlight active:animate-micro-bounce`}
              disabled={showResult}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              aria-describedby={showResult && index === question.correct ? `correct-${index}` : undefined}
            >
              {getIconForOption(index)}
              <span className="text-sm sm:text-base md:text-lg text-foreground-primary flex-1">{option}</span>
              {showResult && index === question.correct && (
                <>
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 ml-4 animate-bounce-in flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span id={`correct-${index}`} className="sr-only">This is the correct answer</span>
                </>
              )}
              {showResult && selectedOption === index && index !== question.correct && (
                <>
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400 ml-4 animate-bounce-in flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">This was your incorrect answer</span>
                </>
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <div 
            className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-linear-to-br bg-linear-from-blue-50 bg-linear-to-indigo-100 dark:bg-linear-from-blue-900-20 dark:bg-linear-to-indigo-900-30 rounded-xl border border-blue-200 dark:border-blue-700-50 animate-scale-in"
            role="region"
            aria-labelledby="explanation-heading"
          >
            <p id="explanation-heading" className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explanation
            </p>
            <p className="text-sm sm:text-base text-blue-800 dark:text-blue-300 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}