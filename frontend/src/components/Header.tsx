// src/components/Header.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import FilterBar from './Dashboard/FilterBar';
import { useTrades } from '../context/TradeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  dateRange?: { startDate: string; endDate: string };
  selectedSymbols?: string[];
  selectedStrategies?: string[];
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onSymbolChange?: (symbols: string[]) => void;
  onStrategyChange?: (strategies: string[]) => void;
}

const Header: React.FC<HeaderProps> = ({
  dateRange: propDateRange,
  selectedSymbols: propSelectedSymbols,
  selectedStrategies: propSelectedStrategies,
  onDateRangeChange,
  onSymbolChange,
  onStrategyChange
}) => {
  const { filters } = useTrades();
  const { showLoadingScreen } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Local state for filters
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(propSelectedSymbols || filters.symbols);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(propSelectedStrategies || filters.strategies);
  const [dateRange, setDateRange] = useState<[string, string]>([
    propDateRange?.startDate || filters.startDate,
    propDateRange?.endDate || filters.endDate
  ]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (showLoadingScreen) return null;

  return (
    <header className="flex justify-between items-center mb-6 ml-[30px]">
      <h1 className="text-2xl font-semibold text-purple-100">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="mt-2 relative" ref={filterRef}>
          <button 
            data-tour="filter-button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2A1A4A] text-purple-300 rounded-lg border border-purple-800/20 hover:bg-purple-800/20 transition-colors duration-300"
          >
            <Filter size={12} />
            <span>Filters</span>
          </button>
          {showFilters && (
            <div className="absolute right-0 z-50 mt-2 bg-[#120322] shadow-xl">
              <FilterBar
                dateRange={dateRange}
                onDateRangeChange={(range) => setDateRange(range)}
                selectedSymbols={selectedSymbols}
                onSymbolChange={setSelectedSymbols}
                selectedTypes={selectedStrategies}
                onTypeChange={setSelectedStrategies}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;