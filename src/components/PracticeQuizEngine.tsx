import { useState, useEffect, useCallback } from 'react';
import { Question } from './Question';
import type { Question as QuestionType, QuizState } from '../types/quiz.types';
import { useQuizStore } from '../store/quizStore';

interface PracticeQuizEngineProps {
  questions: QuestionType[];
  chapterId: number;
  onComplete: (score: number, answers: Record<string, number>, timeSpent?: number) => void;
  onExit: () => void;
}

export function PracticeQuizEngine({ questions, chapterId, onComplete, onExit }: PracticeQuizEngineProps) {
  const { updatePracticeStats } = useQuizStore();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    startTime: new Date(),
    endTime: null,
  });

  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    startTime: new Date(),
  });

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;

  // Save progress incrementally after each question
  const saveIncrementalProgress = useCallback(() => {
    const currentTime = new Date();
    const timeSpent = Math.floor((currentTime.getTime() - sessionStats.startTime.getTime()) / 1000);
    
    // Save progress incrementally
    
    // Update stats in the store
    updatePracticeStats(chapterId, sessionStats.correctAnswers, sessionStats.questionsAnswered, timeSpent);
  }, [chapterId, sessionStats, updatePracticeStats]);

  // Save progress when user exits
  const handleExit = useCallback(() => {
    if (sessionStats.questionsAnswered > 0) {
      saveIncrementalProgress();
    }
    onExit();
  }, [sessionStats.questionsAnswered, saveIncrementalProgress, onExit]);

  const handleCompleteQuiz = useCallback((finalState?: QuizState) => {
    const endTime = new Date();
    const stateToUse = finalState || quizState;
    const timeSpent = stateToUse.startTime ? Math.floor((endTime.getTime() - stateToUse.startTime.getTime()) / 1000) : 0;
    
    // Complete quiz with final stats
    
    setQuizState(prev => ({
      ...prev,
      endTime,
    }));
    
    // Final save is handled by onComplete
    onComplete(stateToUse.score, stateToUse.answers, timeSpent);
  }, [onComplete, quizState]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: selectedAnswer,
      },
    }));

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));

    setShowResult(true);
  };

  const handleNext = () => {
    // Save progress after each question
    saveIncrementalProgress();
    
    if (isLastQuestion) {
      setQuizState(prev => {
        const finalState = { ...prev };
        handleCompleteQuiz(finalState);
        return prev;
      });
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setShowResult(false);
    }
  };

  // Calculate elapsed time
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - sessionStats.startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStats.startTime]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4 sm:px-0">
      {/* Progress and Timer Bar */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 animate-slide-down">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br bg-linear-from-blue-500 bg-linear-to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
              {quizState.currentQuestionIndex + 1}
            </div>
            <div>
              <div className="text-xs sm:text-sm text-foreground-tertiary font-medium">Practice Progress</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-foreground-primary">
                Question {quizState.currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base bg-background-secondary dark:bg-surface-primary-50">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-foreground-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-bold text-foreground-primary">
                {formatTime(elapsedTime)}
              </div>
            </div>
            <button
              onClick={handleExit}
              className="text-sm text-foreground-secondary hover:text-foreground-primary transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-border-primary dark:bg-surface-elevated rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600"
              style={{ 
                width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%`
              }}
            >
              <div className="absolute inset-0 bg-white-20 animate-shimmer"></div>
            </div>
          </div>
          <div className="absolute -top-1 transition-all duration-500"
               style={{ left: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}>
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg border-2 border-purple-600 -ml-2 sm:-ml-2.5 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-2 text-xs text-foreground-tertiary text-center">
          Progress is saved automatically after each question
        </div>
      </div>

      {/* Question */}
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        showResult={showResult}
      />

      {/* Navigation */}
      {showResult && (
        <div className="mt-4 sm:mt-6 md:mt-8 text-center animate-fade-in">
          <button
            onClick={handleNext}
            className="group btn-primary px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden btn-3d tap-highlight active:animate-micro-bounce"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLastQuestion ? 'Complete Practice' : 'Next Question'}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isLastQuestion ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white-20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      )}
    </div>
  );
}