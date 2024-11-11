// src/components/Trades.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Filter, Calendar as CalendarIcon, Edit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import Stats from './Stats';
import FilterBar from './Dashboard/FilterBar';

const Trades: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trades, filters } = useTrades();
  const [showFilters, setShowFilters] = useState(false);

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

        {/* Trades Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr>
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
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No trades available.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50">
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
