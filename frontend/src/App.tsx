// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Stats from './components/Stats';
import Calendar from './components/Calendar';
import Journal from './components/Journal';
import AddTradeForm from './components/AddTrade/AddTradeForm';
import Notebook from './components/Notebook';
import { Playbook } from './components/Playbook';
import PlaybookDetail from './components/PlaybookDetail';
import Trades from './components/Trades';
import Reports from './components/Reports/Reports';
// import Settings from './components/Settings';
import { TradeProvider } from './context/TradeContext';
import { JournalProvider } from './context/JournalContext';
import EditTradeForm from './components/EditTradeForm';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/LoginPage.tsx';
import Register from './components/RegisterPage.tsx';
import AuthChecker from './context/AuthHandler.tsx';
import { GitHubCallback } from './components/AuthCallbacks.tsx';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdatePassword from './components/UpdatePassword';
import { NotebookProvider } from './context/NotebookContext';
import { AuthProvider } from './context/AuthContext';
import { AuthTokenProvider } from './context/AuthHandler';
import StripeCallback from './components/StripeCallback';
import LandingPage from './app/page.tsx';
import AuthPage from './app/auth/page.tsx';
import WatchDemo from './app/watch-demo/page.tsx';
import PaymentPage from './components/payment';
import SubscriptionPage from './app/subscription/page';
import AboutPage from './app/about/page';
import CareersPage from './app/careers/page';
import TermsPage from './app/legal/terms/page';
import PrivacyPage from './app/legal/privacy/page';
import CookiesPage from './app/legal/cookies/page';

function App() {
  return (
    <Router>
      <AuthTokenProvider>
        <AuthProvider>
          <AuthChecker />
          <TradeProvider>
            <JournalProvider>
              <NotebookProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/demo" element={<LandingPage />} />
                  <Route path="/watch-demo" element={<WatchDemo />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/github/callback" element={<GitHubCallback />} />
                  <Route path="/stripe/callback" element={<StripeCallback />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/legal/terms" element={<TermsPage />} />
                  <Route path="/legal/privacy" element={<PrivacyPage />} />
                  <Route path="/legal/cookies" element={<CookiesPage />} />

                  {/* Protected routes */}
                  <Route path="/" element={<DashboardLayout />} />
                  <Route path="/add-trade" element={<AddTradeForm />} />
                  <Route path="/edit-trade/:id" element={<EditTradeForm />} />
                  <Route path="/notebook" element={<Notebook />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/playbook" element={<Playbook />} />
                  <Route path="/playbook/:id" element={<PlaybookDetail />} />
                  <Route path="/trades" element={<Trades />} /> 
                  <Route path="/reports" element={<Reports />} />
                  {/* <Route path="/settings" element={<Settings />} /> */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                </Routes>
              </NotebookProvider>
            </JournalProvider>
          </TradeProvider>
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </AuthTokenProvider>
    </Router>
  );
}

export default App;
