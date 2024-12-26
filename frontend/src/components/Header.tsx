// src/components/Header.tsx

import React from 'react';
import { Filter } from 'lucide-react';
import FilterBar from './Dashboard/FilterBar';
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

interface HeaderProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedSymbols: string[];
  selectedStrategies: string[];
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onSymbolChange: (symbols: string[]) => void;
  onStrategyChange: (strategies: string[]) => void;
}

export default function Header({
  dateRange,
  selectedSymbols,
  selectedStrategies,
  onDateRangeChange,
  onSymbolChange,
  onStrategyChange,
}: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-purple-100">Dashboard</h1>

      <div className="flex items-center gap-4">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button
              className="bg-[#120322] text-purple-200 border border-purple-800/30 hover:bg-purple-900/20"
              endContent={<Filter size={18} className="text-purple-400" />}
            >
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-0 bg-transparent shadow-none">
            <FilterBar 
              dateRange={[dateRange.startDate, dateRange.endDate]}
              onDateRangeChange={(range) => {
                if (range[0] && range[1]) {
                  onDateRangeChange(range[0], range[1]);
                }
              }}
              selectedSymbols={selectedSymbols}
              onSymbolChange={onSymbolChange}
              selectedTypes={selectedStrategies}
              onTypeChange={onStrategyChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}