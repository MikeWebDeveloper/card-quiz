import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserStats, PracticeStats, ExamStats } from '../types/quiz.types';

interface QuizStore {
  userStats: UserStats;
  
  // Practice Mode Methods
  updatePracticeStats: (chapter: number, correct: number, total: number, timeSpent: number) => void;
  getPracticeChapterStats: (chapter: number) => PracticeStats['chapterStats'][number] | undefined;
  
  // Exam Mode Methods
  updateExamStats: (examType: string, score: number, totalQuestions: number, timeSpent: number, passed: boolean) => void;
  getExamStats: (examType: string) => ExamStats['checkpointStats'][string] | undefined;
  
  // Legacy Methods (for backward compatibility)
  updateChapterProgress: (chapter: number, score: number) => void;
  incrementQuestionsAnswered: (correct: number, total: number) => void;
  getChapterProgress: (chapter: number) => { completed: boolean; score: number; lastAttempt: Date } | undefined;
  
  // Utility Methods
  resetStats: () => void;
  migrateOldStats: () => void;
}

const initialPracticeStats: PracticeStats = {
  totalQuestionsAttempted: 0,
  totalCorrectAnswers: 0,
  totalTimeSpent: 0,
  chapterStats: {},
};

const initialExamStats: ExamStats = {
  totalExams: 0,
  examsPassed: 0,
  examsFailed: 0,
  averageScore: 0,
  checkpointStats: {},
};

const initialStats: UserStats = {
  practice: initialPracticeStats,
  exam: initialExamStats,
  // Legacy fields for migration
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  chapterProgress: {},
};

const STORAGE_VERSION = 2; // Increment when changing storage structure

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      userStats: initialStats,
      
      // Practice Mode Methods
      updatePracticeStats: (chapter: number, correct: number, total: number, timeSpent: number) => {
        // Validate inputs
        if (typeof chapter !== 'number' || chapter <= 0) {
          return;
        }
        if (typeof correct !== 'number' || correct < 0) {
          return;
        }
        if (typeof total !== 'number' || total <= 0) {
          return;
        }
        if (correct > total) {
          return;
        }
        
        set((state) => {
          const currentChapterStats = state.userStats.practice.chapterStats[chapter] || {
            questionsAttempted: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            successRate: 0,
            totalTimeSpent: 0,
            averageTimePerQuestion: 0,
            bestScore: 0,
            attempts: 0,
            lastAttempt: new Date(),
          };

          const newQuestionsAttempted = currentChapterStats.questionsAttempted + total;
          const newCorrectAnswers = currentChapterStats.correctAnswers + correct;
          const newIncorrectAnswers = currentChapterStats.incorrectAnswers + (total - correct);
          const newTotalTimeSpent = currentChapterStats.totalTimeSpent + timeSpent;
          const newSuccessRate = Math.round((newCorrectAnswers / newQuestionsAttempted) * 100);
          const newAverageTimePerQuestion = Math.round(newTotalTimeSpent / newQuestionsAttempted);
          const currentScore = Math.round((correct / total) * 100);
          const newBestScore = Math.max(currentChapterStats.bestScore, currentScore);

          // Create completely new objects to ensure immutability
          const newChapterStats = {
            ...state.userStats.practice.chapterStats,
            [chapter]: {
              questionsAttempted: newQuestionsAttempted,
              correctAnswers: newCorrectAnswers,
              incorrectAnswers: newIncorrectAnswers,
              successRate: newSuccessRate,
              totalTimeSpent: newTotalTimeSpent,
              averageTimePerQuestion: newAverageTimePerQuestion,
              bestScore: newBestScore,
              attempts: currentChapterStats.attempts + 1,
              lastAttempt: new Date(),
            },
          };

          const newPractice = {
            totalQuestionsAttempted: state.userStats.practice.totalQuestionsAttempted + total,
            totalCorrectAnswers: state.userStats.practice.totalCorrectAnswers + correct,
            totalTimeSpent: state.userStats.practice.totalTimeSpent + timeSpent,
            chapterStats: newChapterStats,
          };

          const newUserStats = {
            ...state.userStats,
            practice: newPractice,
          };
          
          return { userStats: newUserStats };
        });
      },

      getPracticeChapterStats: (chapter: number) => {
        const state = get();
        return state.userStats.practice.chapterStats[chapter];
      },

      // Exam Mode Methods
      updateExamStats: (examType: string, score: number, totalQuestions: number, timeSpent: number, passed: boolean) => {
        set((state) => {
          const currentExamStats = state.userStats.exam.checkpointStats[examType] || {
            attempts: 0,
            bestScore: 0,
            passed: false,
            averageScore: 0,
            completionTimes: [],
            lastAttempt: new Date(),
          };

          const newCompletionTimes = [...currentExamStats.completionTimes, timeSpent];
          const newAttempts = currentExamStats.attempts + 1;
          const currentPercentage = Math.round((score / totalQuestions) * 100);
          const newBestScore = Math.max(currentExamStats.bestScore, currentPercentage);
          const newAverageScore = Math.round(
            (currentExamStats.averageScore * currentExamStats.attempts + currentPercentage) / newAttempts
          );

          const newTotalExams = state.userStats.exam.totalExams + 1;
          const newExamsPassed = passed ? state.userStats.exam.examsPassed + 1 : state.userStats.exam.examsPassed;
          const newExamsFailed = !passed ? state.userStats.exam.examsFailed + 1 : state.userStats.exam.examsFailed;
          const newOverallAverageScore = Math.round(
            (state.userStats.exam.averageScore * state.userStats.exam.totalExams + currentPercentage) / newTotalExams
          );

          return {
            userStats: {
              ...state.userStats,
              exam: {
                ...state.userStats.exam,
                totalExams: newTotalExams,
                examsPassed: newExamsPassed,
                examsFailed: newExamsFailed,
                averageScore: newOverallAverageScore,
                checkpointStats: {
                  ...state.userStats.exam.checkpointStats,
                  [examType]: {
                    attempts: newAttempts,
                    bestScore: newBestScore,
                    passed: passed || currentExamStats.passed, // Once passed, always passed
                    averageScore: newAverageScore,
                    completionTimes: newCompletionTimes,
                    lastAttempt: new Date(),
                  },
                },
              },
            },
          };
        });
      },

      getExamStats: (examType: string) => {
        const state = get();
        return state.userStats.exam.checkpointStats[examType];
      },

      // Legacy Methods (for backward compatibility)
      updateChapterProgress: (chapter: number, score: number) => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            chapterProgress: {
              ...state.userStats.chapterProgress,
              [chapter]: {
                completed: score >= 70,
                score,
                lastAttempt: new Date(),
              },
            },
          },
        }));
      },

      incrementQuestionsAnswered: (correct: number, total: number) => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            totalQuestionsAnswered: (state.userStats.totalQuestionsAnswered || 0) + total,
            correctAnswers: (state.userStats.correctAnswers || 0) + correct,
          },
        }));
      },

      getChapterProgress: (chapter: number) => {
        const state = get();
        return state.userStats.chapterProgress?.[chapter];
      },

      // Utility Methods
      resetStats: () => {
        set({ userStats: initialStats });
      },

      migrateOldStats: () => {
        set((state) => {
          // Only migrate if new structure is empty but old structure has data
          if (
            state.userStats.practice.totalQuestionsAttempted === 0 &&
            state.userStats.totalQuestionsAnswered &&
            state.userStats.totalQuestionsAnswered > 0
          ) {
            const migratedPracticeStats: PracticeStats = {
              totalQuestionsAttempted: state.userStats.totalQuestionsAnswered,
              totalCorrectAnswers: state.userStats.correctAnswers || 0,
              totalTimeSpent: 0, // Cannot migrate time data
              chapterStats: {},
            };

            // Migrate chapter progress
            if (state.userStats.chapterProgress) {
              Object.entries(state.userStats.chapterProgress).forEach(([chapterStr, progress]) => {
                const chapter = parseInt(chapterStr);
                const legacyProgress = progress as { score: number; attempts?: number; lastAttempt: Date };
                migratedPracticeStats.chapterStats[chapter] = {
                  questionsAttempted: 0, // Unknown
                  correctAnswers: 0, // Unknown
                  incorrectAnswers: 0, // Unknown
                  successRate: legacyProgress.score,
                  totalTimeSpent: 0, // Unknown
                  averageTimePerQuestion: 0, // Unknown
                  bestScore: legacyProgress.score,
                  attempts: legacyProgress.attempts || 1,
                  lastAttempt: legacyProgress.lastAttempt,
                };
              });
            }

            return {
              userStats: {
                ...state.userStats,
                practice: migratedPracticeStats,
              },
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'quiz-storage',
      version: STORAGE_VERSION,
      partialize: (state) => ({ userStats: state.userStats }),
      migrate: (persistedState: any, version: number) => {
        // If old version or no version, ensure proper structure
        if (version < STORAGE_VERSION || !version) {
          const migrated = {
            userStats: {
              ...initialStats,
              ...persistedState?.userStats,
              practice: {
                ...initialPracticeStats,
                ...persistedState?.userStats?.practice,
                chapterStats: persistedState?.userStats?.practice?.chapterStats || {},
              },
              exam: {
                ...initialExamStats,
                ...persistedState?.userStats?.exam,
                checkpointStats: persistedState?.userStats?.exam?.checkpointStats || {},
              },
            },
          };
          return migrated;
        }
        
        return persistedState;
      },
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const parsed = JSON.parse(str);
            
            // Ensure the structure is complete
            if (parsed.state?.userStats) {
              // Ensure practice object exists
              if (!parsed.state.userStats.practice) {
                parsed.state.userStats.practice = initialPracticeStats;
              }
              // Ensure exam object exists  
              if (!parsed.state.userStats.exam) {
                parsed.state.userStats.exam = initialExamStats;
              }
              
              // Convert date strings back to Date objects
              const convertDates = (obj: any): any => {
                if (!obj || typeof obj !== 'object') return obj;
                
                for (const key in obj) {
                  if (key === 'lastAttempt' && typeof obj[key] === 'string') {
                    obj[key] = new Date(obj[key]);
                  } else if (typeof obj[key] === 'object') {
                    obj[key] = convertDates(obj[key]);
                  }
                }
                return obj;
              };
              
              parsed.state = convertDates(parsed.state);
            }
            
            return parsed;
          } catch (error) {
            return null;
          }
        },
        setItem: (name, value) => {
          // Deep clone and convert dates
          const valueToStore = JSON.parse(JSON.stringify(value, (_key, val) => {
            if (val instanceof Date) {
              return val.toISOString();
            }
            return val;
          }));
          
          localStorage.setItem(name, JSON.stringify(valueToStore));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      merge: (persistedState: unknown, currentState: QuizStore) => {
        // Ensure practice and exam objects exist even if not in persisted state
        const typedPersistedState = persistedState as { userStats?: UserStats } | null;
        
        // Deep merge to preserve nested objects like chapterStats
        const mergedStats: UserStats = {
          ...initialStats,
          ...typedPersistedState?.userStats,
          practice: {
            ...initialPracticeStats,
            ...typedPersistedState?.userStats?.practice,
            chapterStats: {
              ...typedPersistedState?.userStats?.practice?.chapterStats || {},
            },
          },
          exam: {
            ...initialExamStats,
            ...typedPersistedState?.userStats?.exam,
            checkpointStats: {
              ...typedPersistedState?.userStats?.exam?.checkpointStats || {},
            },
          },
        };
        
        const result = {
          ...currentState,
          userStats: mergedStats,
        };
        
        return result;
      },
      onRehydrateStorage: () => (state) => {
        // Auto-migrate on app load
        if (state) {
          state.migrateOldStats();
        }
      },
    }
  )
);