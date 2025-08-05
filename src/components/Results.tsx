import type { Question } from '../types/quiz.types';
import { useNavigate } from 'react-router-dom';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  questions: Question[];
  timeSpent?: number; // in seconds
}

export function Results({ score, totalQuestions, answers, questions, timeSpent }: ResultsProps) {
  const navigate = useNavigate();
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground-primary animate-slide-up">
          Quiz Completed!
        </h1>
        
        {/* Score Summary */}
        <div className={`text-center p-6 rounded-xl mb-6 border-2 animate-scale-in ${
          passed 
            ? 'bg-linear-to-br bg-linear-from-green-50 bg-linear-to-green-100-50 dark:bg-linear-from-green-900-20 dark:bg-linear-to-green-800-30 border-green-200 dark:border-green-700' 
            : 'bg-linear-to-br bg-linear-from-red-50 bg-linear-to-red-100 dark:bg-linear-from-red-900-20 dark:bg-linear-to-red-800-30 border-red-200 dark:border-red-700'
        }`}>
          <div className={`text-5xl md:text-6xl font-bold mb-2 ${
            passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {percentage}%
          </div>
          <div className="text-lg md:text-xl text-foreground-secondary">
            {score} out of {totalQuestions} correct
          </div>
          {timeSpent && (
            <div className="text-foreground-tertiary mt-2">
              Time spent: {formatTime(timeSpent)}
            </div>
          )}
          <div className={`mt-4 text-lg font-semibold flex items-center justify-center gap-2 ${
            passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {passed ? (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Congratulations! You passed!
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.292-1.879 1.213-3.029l-6.928-7.386a1.375 1.375 0 00-2.012 0l-6.928 7.386C-0.737 16.121.016 18 1.556 18z" />
                </svg>
                Keep practicing!
              </>
            )}
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground-primary">Review Your Answers</h2>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={question.id} className="glass rounded-xl p-4 border border-border-primary">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      isCorrect 
                        ? 'bg-green-500 dark:bg-green-600' 
                        : 'bg-red-500 dark:bg-red-600'
                    }`}
                    aria-label={isCorrect ? 'Correct answer' : 'Incorrect answer'}
                    >
                      {isCorrect ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2 text-foreground-primary">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm text-foreground-secondary">
                        Your answer: <span className={`font-medium ${
                          isCorrect 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {question.options[userAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-foreground-secondary">
                          Correct answer: <span className="font-medium text-green-700 dark:text-green-300">
                            {question.options[question.correct]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-surface-secondary text-foreground-secondary rounded-xl border border-border-primary hover:bg-surface-elevated hover:border-border-secondary hover:text-foreground-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}