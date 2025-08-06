import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Loading } from './components/Loading'

// Enhanced performance with Suspense boundaries for React 19

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </StrictMode>,
)
