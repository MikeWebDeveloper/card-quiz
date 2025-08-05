import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { Exam } from './pages/Exam';
import { Statistics } from './pages/Statistics';
import { DebugStats } from './components/DebugStats';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="practice" element={<Practice />} />
            <Route path="exam" element={<Exam />} />
            <Route path="stats" element={<Statistics />} />
          </Route>
        </Routes>
        <DebugStats />
      </Router>
    </ThemeProvider>
  );
}

export default App;