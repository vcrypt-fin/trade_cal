// src/components/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Stats from './Stats';
import Calendar from './Calendar';

const DashboardLayout: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const handleSymbolChange = (symbols: string[]) => {
    setSelectedSymbols(symbols);
  };

  const handleStrategyChange = (strategies: string[]) => {
    setSelectedStrategies(strategies);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="ml-64 p-8 flex-1">
        <Header
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedSymbols={selectedSymbols}
          setSelectedSymbols={setSelectedSymbols}
          selectedStrategies={selectedStrategies}
          setSelectedStrategies={setSelectedStrategies}
          onDateRangeChange={handleDateRangeChange}
          onSymbolChange={handleSymbolChange}
          onStrategyChange={handleStrategyChange}
        />
        <Stats
          dateRange={dateRange}
          symbols={selectedSymbols}
          strategies={selectedStrategies}
        />
        <Calendar
          dateRange={dateRange}
          symbols={selectedSymbols}
          strategies={selectedStrategies}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;