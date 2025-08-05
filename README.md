# IT Essentials 7.0 Quiz Application

A modern, interactive quiz application for IT Essentials 7.0 certification preparation built with React, TypeScript, and Tailwind CSS v4.

![IT Essentials Quiz App](https://img.shields.io/badge/IT%20Essentials-7.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)

## 🚀 Features

### Core Features
- **Practice Mode**: Study individual chapters at your own pace with instant feedback
- **Exam Mode**: Take timed checkpoint exams and final exams to test your knowledge
- **Comprehensive Statistics**: Track your progress with detailed analytics for both practice and exam modes
- **Dark/Light Theme**: Comfortable studying with system-aware theme switching
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG AA compliant with full keyboard navigation and screen reader support

### Advanced Features
- **Progress Tracking**: Questions attempted, success rates, time spent per chapter
- **Exam History**: Track attempts, best scores, and pass/fail status for each exam
- **Smart Statistics**: Separate tracking for practice and exam modes with visual indicators
- **Performance Badges**: Visual feedback for mastery (70%+ success rate)
- **Time Analytics**: Track average time per question and total study time

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **State Management**: Zustand with persistence
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Deployment**: Optimized for Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/MikeWebDeveloper/card-quiz.git
cd card-quiz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📊 Features Overview

### Practice Mode
- Study questions from 14 different chapters
- Get instant feedback with detailed explanations
- Track questions attempted, success rate, and time spent
- Visual progress indicators for each chapter
- Chapter mastery badges when achieving 70%+ success rate

### Exam Mode
- **5 Checkpoint Exams**: Covering specific chapter ranges
  - Checkpoint 1: Hardware & Safety (Ch 1-4)
  - Checkpoint 2: Operating Systems (Ch 5-6)
  - Checkpoint 3: Networking (Ch 7-8)
  - Checkpoint 4: Security (Ch 10-11)
  - Checkpoint 5: Troubleshooting (Ch 12-13)
- **2 Final Exams**: Short (Ch 1-9) and Full (Ch 1-14)
- Timed exams with automatic submission
- Pass/fail grading with 70% threshold
- Detailed exam history and performance tracking

### Statistics Dashboard
- **Tabbed Interface**: Separate views for Practice and Exam modes
- **Practice Statistics**:
  - Total questions attempted and success rate
  - Time spent studying
  - Chapter-by-chapter breakdown
  - Questions attempted vs available per chapter
- **Exam Statistics**:
  - Total exams taken, passed, and failed
  - Pass rate and average scores
  - Per-exam performance tracking
  - Best scores and completion times

## 🎨 Design Features

- Modern glass morphism UI with smooth animations
- Color-coded progress indicators and status badges
- Responsive grid layouts with mobile-first design
- High contrast mode support for accessibility
- Smooth transitions and micro-interactions
- Professional color scheme with excellent readability

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── Layout/        # Header and layout components
│   ├── Question.tsx   # Question display with animated icons
│   ├── QuizEngine.tsx # Core quiz logic and timer
│   ├── Results.tsx    # Results display with statistics
│   └── Timer.tsx      # Countdown timer for exams
├── pages/             # Page components
│   ├── Home.tsx       # Landing page with progress
│   ├── Practice.tsx   # Practice mode selection
│   ├── Exam.tsx       # Exam mode selection
│   └── Statistics.tsx # Comprehensive statistics
├── store/             # State management
│   └── quizStore.ts   # Zustand store with persistence
├── data/              # Question data
│   └── questions/     # JSON question files by chapter
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── contexts/          # React contexts (theme)
```

## 🔧 Configuration

The application uses local storage for data persistence. No backend setup required.

### Environment Variables (Optional)
Create a `.env.local` file for any environment-specific configuration:
```env
VITE_APP_TITLE=IT Essentials 7.0 Quiz
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

### Manual Build

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 📱 Progressive Web App

The application is PWA-ready with:
- Offline capability (coming soon)
- Installable on mobile devices
- App-like experience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes. IT Essentials is a trademark of Cisco Systems.

## 🙏 Acknowledgments

- Built for IT students preparing for certification
- Question content based on IT Essentials 7.0 curriculum
- UI inspired by modern educational platforms

---

**Note**: This is a demo version with sample questions. The full implementation would include comprehensive question banks for all 14 chapters.

Built with ❤️ for the IT community