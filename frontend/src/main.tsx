import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
Modal.setAppElement(rootElement);

const AUTH_DOMAIN = 'dev-gm2ulqzpf2ztt7zm.us.auth0.com'
const AUTH_CID = 'tOHodsS0hxlDQOW8gDednsxIe0hecKMV'

createRoot(rootElement).render(
  <>    
    <StrictMode>
      <App />
    </StrictMode>
  </>
);