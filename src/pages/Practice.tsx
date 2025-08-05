import { useState } from 'react';
import { getAllChapters, getChapterById, getRandomizedChapterQuestions } from '../utils/questionLoader';
import { QuizEngine } from '../components/QuizEngine';
import { Results } from '../components/Results';
import { useQuizStore } from '../store/quizStore';

export function Practice() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    answers: Record<string, number>;
  } | null>(null);
  
  const { updatePracticeStats, getPracticeChapterStats } = useQuizStore();
  const chapters = getAllChapters();
  
  const handleStartPractice = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setShowResults(false);
    setQuizResults(null);
  };
  
  const handleQuizComplete = (score: number, answers: Record<string, number>, timeSpent: number = 0) => {
    const chapter = getChapterById(selectedChapter!);
    const totalQuestions = chapter?.questions.length || 0;
    
    console.log('🎯 Practice Quiz Complete - handleQuizComplete called with:', {
      selectedChapter: selectedChapter,
      score,
      totalQuestions,
      timeSpent,
      answers: Object.keys(answers).length + ' answers',
      answerKeys: Object.keys(answers),
      scoreValidation: score <= totalQuestions ? '✅ Valid' : '❌ Invalid - score exceeds total'
    });
    
    // Validate inputs before calling updatePracticeStats
    if (selectedChapter === null) {
      console.error('❌ Cannot update stats: selectedChapter is null');
      return;
    }
    
    if (score < 0 || score > totalQuestions) {
      console.error('❌ Invalid score:', { score, totalQuestions });
      return;
    }
    
    if (totalQuestions === 0) {
      console.error('❌ Invalid total questions:', totalQuestions);
      return;
    }
    
    console.log('📊 About to call updatePracticeStats with validated inputs...');
    
    // Update comprehensive practice statistics
    updatePracticeStats(selectedChapter!, score, totalQuestions, timeSpent);
    
    console.log('✅ updatePracticeStats called successfully');
    
    // Check if stats were actually updated after a short delay
    setTimeout(() => {
      const currentStats = getPracticeChapterStats(selectedChapter!);
      console.log('🔍 Stats after update for chapter', selectedChapter, ':', currentStats);
      
      // Additional validation
      if (currentStats) {
        const expectedSuccessRate = Math.round((score / totalQuestions) * 100);
        console.log('🎯 Expected vs Actual Success Rate:', {
          expected: expectedSuccessRate,
          actual: currentStats.successRate,
          match: expectedSuccessRate === currentStats.successRate ? '✅' : '❌'
        });
      } else {
        console.error('❌ No stats found after update!');
      }
    }, 200);
    
    setQuizResults({ score, answers });
    setShowResults(true);
  };
  
  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setShowResults(false);
    setQuizResults(null);
  };
  
  if (showResults && quizResults && selectedChapter) {
    const chapter = getChapterById(selectedChapter);
    return (
      <div>
        <button
          onClick={handleBackToChapters}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Chapters
        </button>
        <Results
          score={quizResults.score}
          totalQuestions={chapter?.questions.length || 0}
          answers={quizResults.answers}
          questions={chapter?.questions || []}
        />
      </div>
    );
  }
  
  if (selectedChapter) {
    const chapter = getChapterById(selectedChapter);
    if (!chapter) {
      return <div>Chapter not found</div>;
    }
    
    // Get randomized questions for the chapter
    const randomizedQuestions = getRandomizedChapterQuestions(selectedChapter);
    
    return (
      <div>
        <button
          onClick={handleBackToChapters}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Chapters
        </button>
        
        <h1 className="text-3xl font-bold mb-2 text-foreground-primary">{chapter.title}</h1>
        <p className="text-foreground-secondary mb-8">Chapter {chapter.chapter} Practice Quiz</p>
        
        <QuizEngine
          questions={randomizedQuestions}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-3 text-foreground-primary animate-slide-up">Practice Mode</h1>
      <p className="text-foreground-secondary mb-10 text-lg animate-slide-up animation-delay-100">Select a chapter to start practicing</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
        {chapters.map((chapter, index) => {
          const stats = getPracticeChapterStats(chapter.chapter);
          const isCompleted = stats && stats.successRate >= 70;
          const lastScore = stats?.successRate || 0;
          
          return (
            <button
              key={chapter.chapter}
              onClick={() => handleStartPractice(chapter.chapter)}
              className={`group relative bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-8 card-hover text-left overflow-hidden border border-gray-200-50 dark:border-gray-700-50 animate-slide-up animation-delay-${index}00 hover:animate-lift active:animate-micro-bounce transition-all duration-300 tap-highlight`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br bg-linear-from-blue-400-10 bg-linear-to-purple-600-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-foreground-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Chapter {chapter.chapter}
                  </h3>
                  {isCompleted && (
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md animate-bounce-in">
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
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            lastScore >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          }`}
                          style={{ width: `${lastScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground-primary">{lastScore}%</span>
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