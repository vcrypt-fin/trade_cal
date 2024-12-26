// src/components/Dashboard/FilterBar.tsx

import React, { useState, useEffect } from 'react';
import { useTrades } from '../../context/TradeContext';
import { Button, Select, SelectItem, DatePicker } from "@nextui-org/react";
import { DateValue, CalendarDate } from "@internationalized/date";

interface FilterBarProps {
  dateRange: [string, string];
  onDateRangeChange: (range: [string, string]) => void;
  selectedSymbols: string[];
  onSymbolChange: (symbols: string[]) => void;
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  onClose: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  selectedSymbols,
  onSymbolChange,
  selectedTypes,
  onTypeChange,
  onClose,
}) => {
  const { trades, playbooks, setFilters, resetFilters, filters } = useTrades();

  // Extract unique symbols from trades
  const symbolOptions = Array.from(new Set(trades.map(trade => trade.symbol)))
    .filter(symbol => symbol && symbol !== '');

  // Local temporary state for user selections
  const [localSelectedSymbols, setLocalSelectedSymbols] = useState<string[]>(selectedSymbols);
  const [localSelectedStrategies, setLocalSelectedStrategies] = useState<string[]>(selectedTypes);
  const [localStartDate, setLocalStartDate] = useState<DateValue | null>(null);
  const [localEndDate, setLocalEndDate] = useState<DateValue | null>(null);

  useEffect(() => {
    setLocalSelectedSymbols(selectedSymbols);
    setLocalSelectedStrategies(selectedTypes);
    // Convert string dates to DateValue
    if (dateRange[0]) {
      const [year, month, day] = dateRange[0].split('-').map(Number);
      setLocalStartDate(new CalendarDate(year, month, day));
    }
    if (dateRange[1]) {
      const [year, month, day] = dateRange[1].split('-').map(Number);
      setLocalEndDate(new CalendarDate(year, month, day));
    }
  }, [selectedSymbols, selectedTypes, dateRange]);

  const handleApply = () => {
    // Update both the context and parent component
    const startDateStr = localStartDate ? `${localStartDate.year}-${localStartDate.month.toString().padStart(2, '0')}-${localStartDate.day.toString().padStart(2, '0')}` : dateRange[0];
    const endDateStr = localEndDate ? `${localEndDate.year}-${localEndDate.month.toString().padStart(2, '0')}-${localEndDate.day.toString().padStart(2, '0')}` : dateRange[1];
    
    setFilters({
      startDate: startDateStr,
      endDate: endDateStr,
      symbols: localSelectedSymbols,
      strategies: localSelectedStrategies,
    });

    // Also update parent component state
    onSymbolChange(localSelectedSymbols);
    onTypeChange(localSelectedStrategies);
    onDateRangeChange([startDateStr, endDateStr]);
    onClose();
  };

  const handleClear = () => {
    resetFilters();
    // Also clear parent component state with default dates
    const defaultStartDate = new Date(new Date().setDate(1)).toISOString().split("T")[0];
    const defaultEndDate = new Date().toISOString().split("T")[0];
    onSymbolChange([]);
    onTypeChange([]);
    onDateRangeChange([defaultStartDate, defaultEndDate]);
    onClose();
  };

  return (
    <div className="w-[320px] bg-[#120322] rounded-lg border border-purple-800/30 p-4 shadow-xl">
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-purple-100 mb-4">Filter by:</h4>
        </div>

        {/* Symbols Select */}
        <Select
          label="Symbols"
          placeholder="Select symbols"
          selectionMode="multiple"
          selectedKeys={new Set(localSelectedSymbols)}
          onSelectionChange={(keys) => setLocalSelectedSymbols(Array.from(keys) as string[])}
          className="w-full"
          variant="bordered"
          classNames={{
            base: "max-w-full",
            trigger: "bg-[#1A0E2E] data-[hover=true]:bg-[#2A1A4A]",
            value: "!text-white",
            label: "text-purple-300",
            innerWrapper: "text-white",
            listbox: "bg-[#1A0E2E]",
            popoverContent: "bg-[#1A0E2E]",
          }}
        >
          {symbolOptions.map((symbol) => (
            <SelectItem key={symbol} value={symbol} className="text-white data-[selected=true]:text-white">
              {symbol}
            </SelectItem>
          ))}
        </Select>

        {/* Strategies Select */}
        <Select
          label="Strategies"
          placeholder="Select strategies"
          selectionMode="multiple"
          selectedKeys={new Set(localSelectedStrategies)}
          onSelectionChange={(keys) => setLocalSelectedStrategies(Array.from(keys) as string[])}
          className="w-full"
          variant="bordered"
          classNames={{
            base: "max-w-full",
            trigger: "bg-[#1A0E2E] data-[hover=true]:bg-[#2A1A4A]",
            value: "!text-white",
            label: "text-purple-300",
            innerWrapper: "text-white",
            listbox: "bg-[#1A0E2E]",
            popoverContent: "bg-[#1A0E2E]",
          }}
        >
          {playbooks.map((playbook) => (
            <SelectItem key={playbook.id} value={playbook.id} className="text-white data-[selected=true]:text-white">
              {playbook.name}
            </SelectItem>
          ))}
        </Select>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm text-purple-300">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker 
              value={localStartDate}
              onChange={setLocalStartDate}
              variant="bordered"
              label="Start date"
              classNames={{
                base: "max-w-full",
                input: "[&>*]:!text-white bg-[#1A0E2E] border-purple-800/30",
                calendar: "bg-[#1A0E2E] border border-purple-800/30",
                popoverContent: "bg-[#1A0E2E] dark",
                calendarContent: "!text-white",
                selectorButton: "!text-white hover:bg-purple-900/20",
                selectorIcon: "!text-white",
                timeInput: "!text-white",
                timeInputLabel: "!text-white",
                segment: "[&>.group]:!text-white !text-white data-[editable=true]:!text-white data-[editable=true]:data-[placeholder=true]:!text-white"
              }}
            />
            <DatePicker 
              value={localEndDate}
              onChange={setLocalEndDate}
              variant="bordered"
              label="End date"
              classNames={{
                base: "max-w-full",
                input: "[&>*]:!text-white bg-[#1A0E2E] border-purple-800/30",
                calendar: "bg-[#1A0E2E] border border-purple-800/30",
                popoverContent: "bg-[#1A0E2E] dark",
                calendarContent: "!text-white",
                selectorButton: "!text-white hover:bg-purple-900/20",
                selectorIcon: "!text-white",
                timeInput: "!text-white",
                timeInputLabel: "!text-white",
                segment: "[&>.group]:!text-white !text-white data-[editable=true]:!text-white data-[editable=true]:data-[placeholder=true]:!text-white"
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="flat"
            color="danger"
            onPress={handleClear}
            className="bg-red-500/10 text-red-400"
          >
            Reset
          </Button>
          <Button
            color="secondary"
            onPress={handleApply}
            className="bg-purple-600 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;