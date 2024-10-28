import React, { useState } from 'react';
import { Filter, Calendar } from 'lucide-react';
import Select from 'react-select'; // Import react-select for dropdown menus

interface FilterBarProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange: (startDate: string, endDate: string) => void;
  selectedSymbols: string[];
  onSymbolChange: (symbols: string[]) => void;
  selectedStrategies: string[];
  onStrategyChange: (strategies: string[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  selectedSymbols,
  onSymbolChange,
  selectedStrategies,
  onStrategyChange
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const symbolOptions = [
    { value: 'AAPL', label: 'AAPL' },
    { value: 'GOOGL', label: 'GOOGL' },
    { value: 'TSLA', label: 'TSLA' },
    // Add other symbols as needed
  ];

  const strategyOptions = [
    { value: 'Scalping', label: 'Scalping' },
    { value: 'Swing Trading', label: 'Swing Trading' },
    { value: 'Day Trading', label: 'Day Trading' },
    // Add other strategies as needed
  ];

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={toggleFilterDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-10">
              <h4 className="text-lg font-semibold mb-2">Filter by:</h4>

              {/* Symbols Dropdown */}
              <Select
                isMulti
                value={selectedSymbols.map(symbol => ({ value: symbol, label: symbol }))}
                onChange={(selectedOptions) => onSymbolChange(selectedOptions.map(option => option.value))}
                options={symbolOptions}
                className="mb-4"
                placeholder="Select Symbols"
              />

              {/* Strategies Dropdown */}
              <Select
                isMulti
                value={selectedStrategies.map(strategy => ({ value: strategy, label: strategy }))}
                onChange={(selectedOptions) => onStrategyChange(selectedOptions.map(option => option.value))}
                options={strategyOptions}
                className="mb-4"
                placeholder="Select Strategies"
              />
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
          <Calendar size={18} />
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => onDateRangeChange(e.target.value, dateRange.endDate)}
            className="border-none focus:outline-none"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => onDateRangeChange(dateRange.startDate, e.target.value)}
            className="border-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
