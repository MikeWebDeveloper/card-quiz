export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Chapter {
  chapter: number;
  title: string;
  questions: Question[];
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, number>;
  startTime: Date | null;
  endTime: Date | null;
}

// Practice Mode Statistics
export interface PracticeStats {
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  totalTimeSpent: number; // in seconds
  chapterStats: Record<number, {
    questionsAttempted: number;
    correctAnswers: number;
    incorrectAnswers: number;
    successRate: number;
    totalTimeSpent: number; // in seconds
    averageTimePerQuestion: number; // in seconds
    bestScore: number;
    attempts: number;
    lastAttempt: Date;
  }>;
}

// Exam Mode Statistics  
export interface ExamStats {
  totalExams: number;
  examsPassed: number;
  examsFailed: number;
  averageScore: number;
  checkpointStats: Record<string, {
    attempts: number;
    bestScore: number;
    passed: boolean;
    averageScore: number;
    completionTimes: number[]; // in seconds
    lastAttempt: Date;
  }>;
}

// Combined User Statistics
export interface UserStats {
  practice: PracticeStats;
  exam: ExamStats;
  // Legacy support - can be removed in future versions
  totalQuestionsAnswered?: number;
  correctAnswers?: number;
  chapterProgress?: Record<number, {
    completed: boolean;
    score: number;
    lastAttempt: Date;
    attempts?: number;
  }>;
}

export type ExamMode = 'practice' | 'checkpoint' | 'final';

export interface ExamConfig {
  mode: ExamMode;
  chapters: number[];
  timeLimit?: number; // in minutes
}