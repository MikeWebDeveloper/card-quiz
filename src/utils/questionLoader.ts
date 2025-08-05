import type { Chapter, Question } from '../types/quiz.types';

// Import all chapter files
import chapter1 from '../data/questions/chapter1.json';
import chapter2 from '../data/questions/chapter2.json';
import chapter3 from '../data/questions/chapter3.json';
import chapter4 from '../data/questions/chapter4.json';
import chapter5 from '../data/questions/chapter5.json';
import chapter6 from '../data/questions/chapter6.json';
import chapter7 from '../data/questions/chapter7.json';
import chapter8 from '../data/questions/chapter8.json';
import chapter9 from '../data/questions/chapter9.json';
import chapter10 from '../data/questions/chapter10.json';
import chapter11 from '../data/questions/chapter11.json';
import chapter12 from '../data/questions/chapter12.json';
import chapter13 from '../data/questions/chapter13.json';
import chapter14 from '../data/questions/chapter14.json';

// Map of all available chapters
const chapters: Record<number, Chapter> = {
  1: chapter1 as Chapter,
  2: chapter2 as Chapter,
  3: chapter3 as Chapter,
  4: chapter4 as Chapter,
  5: chapter5 as Chapter,
  6: chapter6 as Chapter,
  7: chapter7 as Chapter,
  8: chapter8 as Chapter,
  9: chapter9 as Chapter,
  10: chapter10 as Chapter,
  11: chapter11 as Chapter,
  12: chapter12 as Chapter,
  13: chapter13 as Chapter,
  14: chapter14 as Chapter,
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

export const getAllChapters = (): Chapter[] => {
  return Object.values(chapters);
};

export const getChapterById = (chapterId: number): Chapter | undefined => {
  return chapters[chapterId];
};

export const getQuestionsByChapters = (chapterIds: number[]): Question[] => {
  const questions: Question[] = [];
  
  chapterIds.forEach(id => {
    const chapter = chapters[id];
    if (chapter) {
      questions.push(...chapter.questions);
    }
  });
  
  return questions;
};

export const getCheckpointQuestions = (checkpoint: string): Question[] => {
  const checkpointChapters: Record<string, number[]> = {
    'checkpoint1': [1, 2, 3, 4],
    'checkpoint2': [5, 6],
    'checkpoint3': [7, 8],
    'checkpoint4': [10, 11],
    'checkpoint5': [12, 13],
  };
  
  const chapterIds = checkpointChapters[checkpoint] || [];
  const questions = getQuestionsByChapters(chapterIds);
  
  // Shuffle and limit questions for checkpoint exams
  const shuffled = shuffleArray(questions);
  const questionsPerChapter = 10;
  const maxQuestions = chapterIds.length * questionsPerChapter;
  
  return shuffled.slice(0, Math.min(maxQuestions, shuffled.length));
};

export const getFinalExamQuestions = (variant: 'short' | 'full' = 'full'): Question[] => {
  const chapterIds = variant === 'short' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : Object.keys(chapters).map(Number);
  return getQuestionsByChapters(chapterIds);
};

export const getRandomQuestions = (count: number, chapterIds?: number[]): Question[] => {
  const sourceQuestions = chapterIds 
    ? getQuestionsByChapters(chapterIds)
    : getQuestionsByChapters(Object.keys(chapters).map(Number));
  
  const shuffled = shuffleArray(sourceQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Get randomized questions for a specific chapter (used in Practice mode)
export const getRandomizedChapterQuestions = (chapterId: number): Question[] => {
  const chapter = chapters[chapterId];
  if (!chapter) return [];
  
  return shuffleArray(chapter.questions);
};