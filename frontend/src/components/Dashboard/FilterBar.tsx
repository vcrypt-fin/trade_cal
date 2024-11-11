// src/components/Dashboard/FilterBar.tsx

import React, { useState, useEffect } from 'react';
import { useTrades } from '../../context/TradeContext';
import Select from 'react-select';
import Button from '../Button'; // Assuming you created a reusable Button component

const FilterBar: React.FC = () => {
  const { trades, playbooks, setFilters, resetFilters, filters, isLoading } = useTrades();

  // Extract unique symbols from trades
  const symbolOptions = Array.from(new Set(trades.map(trade => trade.symbol)))
    .filter(symbol => symbol && symbol !== '')
    .map(symbol => ({ value: symbol, label: symbol }));

  // Extract unique strategies from playbooks
  const strategyOptions = playbooks.map(playbook => ({
    value: playbook.name,
    label: playbook.name,
  }));

  // Local temporary state for user selections
  const [localSelectedSymbols, setLocalSelectedSymbols] = useState<string[]>(filters.symbols);
  const [localSelectedStrategies, setLocalSelectedStrategies] = useState<string[]>(filters.strategies);
  const [localStartDate, setLocalStartDate] = useState<string>(filters.startDate);
  const [localEndDate, setLocalEndDate] = useState<string>(filters.endDate);

  useEffect(() => {
    // Sync local state when context filters change
    setLocalSelectedSymbols(filters.symbols);
    setLocalSelectedStrategies(filters.strategies);
    setLocalStartDate(filters.startDate);
    setLocalEndDate(filters.endDate);
  }, [filters]);

  const handleApply = () => {
    console.log('FilterBar: Applying new filters:', {
      startDate: localStartDate,
      endDate: localEndDate,
      symbols: localSelectedSymbols,
      strategies: localSelectedStrategies,
    });
    
    setFilters({
      startDate: localStartDate,
      endDate: localEndDate,
      symbols: localSelectedSymbols,
      strategies: localSelectedStrategies,
    });
  };

  const handleClear = () => {
    resetFilters();
  };

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-6 z-20">
        <p className="text-center">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-6 z-20">
      <h4 className="text-xl font-semibold mb-4">Filter by:</h4>

      {/* Symbols Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Symbols</label>
        <Select
          isMulti
          value={localSelectedSymbols.map(symbol => ({ value: symbol, label: symbol }))}
          onChange={(selectedOptions) => {
            const symbols = selectedOptions ? selectedOptions.map(option => option.value) : [];
            setLocalSelectedSymbols(symbols);
          }}
          options={symbolOptions}
          placeholder="Select Symbols"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Strategies Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Strategies</label>
        <Select
          isMulti
          value={localSelectedStrategies.map(strategy => ({ value: strategy, label: strategy }))}
          onChange={(selectedOptions) => {
            const strategies = selectedOptions ? selectedOptions.map(option => option.value) : [];
            setLocalSelectedStrategies(strategies);
          }}
          options={strategyOptions}
          placeholder="Select Strategies"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Date Range Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>to</span>
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

    {/* Action Buttons */}
    <div className="flex justify-end mt-4">
      <Button
        variant="secondary"
        size="md"
        onClick={handleClear}
        className="mr-2"
      >
        Reset Filters
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={handleApply}
      >
        Apply Filters
      </Button>
    </div>
    </div>
  );
};

export default FilterBar;