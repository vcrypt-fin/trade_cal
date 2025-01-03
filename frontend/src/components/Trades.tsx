// src/components/Trades.tsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Filter, Calendar as CalendarIcon, Edit, Trash2, Tag, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import Stats from './Stats';
import FilterBar from './Dashboard/FilterBar';
import { supabase } from '../context/SupabaseClient';

const Trades: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trades, filters, editTrade, playbooks, fetchTrades } = useTrades();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Local state for filters
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(filters.symbols);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(filters.strategies);
  const [dateRange, setDateRange] = useState<[string, string]>([filters.startDate, filters.endDate]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const handleEdit = (tradeId: string) => {
    navigate(`/edit-trade/${tradeId}`);
  };

  // Get filtered trades based on context filters
  const filteredTrades = React.useMemo(() => {
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      // Set hours to 0 for consistent date comparison
      tradeDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      const matchesDateRange = tradeDate >= startDate && tradeDate <= endDate;
      const matchesSymbol = filters.symbols.length === 0 || filters.symbols.includes(trade.symbol);
      const matchesStrategy = filters.strategies.length === 0 || (trade.strategy && filters.strategies.includes(trade.strategy));
      
      return matchesDateRange && matchesSymbol && matchesStrategy;
    });
  }, [trades, filters]);

  const handleSelectAll = () => {
    if (selectedTrades.length === filteredTrades.length) {
      setSelectedTrades([]);
    } else {
      setSelectedTrades(filteredTrades.map(trade => trade.id));
    }
  };

  const handleSelectTrade = (tradeId: string) => {
    setSelectedTrades(prev => 
      prev.includes(tradeId) 
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  const handleMassUpdateStrategy = async (strategyId: string) => {
    if (!strategyId) return;

    try {
      const updates = selectedTrades.map(tradeId => {
        const trade = trades.find(t => t.id === tradeId);
        if (trade) {
          return editTrade({
            ...trade,
            strategy: strategyId
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updates.filter(Boolean));
      setSelectedTrades([]);
    } catch (error) {
      console.error('Error updating trades:', error);
    }
  };

  const handleMassDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTrades.length} trades?`)) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      // Delete trades from the database
      const { error } = await supabase
        .from("trades")
        .delete()
        .in('id', selectedTrades)
        .eq('userId', session.user.id);

      if (error) throw error;

      // Refresh trades after deletion
      await fetchTrades();
      setSelectedTrades([]);
    } catch (error) {
      console.error('Error deleting trades:', error);
    }
  };

  const filterRef = useRef<HTMLDivElement>(null);

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

  const handleRowClick = (e: React.MouseEvent, tradeId: string) => {
    // If the click is on the checkbox or its container, don't navigate
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    navigate(`/trades/${tradeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`p-8 transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        {/* Main Content Container */}
        <div className="space-y-8">
          {/* Header Section */}
          <div>
            <h1 className="text-2xl space-y-2 font-semibold text-purple-100">Trade Log</h1>
          </div>

          {/* Stats Component */}
          <div className="ml-[-20px]">
            <Stats />
          </div>

          {/* Filter Options */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2A1A4A] text-purple-300 rounded-lg border border-purple-800/20 hover:bg-purple-800/20 transition-colors duration-300"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
              {showFilters && (
                <div className="absolute top-full mt-2 z-40">
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
            <button
              onClick={() => navigate('/add-trade')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              <Edit size={18} />
              <span>Add Trade</span>
            </button>
          </div>

          {/* Mass Action Buttons */}
          {selectedTrades.length > 0 && (
            <div className="flex gap-2 items-center bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20" data-tour="mass-actions">
              <span className="text-sm text-purple-300">
                {selectedTrades.length} trades selected
              </span>
              <div className="flex gap-2 ml-4">
                <select
                  onChange={(e) => handleMassUpdateStrategy(e.target.value)}
                  className="px-3 py-1 bg-[#1A1A1A] text-purple-200 border border-purple-800/20 rounded-md text-sm focus:outline-none focus:border-purple-600"
                  defaultValue=""
                >
                  <option value="" disabled>Update Strategy</option>
                  {playbooks.map((playbook) => (
                    <option key={playbook.id} value={playbook.id}>
                      {playbook.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleMassDelete}
                  className="px-3 py-1 bg-red-600/80 text-white rounded-md text-sm hover:bg-red-700 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedTrades([])}
                  className="px-3 py-1 bg-purple-700 text-white rounded-md text-sm hover:bg-purple-600 flex items-center gap-1"
                >
                  <Tag size={14} />
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Trades Table */}
          <div className="overflow-x-auto bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm" data-tour="trades-table">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTrades.length === filteredTrades.length && filteredTrades.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-purple-800/30 text-purple-600 focus:ring-purple-500 bg-[#2A1A4A]"
                      data-tour="select-all"
                    />
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Time
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Symbol
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Side
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Entry Price
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Exit Price
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    P&L
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Forecasted RR
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Actual RR
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Strategy
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Notes
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-sm font-semibold text-purple-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-4 text-center text-purple-400">
                      No trades available.
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((trade) => {
                    const playbook = playbooks.find(p => p.id === trade.strategy);
                    return (
                    <tr
                      key={trade.id}
                      onClick={(e) => handleRowClick(e, trade.id)}
                      className="border-b border-purple-800/30 hover:bg-purple-800/10 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4 border-b border-purple-800/30">
                        <div data-checkbox>
                          <input
                            type="checkbox"
                            checked={selectedTrades.includes(trade.id)}
                            onChange={() => handleSelectTrade(trade.id)}
                            className="rounded border-purple-800/30 text-purple-600 focus:ring-purple-500 bg-[#2A1A4A]"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">{trade.date}</td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">{trade.time}</td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">{trade.symbol}</td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        <span className={`px-2 py-1 rounded ${trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {trade.side}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">{trade.quantity}</td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {trade.entryPrice !== undefined ? trade.entryPrice.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {trade.exitPrice !== undefined ? trade.exitPrice.toFixed(2) : 'N/A'}
                      </td>
                      <td
                        className={`px-6 py-4 border-b border-purple-800/30 text-sm font-semibold ${
                          trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formatCurrency(trade.pnl)}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {trade.forecasted_rr ? trade.forecasted_rr.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {trade.actual_rr ? trade.actual_rr.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {playbook ? playbook.name : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm text-purple-200">
                        {trade.notes || 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-b border-purple-800/30 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(trade.id);
                          }}
                          className="px-2 py-1 bg-purple-700 text-white rounded hover:bg-purple-600 transition-colors duration-300"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trades;
