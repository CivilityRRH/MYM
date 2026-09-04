import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Global runtime unhandled rejection safeguard
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Safeguarded unhandled promise rejection:', event.reason);
  if (event.preventDefault) {
    event.preventDefault();
  }
});

// Global runtime error safeguard
window.addEventListener('error', (event) => {
  console.warn('Safeguarded window error event:', event.error || event.message);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

