import { useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { getAllChapters } from '../utils/questionLoader';

export function Statistics() {
  const { userStats, resetStats } = useQuizStore();
  const chapters = getAllChapters();
  const [activeTab, setActiveTab] = useState<'practice' | 'exam'>('practice');
  
  // Debug logging
  console.log('📈 Statistics component rendering with userStats:', JSON.parse(JSON.stringify(userStats)));
  console.log('📊 Practice stats:', JSON.parse(JSON.stringify(userStats.practice || {})));
  console.log('🎯 Chapter stats keys:', Object.keys(userStats.practice?.chapterStats || {}));
  
  // Check localStorage directly
  try {
    const localStorageData = localStorage.getItem('quiz-storage');
    console.log('💾 Raw localStorage data:', localStorageData);
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      console.log('🔍 Parsed localStorage data:', parsedData);
      console.log('📊 localStorage practice stats:', parsedData.state?.userStats?.practice);
    }
  } catch (error) {
    console.error('❌ Error reading localStorage:', error);
  }
  
  // Practice Mode Statistics with null checks
  const practiceStats = userStats.practice || { totalQuestionsAttempted: 0, totalCorrectAnswers: 0, totalTimeSpent: 0, chapterStats: {} };
  const practiceSuccessRate = practiceStats.totalQuestionsAttempted > 0
    ? Math.round((practiceStats.totalCorrectAnswers / practiceStats.totalQuestionsAttempted) * 100)
    : 0;
  
  const attemptedPracticeChapters = Object.keys(practiceStats.chapterStats || {}).length;
  const averagePracticeTimePerQuestion = practiceStats.totalQuestionsAttempted > 0
    ? Math.round(practiceStats.totalTimeSpent / practiceStats.totalQuestionsAttempted)
    : 0;
  
  const strongPracticeChapters = Object.values(practiceStats.chapterStats || {}).filter(ch => ch.successRate >= 70).length;
  const weakPracticeChapters = Object.values(practiceStats.chapterStats || {}).filter(ch => ch.successRate > 0 && ch.successRate < 70).length;
  
  // Exam Mode Statistics with null checks
  const examStats = userStats.exam || { totalExams: 0, examsPassed: 0, examsFailed: 0, averageScore: 0, checkpointStats: {} };
  const examPassRate = examStats.totalExams > 0
    ? Math.round((examStats.examsPassed / examStats.totalExams) * 100)
    : 0;
  
  const attemptedExams = Object.keys(examStats.checkpointStats || {}).length;
  const passedExams = Object.values(examStats.checkpointStats || {}).filter(exam => exam.passed).length;
  
  // Format time helper
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };
  
  // Format large numbers helper
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };
  
  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      resetStats();
    }
  };
  
  const handleDebugStats = () => {
    console.log('🔧 Debug Stats - Current userStats:', JSON.parse(JSON.stringify(userStats)));
    
    // Check localStorage directly
    try {
      const localStorageData = localStorage.getItem('quiz-storage');
      console.log('🔧 Debug Stats - Raw localStorage:', localStorageData);
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        console.log('🔧 Debug Stats - Parsed localStorage:', parsedData);
      }
    } catch (error) {
      console.error('🔧 Debug Stats - localStorage error:', error);
    }
    
    // Also manually check each chapter's stats
    chapters.forEach(chapter => {
      const stats = userStats.practice?.chapterStats?.[chapter.chapter];
      console.log(`🔧 Debug Stats - Chapter ${chapter.chapter}:`, stats);
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground-primary animate-slide-up">Your Statistics</h1>
          <p className="text-foreground-secondary animate-slide-up animation-delay-100">Track your learning progress across Practice and Exam modes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDebugStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Debug Stats
          </button>
          <button
            onClick={handleResetStats}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Reset All Stats
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-surface-primary rounded-xl p-1 mb-8 shadow-lg dark:shadow-xl animate-slide-up">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-foreground-secondary hover:text-foreground-primary hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Practice Mode
        </button>
        <button
          onClick={() => setActiveTab('exam')}
          className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'exam'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-foreground-secondary hover:text-foreground-primary hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Exam Mode
        </button>
      </div>

      {/* Practice Mode View */}
      {activeTab === 'practice' && (
        <div className="space-y-8">
          {/* Practice Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in">{practiceStats.totalQuestionsAttempted}</div>
              <div className="text-foreground-secondary">Questions Attempted</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-green-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-100">{practiceStats.totalCorrectAnswers}</div>
              <div className="text-foreground-secondary">Correct Answers</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-purple-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-200">{practiceSuccessRate}%</div>
              <div className="text-foreground-secondary">Success Rate</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-orange-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-300">{formatTimeSpent(practiceStats.totalTimeSpent)}</div>
              <div className="text-foreground-secondary">Time Spent</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-teal-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-400">{attemptedPracticeChapters}/{chapters.length}</div>
              <div className="text-foreground-secondary">Chapters</div>
            </div>
          </div>

          {/* Chapter Breakdown */}
          <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50">
            <h2 className="text-2xl font-semibold mb-6 text-foreground-primary">Practice Progress by Chapter</h2>
            
            {chapters.length === 0 ? (
              <p className="text-foreground-secondary">No chapters available yet.</p>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => {
                  const chapterStats = practiceStats.chapterStats[chapter.chapter];
                  const questionsInChapter = chapter.questions.length;
                  
                  return (
                    <div key={chapter.chapter} className="glass rounded-xl p-5 border border-gray-200-50 dark:border-gray-700-50 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground-primary text-lg mb-2">
                            Chapter {chapter.chapter}: {chapter.title}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-1 text-foreground-tertiary">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {questionsInChapter} available
                            </div>
                            {chapterStats && (
                              <>
                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                  {chapterStats.questionsAttempted} attempted
                                </div>
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {chapterStats.correctAnswers} correct
                                </div>
                                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatTime(chapterStats.averageTimePerQuestion)}/q
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {chapterStats && (
                            <>
                              <div className="text-2xl font-bold text-foreground-primary mb-1">
                                {chapterStats.questionsAttempted}/{questionsInChapter}
                              </div>
                              <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mb-2 ${
                                chapterStats.successRate >= 70 
                                  ? 'bg-green-100 dark:bg-green-900-30 text-green-700 dark:text-green-300' 
                                  : chapterStats.successRate > 0 
                                    ? 'bg-yellow-100 dark:bg-yellow-900-30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {chapterStats.successRate}% success rate
                              </div>
                              <div className="text-xs text-foreground-tertiary">
                                Best: {chapterStats.bestScore}% • {chapterStats.attempts} attempts
                              </div>
                            </>
                          )}
                          {!chapterStats && (
                            <>
                              <div className="text-2xl font-bold text-foreground-primary mb-1">
                                0/{questionsInChapter}
                              </div>
                              <div className="text-xs font-medium px-2 py-1 rounded-full inline-block mb-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                0% success rate
                              </div>
                              <div className="text-xs text-foreground-tertiary">
                                Not Started
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                            chapterStats && chapterStats.successRate >= 70 
                              ? 'bg-gradient-to-r from-green-500 to-green-600' 
                              : chapterStats && chapterStats.successRate > 0 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                                : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          style={{ width: `${chapterStats?.successRate || 0}%` }}
                        >
                          {chapterStats && chapterStats.successRate > 0 && (
                            <div className="absolute inset-0 bg-white-20 animate-shimmer"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Practice Performance Summary */}
            {attemptedPracticeChapters > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-foreground-primary mb-4">Practice Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800-50">
                    <div className="text-2xl font-bold text-foreground-primary">{formatTime(averagePracticeTimePerQuestion)}</div>
                    <div className="text-sm text-foreground-secondary">Avg Time/Question</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900-20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{practiceSuccessRate}%</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Overall Success Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900-20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{strongPracticeChapters}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Mastered Chapters</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900-20">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{weakPracticeChapters}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Need Practice</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exam Mode View */}
      {activeTab === 'exam' && (
        <div className="space-y-8">
          {/* Exam Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in">{examStats.totalExams}</div>
              <div className="text-foreground-secondary">Total Exams</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-green-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-100">{examStats.examsPassed}</div>
              <div className="text-foreground-secondary">Exams Passed</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-purple-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-200">{examPassRate}%</div>
              <div className="text-foreground-secondary">Pass Rate</div>
            </div>
            
            <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50 card-hover">
              <div className="text-orange-600 mb-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-foreground-primary animate-bounce-in animation-delay-300">{examStats.averageScore}%</div>
              <div className="text-foreground-secondary">Average Score</div>
            </div>
          </div>

          {/* Checkpoint/Exam Breakdown */}
          <div className="bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200-50 dark:border-gray-700-50">
            <h2 className="text-2xl font-semibold mb-6 text-foreground-primary">Exam Performance by Type</h2>
            
            {attemptedExams === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-foreground-secondary text-lg">No exams taken yet</p>
                <p className="text-foreground-tertiary">Take your first exam to see detailed statistics</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(examStats.checkpointStats).map(([examType, stats]) => {
                  const averageTime = stats.completionTimes.length > 0
                    ? Math.round(stats.completionTimes.reduce((sum, time) => sum + time, 0) / stats.completionTimes.length)
                    : 0;
                  
                  return (
                    <div key={examType} className="glass rounded-xl p-5 border border-gray-200-50 dark:border-gray-700-50 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground-primary text-lg mb-2 capitalize">
                            {examType.replace('-', ' ')} Exam
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-1 text-foreground-tertiary">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              {stats.attempts} attempts
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              {stats.averageScore}% avg
                            </div>
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {stats.bestScore}% best
                            </div>
                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatTime(averageTime)} avg
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-foreground-primary mb-1">
                            {stats.bestScore}%
                          </div>
                          <div className={`text-xs font-medium px-3 py-1 rounded-full inline-block mb-2 ${
                            stats.passed 
                              ? 'bg-green-100 dark:bg-green-900-30 text-green-700 dark:text-green-300' 
                              : stats.bestScore >= 60
                                ? 'bg-yellow-100 dark:bg-yellow-900-30 text-yellow-700 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900-30 text-red-700 dark:text-red-300'
                          }`}>
                            {stats.passed ? 'PASSED' : stats.bestScore >= 60 ? 'CLOSE' : 'NEEDS WORK'}
                          </div>
                          <div className="text-xs text-foreground-tertiary">
                            Last: {new Date(stats.lastAttempt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                            stats.passed
                              ? 'bg-gradient-to-r from-green-500 to-green-600' 
                              : stats.bestScore >= 60
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                                : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${stats.bestScore}%` }}
                        >
                          <div className="absolute inset-0 bg-white-20 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Exam Performance Summary */}
            {attemptedExams > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-foreground-primary mb-4">Exam Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900-20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{examStats.averageScore}%</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Overall Average</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900-20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{passedExams}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Exams Passed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900-20">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{examPassRate}%</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Pass Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900-20">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{attemptedExams}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Exam Types Tried</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="mt-8 glass rounded-2xl p-6 border border-blue-200-20 dark:border-blue-700-20 animate-slide-up">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Study Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Practice Mode</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              <li>• Aim for 70%+ success rate per chapter</li>
              <li>• Track your time per question to improve speed</li>
              <li>• Review incorrect answers to learn from mistakes</li>
              <li>• Practice regularly to maintain knowledge retention</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Exam Mode</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
              <li>• Take checkpoint exams to prepare for finals</li>
              <li>• Focus on time management during exams</li>
              <li>• Review exam results to identify weak areas</li>
              <li>• Retake failed exams to improve your scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}