import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <div className="rotate-notice" role="alert">
      <span className="rotate-notice__icon" aria-hidden />
      <p className="rotate-notice__text">
        화면을 가로로 돌려주세요
      </p>
    </div>
  </StrictMode>,
);
