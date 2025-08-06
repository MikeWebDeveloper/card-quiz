import type { Chapter, Question } from '../types/quiz.types';

// Dynamic import cache to avoid re-loading
const chapterCache: Record<number, Chapter> = {};

// Dynamic chapter loader - only loads chapters when needed
const loadChapter = async (chapterId: number): Promise<Chapter> => {
  if (chapterCache[chapterId]) {
    return chapterCache[chapterId];
  }

  try {
    const module = await import(`../data/questions/chapter${chapterId}.json`);
    const chapter = module.default as Chapter;
    chapterCache[chapterId] = chapter;
    return chapter;
  } catch (error) {
    console.error(`Failed to load chapter ${chapterId}:`, error);
    throw new Error(`Chapter ${chapterId} not found`);
  }
};

// Load multiple chapters in parallel
const loadChapters = async (chapterIds: number[]): Promise<Chapter[]> => {
  const promises = chapterIds.map(id => loadChapter(id));
  return Promise.all(promises);
};

// Fisher-Yates shuffle algorithm for proper randomization
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getAllChapters = async (): Promise<Chapter[]> => {
  const chapterIds = Array.from({ length: 14 }, (_, i) => i + 1);
  return await loadChapters(chapterIds);
};

export const getChapterById = async (chapterId: number): Promise<Chapter | undefined> => {
  try {
    return await loadChapter(chapterId);
  } catch {
    return undefined;
  }
};

export const getQuestionsByChapters = async (chapterIds: number[]): Promise<Question[]> => {
  const chapters = await loadChapters(chapterIds);
  const questions: Question[] = [];
  
  chapters.forEach(chapter => {
    if (chapter?.questions) {
      questions.push(...chapter.questions);
    }
  });
  
  return questions;
};

export const getCheckpointQuestions = async (checkpoint: string): Promise<Question[]> => {
  const checkpointChapters: Record<string, number[]> = {
    'checkpoint1': [1, 2, 3, 4],
    'checkpoint2': [5, 6],
    'checkpoint3': [7, 8],
    'checkpoint4': [10, 11],
    'checkpoint5': [12, 13],
  };
  
  const chapterIds = checkpointChapters[checkpoint] || [];
  const questions = await getQuestionsByChapters(chapterIds);
  
  // Shuffle and limit questions for checkpoint exams
  const shuffled = shuffleArray(questions);
  const questionsPerChapter = 10;
  const maxQuestions = chapterIds.length * questionsPerChapter;
  
  return shuffled.slice(0, Math.min(maxQuestions, shuffled.length));
};

export const getFinalExamQuestions = async (variant: 'short' | 'full' = 'full'): Promise<Question[]> => {
  const chapterIds = variant === 'short' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : Array.from({ length: 14 }, (_, i) => i + 1);
  return await getQuestionsByChapters(chapterIds);
};

export const getRandomQuestions = async (count: number, chapterIds?: number[]): Promise<Question[]> => {
  const sourceQuestions = chapterIds 
    ? await getQuestionsByChapters(chapterIds)
    : await getQuestionsByChapters(Array.from({ length: 14 }, (_, i) => i + 1));
  
  const shuffled = shuffleArray(sourceQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Get randomized questions for a specific chapter (used in Practice mode)
export const getRandomizedChapterQuestions = async (chapterId: number): Promise<Question[]> => {
  const chapter = await getChapterById(chapterId);
  if (!chapter?.questions) return [];
  
  return shuffleArray(chapter.questions);
};