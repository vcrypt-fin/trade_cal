import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
Modal.setAppElement(rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);