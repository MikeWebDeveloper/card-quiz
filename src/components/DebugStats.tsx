import { useQuizStore } from '../store/quizStore';
import { useEffect } from 'react';

export function DebugStats() {
  const { userStats, updatePracticeStats } = useQuizStore();
  
  // Force re-render when stats change
  useEffect(() => {
    console.log('🔄 DebugStats re-rendered with stats:', userStats.practice);
  }, [userStats.practice]);

  const triggerTestUpdate = () => {
    console.log('🧪 Triggering test practice update...');
    // Simulate completing 5 questions with 4 correct in chapter 1
    updatePracticeStats(1, 4, 5, 120);
  };

  const clearLocalStorage = () => {
    console.log('🗑️ Clearing localStorage...');
    localStorage.removeItem('quiz-storage');
    window.location.reload();
  };

  const checkLocalStorage = () => {
    const stored = localStorage.getItem('quiz-storage');
    console.log('📦 Current localStorage:', stored ? JSON.parse(stored) : 'Empty');
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-surface-primary border border-border-primary rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2 text-sm">Debug Panel</h3>
      
      <div className="text-xs space-y-1 mb-3">
        <p>Practice: {userStats.practice?.totalQuestionsAttempted || 0} questions</p>
        <p>Correct: {userStats.practice?.totalCorrectAnswers || 0}</p>
        <p>Chapters: {Object.keys(userStats.practice?.chapterStats || {}).length}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={triggerTestUpdate}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Test Update Ch1
        </button>
        
        <button
          onClick={checkLocalStorage}
          className="w-full px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
        >
          Check Storage
        </button>
        
        <button
          onClick={clearLocalStorage}
          className="w-full px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
}