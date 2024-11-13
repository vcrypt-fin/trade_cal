// src/components/Trades.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Filter, Calendar as CalendarIcon, Edit, Trash2, Tag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import Stats from './Stats';
import FilterBar from './Dashboard/FilterBar';

const Trades: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trades, filters, editTrade, playbooks } = useTrades();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

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
      const matchesStrategy = filters.strategies.length === 0 || filters.strategies.includes(trade.strategy);
      
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

  const handleMassUpdateStrategy = async (playbookId: string) => {
    if (!playbookId) return;
    
    try {
      // Find the selected playbook using ID
      const selectedPlaybook = playbooks.find(p => p.id === playbookId);
      if (!selectedPlaybook) {
        console.error('Selected playbook not found');
        return;
      }

      // Create an array of promises for updating trades
      const updates = selectedTrades.map(tradeId => {
        const trade = trades.find(t => t.id === tradeId);
        if (trade) {
          // Match EditTradeForm's behavior exactly
          const updatedTrade = {
            ...trade,
            strategy: playbookId,  // Use playbook ID as strategy (not the name)
          };
          
          console.log('Updating trade:', trade.id, 'with strategy:', playbookId);
          
          return editTrade(updatedTrade);
        }
      });
      
      await Promise.all(updates.filter(Boolean));
      setSelectedTrades([]);
      
      console.log(`Successfully updated ${updates.length} trades with playbook ID: ${playbookId}`);
    } catch (error) {
      console.error('Error updating strategies:', error);
    }
  };

  const handleMassDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTrades.length} trades?`)) {
      return;
    }

    try {
      const deletions = selectedTrades.map(tradeId => {
        const trade = trades.find(t => t.id === tradeId);
        if (trade) {
          return editTrade({
            ...trade,
            deleted: true // Assuming your backend handles soft deletion
          });
        }
      });

      await Promise.all(deletions.filter(Boolean));
      setSelectedTrades([]);
    } catch (error) {
      console.error('Error deleting trades:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-semibold mb-6">Trade Log</h1>

        {/* Stats Component */}
        <Stats />

        {/* Filter Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            {showFilters && <FilterBar />}
          </div>
          <button
            onClick={() => navigate('/add-trade')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700"
          >
            <Edit size={18} />
            <span>Add Trade</span>
          </button>
        </div>

        {/* Mass Action Buttons */}
        {selectedTrades.length > 0 && (
          <div className="mb-4 flex gap-2 items-center bg-blue-50 p-4 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedTrades.length} trades selected
            </span>
            <div className="flex gap-2 ml-4">
              <select
                onChange={(e) => handleMassUpdateStrategy(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
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
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedTrades([])}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <Tag size={14} />
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Trades Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTrades.length === filteredTrades.length && filteredTrades.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Time
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Symbol
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Side
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Entry Price
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Exit Price
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  P&L
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Strategy
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Notes
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                    No trades available.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedTrades.includes(trade.id)}
                        onChange={() => handleSelectTrade(trade.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.date}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.time}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm font-bold text-gray-900">
                      {trade.symbol}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          trade.side === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.quantity}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {trade.entryPrice !== undefined ? trade.entryPrice.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {trade.exitPrice !== undefined ? trade.exitPrice.toFixed(2) : 'N/A'}
                    </td>
                    <td
                      className={`px-6 py-4 border-b border-gray-200 text-sm font-semibold ${
                        trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(trade.pnl)}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.strategy}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {trade.notes || 'N/A'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <button
                        onClick={() => handleEdit(trade.id)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trades;
