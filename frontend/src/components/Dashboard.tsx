import React, { useState } from 'react';
import FilterBar from './Dashboard/FilterBar';
import Stats from './Stats';
import Calendar from './Calendar';
import Header from './Header';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0] // Today
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header />

        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedSymbols={selectedSymbols}
          onSymbolChange={handleSymbolChange}
          selectedStrategies={selectedStrategies}
          onStrategyChange={handleStrategyChange}
        />

        {/* Pass the selected filters to Stats and Calendar */}
        <Stats dateRange={dateRange} symbols={selectedSymbols} strategies={selectedStrategies} />
        <Calendar dateRange={dateRange} symbols={selectedSymbols} strategies={selectedStrategies} />
      </div>
    </div>
  );
};

export default Dashboard;