// src/components/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Stats from './Stats';
import Calendar from './Calendar';
import { TickerBar } from './TickerBar';
import { cn } from '../utils/cn';

const DashboardLayout: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTickerCollapsed, setIsTickerCollapsed] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <TickerBar
        isCollapsed={isCollapsed}
        isTickerCollapsed={isTickerCollapsed}
        onTickerToggle={() => setIsTickerCollapsed(!isTickerCollapsed)}
      />
      <div className={cn(
        'flex-1 transition-all duration-300 pt-12',
        isCollapsed ? 'ml-[60px]' : 'ml-[250px]'
      )}>
        <div className="p-8">
          <Header
            dateRange={dateRange}
            selectedSymbols={selectedSymbols}
            selectedStrategies={selectedStrategies}
            onDateRangeChange={handleDateRangeChange}
            onSymbolChange={handleSymbolChange}
            onStrategyChange={handleStrategyChange}
          />
          <Stats />
          <div className="mt-8">
            <Calendar
              dateRange={dateRange}
              symbols={selectedSymbols}
              strategies={selectedStrategies}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;