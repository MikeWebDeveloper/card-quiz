import { useState } from 'react';
import { getCheckpointQuestions, getFinalExamQuestions, shuffleArray } from '../utils/questionLoader';
import { QuizEngine } from '../components/QuizEngine';
import { Results } from '../components/Results';
import { useQuizStore } from '../store/quizStore';
import type { Question } from '../types/quiz.types';

type ExamType = 'checkpoint1' | 'checkpoint2' | 'checkpoint3' | 'checkpoint4' | 'checkpoint5' | 'final-short' | 'final-full';

interface ExamOption {
  id: ExamType;
  name: string;
  description: string;
  timeLimit: number; // in minutes
  chapters: string;
  available: boolean;
}

const examOptions: ExamOption[] = [
  {
    id: 'checkpoint1',
    name: 'Checkpoint 1',
    description: 'Hardware & Safety',
    timeLimit: 30,
    chapters: 'Chapters 1-4',
    available: true,
  },
  {
    id: 'checkpoint2',
    name: 'Checkpoint 2',
    description: 'Operating Systems',
    timeLimit: 20,
    chapters: 'Chapters 5-6',
    available: true,
  },
  {
    id: 'checkpoint3',
    name: 'Checkpoint 3',
    description: 'Networking',
    timeLimit: 20,
    chapters: 'Chapters 7-8',
    available: true,
  },
  {
    id: 'checkpoint4',
    name: 'Checkpoint 4',
    description: 'Security',
    timeLimit: 20,
    chapters: 'Chapters 10-11',
    available: true,
  },
  {
    id: 'checkpoint5',
    name: 'Checkpoint 5',
    description: 'Troubleshooting',
    timeLimit: 20,
    chapters: 'Chapters 12-13',
    available: true,
  },
  {
    id: 'final-short',
    name: 'Final Exam (Short)',
    description: 'Comprehensive exam',
    timeLimit: 60,
    chapters: 'Chapters 1-9',
    available: true,
  },
  {
    id: 'final-full',
    name: 'Final Exam (Full)',
    description: 'Complete course exam',
    timeLimit: 90,
    chapters: 'Chapters 1-14',
    available: true,
  },
];

export function Exam() {
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    answers: Record<string, number>;
    timeSpent: number;
  } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const { updateExamStats } = useQuizStore();
  
  const handleStartExam = (examType: ExamType) => {
    let questions: Question[] = [];
    
    if (examType.startsWith('checkpoint')) {
      const checkpointNum = examType.replace('checkpoint', '');
      questions = getCheckpointQuestions(`checkpoint${checkpointNum}`);
    } else if (examType === 'final-short') {
      questions = shuffleArray(getFinalExamQuestions('short'));
    } else if (examType === 'final-full') {
      questions = shuffleArray(getFinalExamQuestions('full'));
    }
    
    // For demo, if no questions available, use all available questions
    if (questions.length === 0) {
      questions = shuffleArray(getFinalExamQuestions('short'));
    }
    
    setExamQuestions(questions);
    setSelectedExam(examType);
    setStartTime(new Date());
    setShowResults(false);
    setQuizResults(null);
  };
  
  const handleExamComplete = (score: number, answers: Record<string, number>) => {
    const endTime = new Date();
    const timeSpent = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    const totalQuestions = examQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70; // 70% pass rate for exams
    
    // Update comprehensive exam statistics
    updateExamStats(selectedExam!, score, totalQuestions, timeSpent, passed);
    
    setQuizResults({ score, answers, timeSpent });
    setShowResults(true);
  };
  
  const handleBackToExams = () => {
    setSelectedExam(null);
    setShowResults(false);
    setQuizResults(null);
    setExamQuestions([]);
  };
  
  if (showResults && quizResults) {
    return (
      <div>
        <button
          onClick={handleBackToExams}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Exams
        </button>
        <Results
          score={quizResults.score}
          totalQuestions={examQuestions.length}
          answers={quizResults.answers}
          questions={examQuestions}
          timeSpent={quizResults.timeSpent}
        />
      </div>
    );
  }
  
  if (selectedExam && examQuestions.length > 0) {
    const exam = examOptions.find(e => e.id === selectedExam);
    
    return (
      <div>
        <button
          onClick={handleBackToExams}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Exams
        </button>
        
        <h1 className="text-3xl font-bold mb-2 text-foreground-primary">{exam?.name}</h1>
        <p className="text-foreground-secondary mb-8">
          {exam?.description} • {examQuestions.length} questions • {exam?.timeLimit} minutes
        </p>
        
        <QuizEngine
          questions={examQuestions}
          onComplete={handleExamComplete}
          timeLimit={exam?.timeLimit}
        />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-3 text-foreground-primary animate-slide-up">Exam Mode</h1>
      <p className="text-foreground-secondary mb-10 text-lg animate-slide-up animation-delay-100">Select an exam type to begin</p>
      
      <div className="space-y-6">
        {examOptions.map((exam, index) => (
          <div
            key={exam.id}
            className={`group relative bg-surface-primary rounded-2xl shadow-lg dark:shadow-xl p-8 overflow-hidden border border-gray-200-50 dark:border-gray-700-50 animate-slide-up animation-delay-${index}00 ${
              exam.available ? 'card-hover cursor-pointer' : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => exam.available && handleStartExam(exam.id)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br bg-linear-from-indigo-400-10 bg-linear-to-purple-600-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {exam.name}
                </h3>
                <p className="text-foreground-secondary mb-4 text-lg">{exam.description}</p>
                <div className="flex gap-6">
                  <span className="flex items-center gap-2 text-foreground-secondary">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br bg-linear-from-blue-100 bg-linear-to-blue-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="font-medium">{exam.chapters}</span>
                  </span>
                  <span className="flex items-center gap-2 text-foreground-secondary">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br bg-linear-from-green-100 bg-linear-to-green-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{exam.timeLimit} minutes</span>
                  </span>
                </div>
              </div>
              {exam.available ? (
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-glow transition-all duration-300 transform group-hover:scale-105">
                  Start Exam
                  <svg className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900-20 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-300">
          <strong>Note:</strong> This is a demo version. All exams are available with sample questions from chapters 1-3.
        </p>
      </div>
    </div>
  );
}