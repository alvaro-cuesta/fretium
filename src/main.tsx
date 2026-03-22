import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.module.scss';

const $root = document.getElementById('root');
if (!$root) {
  throw new Error('Root element not found');
}

createRoot($root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
