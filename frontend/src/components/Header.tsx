// src/components/Header.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Filter, Calendar } from 'lucide-react';
import FilterBar from './Dashboard/FilterBar';
import { useTrades } from '../context/TradeContext';

export default function Header() {
  const { clearAllTrades } = useTrades(); // If you have a Clear All Trades feature
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(prev => !prev);
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFilterDropdownOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  return (
    <div className="flex justify-between items-center mb-6" ref={filterRef}>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 relative">
          {/* Filter Button */}
          <button
            onClick={toggleFilterDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isFilterDropdownOpen}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          {/* Conditionally render FilterBar */}
          {isFilterDropdownOpen && (
            <FilterBar 
              dateRange={[null, null]}
              onDateRangeChange={(range) => {}}
              selectedSymbols={[]}
              onSymbolChange={() => {}}
              selectedTypes={[]}
              onTypeChange={() => {}}
            />
          )}
        </div>

        {/* Date Range Picker Button (Optional) */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none">
          <Calendar size={18} />
          <span>Date range</span>
        </button>

        {/* Demo Data Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none">
          <span>Demo Data</span>
        </button>

        {/* Notifications Button */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative focus:outline-none">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}