// Storage debugging utilities

export const checkLocalStorage = () => {
  console.log('🔍 Checking localStorage...');
  
  const key = 'quiz-storage';
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    console.log('❌ No data in localStorage');
    return null;
  }
  
  try {
    const parsed = JSON.parse(stored);
    console.log('✅ Parsed data:', parsed);
    
    // Check structure
    if (!parsed.state) {
      console.log('❌ Missing state property');
      return null;
    }
    
    if (!parsed.state.userStats) {
      console.log('❌ Missing userStats property');
      return null;
    }
    
    if (!parsed.state.userStats.practice) {
      console.log('❌ Missing practice property');
      return null;
    }
    
    console.log('✅ Valid structure found');
    console.log('📊 Practice stats:', parsed.state.userStats.practice);
    console.log('📊 Chapter stats:', parsed.state.userStats.practice.chapterStats);
    
    return parsed;
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
    return null;
  }
};

export const fixLocalStorage = () => {
  console.log('🔧 Attempting to fix localStorage...');
  
  const key = 'quiz-storage';
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    console.log('❌ No data to fix');
    return;
  }
  
  try {
    const parsed = JSON.parse(stored);
    
    // Ensure proper structure
    if (!parsed.state) {
      parsed.state = {};
    }
    
    if (!parsed.state.userStats) {
      parsed.state.userStats = {};
    }
    
    if (!parsed.state.userStats.practice) {
      parsed.state.userStats.practice = {
        totalQuestionsAttempted: 0,
        totalCorrectAnswers: 0,
        totalTimeSpent: 0,
        chapterStats: {},
      };
    }
    
    if (!parsed.state.userStats.exam) {
      parsed.state.userStats.exam = {
        totalExams: 0,
        examsPassed: 0,
        examsFailed: 0,
        averageScore: 0,
        checkpointStats: {},
      };
    }
    
    // Add version
    parsed.version = 2;
    
    // Save back
    localStorage.setItem(key, JSON.stringify(parsed));
    console.log('✅ localStorage fixed and saved');
    console.log('🔄 Please reload the page');
    
  } catch (error) {
    console.error('❌ Error fixing localStorage:', error);
  }
};

// Add these to window for easy access
if (typeof window !== 'undefined') {
  (window as any).checkLocalStorage = checkLocalStorage;
  (window as any).fixLocalStorage = fixLocalStorage;
}