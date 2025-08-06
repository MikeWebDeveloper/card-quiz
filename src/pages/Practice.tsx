import { useState, useEffect } from 'react';
import { getAllChapters, getChapterById, getRandomizedChapterQuestions } from '../utils/questionLoader';
import { PracticeQuizEngine } from '../components/PracticeQuizEngine';
import { Results } from '../components/Results';
import { useQuizStore } from '../store/quizStore';
import { Loading } from '../components/Loading';
import type { Chapter, Question } from '../types/quiz.types';

export function Practice() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    answers: Record<string, number>;
  } | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [chapterQuestions, setChapterQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  const { updatePracticeStats, getPracticeChapterStats } = useQuizStore();

  // Load all chapters on component mount
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const allChapters = await getAllChapters();
        setChapters(allChapters);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);
  
  const handleStartPractice = async (chapterId: number) => {
    try {
      setLoadingQuestions(true);
      setSelectedChapter(chapterId);
      setShowResults(false);
      setQuizResults(null);
      
      // Load chapter and questions asynchronously
      const [chapter, questions] = await Promise.all([
        getChapterById(chapterId),
        getRandomizedChapterQuestions(chapterId)
      ]);
      
      setCurrentChapter(chapter || null);
      setChapterQuestions(questions);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };
  
  const handleQuizComplete = (score: number, answers: Record<string, number>, timeSpent: number = 0) => {
    const totalQuestions = currentChapter?.questions.length || 0;
    
    // Update comprehensive practice statistics
    updatePracticeStats(selectedChapter!, score, totalQuestions, timeSpent);
    
    setQuizResults({ score, answers });
    setShowResults(true);
  };
  
  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setShowResults(false);
    setQuizResults(null);
    setCurrentChapter(null);
    setChapterQuestions([]);
  };

  // Show loading state
  if (loading) {
    return <Loading />;
  }
  
  if (showResults && quizResults && currentChapter) {
    return (
      <div role="main" aria-labelledby="results-heading">
        <button
          onClick={handleBackToChapters}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
          aria-label="Return to chapter selection"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Chapters
        </button>
        <Results
          score={quizResults.score}
          totalQuestions={currentChapter.questions.length}
          answers={quizResults.answers}
          questions={currentChapter.questions}
        />
      </div>
    );
  }
  
  if (selectedChapter) {
    if (loadingQuestions) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64">
          <Loading />
          <p className="mt-4 text-foreground-secondary">Loading chapter questions...</p>
        </div>
      );
    }
    
    if (!currentChapter) {
      return (
        <div className="text-center py-12" role="alert">
          <p className="text-foreground-primary">Chapter not found</p>
          <button
            onClick={handleBackToChapters}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
          >
            Return to chapter selection
          </button>
        </div>
      );
    }
    
    return (
      <div role="main" aria-labelledby="chapter-heading">
        <h1 id="chapter-heading" className="text-3xl font-bold mb-2 text-foreground-primary">
          {currentChapter.title}
        </h1>
        <p className="text-foreground-secondary mb-8">Chapter {currentChapter.chapter} Practice Quiz</p>
        
        <PracticeQuizEngine
          questions={chapterQuestions}
          chapterId={selectedChapter}
          onComplete={handleQuizComplete}
          onExit={handleBackToChapters}
        />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in" role="main" aria-labelledby="practice-heading">
      <h1 id="practice-heading" className="text-4xl font-bold mb-3 text-foreground-primary animate-slide-up">
        Practice Mode
      </h1>
      <p className="text-foreground-secondary mb-10 text-lg animate-slide-up animation-delay-100">
        Select a chapter to start practicing
      </p>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children"
        role="list"
        aria-label="Available practice chapters"
      >
        {chapters.map((chapter, index) => {
          const stats = getPracticeChapterStats(chapter.chapter);
          const isCompleted = stats && stats.successRate >= 70;
          const lastScore = stats?.successRate || 0;
          
          return (
            <button
              key={chapter.chapter}
              onClick={() => handleStartPractice(chapter.chapter)}
              className={`group relative bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-8 card-hover text-left overflow-hidden border border-gray-200-50 dark:border-gray-700-50 animate-slide-up animation-delay-${index}00 hover:animate-lift active:animate-micro-bounce transition-all duration-300 tap-highlight focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none`}
              role="listitem"
              aria-label={`Chapter ${chapter.chapter}: ${chapter.title}. ${chapter.questions.length} questions available. ${
                stats ? `Last score: ${lastScore}%. ${isCompleted ? 'Completed with passing score.' : 'Not yet completed.'}` : 'Not yet attempted.'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br bg-linear-from-blue-400-10 bg-linear-to-purple-600-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-foreground-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Chapter {chapter.chapter}
                  </h3>
                  {isCompleted && (
                    <span 
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md animate-bounce-in"
                      aria-label={`Chapter completed with ${lastScore}% score`}
                    >
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-foreground-secondary mb-6 text-lg">{chapter.title}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground-secondary bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {chapter.questions.length} questions
                  </span>
                  {stats && (
                    <div className="flex items-center gap-2" aria-label={`Progress: ${lastScore}% score`}>
                      <div 
                        className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={lastScore}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Chapter progress: ${lastScore}%`}
                      >
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            lastScore >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          }`}
                          style={{ width: `${lastScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground-primary" aria-hidden="true">{lastScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {chapters.length < 14 && (
        <div className="mt-10 p-6 glass rounded-2xl border border-blue-200-20 animate-slide-up">
          <p className="text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Note: This is a demo with {chapters.length} chapters. The full course includes 14 chapters.
          </p>
        </div>
      )}
    </div>
  );
}