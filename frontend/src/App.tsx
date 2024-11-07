import React from 'react';
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
import Settings from './components/Settings';
import { TradeProvider } from './context/TradeContext';
import { JournalProvider } from './context/JournalContext';
import EditTradeForm from './components/EditTradeForm';

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header />
        <Stats />
        <Calendar />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <TradeProvider>
        <JournalProvider>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/add-trade" element={<AddTradeForm />} />
            <Route path="/edit-trade/:id" element={<EditTradeForm />} />
            <Route path="/notebook" element={<Notebook />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/playbook" element={<Playbook />} />
            <Route path="/playbook/:id" element={<PlaybookDetail />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </JournalProvider>
      </TradeProvider>
    </Router>
  );
}

export default App;
