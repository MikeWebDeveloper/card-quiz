import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizStore } from './quizStore';

describe('Quiz Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useQuizStore.setState({
      userStats: {
        practice: {
          totalQuestionsAttempted: 0,
          totalCorrectAnswers: 0,
          totalTimeSpent: 0,
          chapterStats: {},
        },
        exam: {
          totalExams: 0,
          examsPassed: 0,
          examsFailed: 0,
          averageScore: 0,
          checkpointStats: {},
        },
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        chapterProgress: {},
      },
    });
  });

  it('initializes with default values', () => {
    const { userStats } = useQuizStore.getState();
    
    expect(userStats.practice.totalQuestionsAttempted).toBe(0);
    expect(userStats.practice.totalCorrectAnswers).toBe(0);
    expect(userStats.exam.totalExams).toBe(0);
    expect(userStats.totalQuestionsAnswered).toBe(0);
    expect(userStats.correctAnswers).toBe(0);
    expect(userStats.chapterProgress).toEqual({});
  });

  it('updates chapter progress correctly', () => {
    const { updateChapterProgress } = useQuizStore.getState();
    
    updateChapterProgress(1, 85);
    
    const { userStats } = useQuizStore.getState();
    const chapter1Progress = userStats.chapterProgress?.[1];
    
    expect(chapter1Progress).toBeDefined();
    expect(chapter1Progress?.completed).toBe(true); // 85% > 70%
    expect(chapter1Progress?.score).toBe(85);
    expect(chapter1Progress?.lastAttempt).toBeInstanceOf(Date);
  });

  it('marks chapter as not completed when score is below 70%', () => {
    const { updateChapterProgress } = useQuizStore.getState();
    
    updateChapterProgress(2, 65);
    
    const { userStats } = useQuizStore.getState();
    const chapter2Progress = userStats.chapterProgress?.[2];
    
    expect(chapter2Progress?.completed).toBe(false);
    expect(chapter2Progress?.score).toBe(65);
  });

  it('increments questions answered correctly', () => {
    const { incrementQuestionsAnswered } = useQuizStore.getState();
    
    incrementQuestionsAnswered(8, 10);
    
    const { userStats } = useQuizStore.getState();
    expect(userStats.totalQuestionsAnswered).toBe(10);
    expect(userStats.correctAnswers).toBe(8);
  });

  it('resets stats correctly', () => {
    const { updateChapterProgress, incrementQuestionsAnswered, resetStats } = useQuizStore.getState();
    
    // Add some data
    updateChapterProgress(1, 90);
    incrementQuestionsAnswered(5, 10);
    
    // Reset
    resetStats();
    
    const { userStats } = useQuizStore.getState();
    expect(userStats.totalQuestionsAnswered).toBe(0);
    expect(userStats.correctAnswers).toBe(0);
    expect(userStats.chapterProgress).toEqual({});
  });

  it('gets chapter progress correctly', () => {
    const { updateChapterProgress, getChapterProgress } = useQuizStore.getState();
    
    updateChapterProgress(3, 75);
    
    const progress = getChapterProgress(3);
    expect(progress).toBeDefined();
    expect(progress?.score).toBe(75);
    expect(progress?.completed).toBe(true);
    
    const nonExistentProgress = getChapterProgress(99);
    expect(nonExistentProgress).toBeUndefined();
  });
});