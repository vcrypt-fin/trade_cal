import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import Modal from 'react-modal';
import AuthChecker from './context/AuthHandler.tsx';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
Modal.setAppElement(rootElement);

const AUTH_DOMAIN = 'dev-gm2ulqzpf2ztt7zm.us.auth0.com'
const AUTH_CID = 'tOHodsS0hxlDQOW8gDednsxIe0hecKMV'

createRoot(rootElement).render(
<>    
  <StrictMode>
    <AuthChecker />
    <App />
  </StrictMode>
</>
);