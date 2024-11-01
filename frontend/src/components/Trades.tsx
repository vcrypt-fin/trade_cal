// src/components/Trades.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Filter, Calendar, Edit } from 'lucide-react';
import { useTrades, Trade } from '../context/TradeContext';
import { useJournal } from '../context/JournalContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Trades: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trades } = useTrades();
  const { entries } = useJournal();
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]); // Initialize as empty array

  useEffect(() => {
    console.log('All Trades:', trades); // Debugging
    if (location.state?.date) {
      const filtered = trades.filter((trade) => trade.date === location.state.date);
      console.log(`Filtered Trades for date ${location.state.date}:`, filtered); // Debugging
      setFilteredTrades(filtered);
    } else {
      setFilteredTrades(trades);
      console.log('No date filter applied. Showing all trades:', trades); // Debugging
    }
  }, [location.state, trades]);

  // Calculate summary statistics
  const calculateStats = () => {
    if (filteredTrades.length === 0)
      return {
        netPnl: 0,
        profitFactor: 0,
        winRate: 0,
        avgRatio: 0,
      };

    let netPnl = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let winningTradesCount = 0;
    let losingTradesCount = 0;

    filteredTrades.forEach((trade) => {
      const pnl = trade.pnl || 0;

      netPnl += pnl;
      if (pnl > 0) {
        totalProfit += pnl;
        winningTradesCount += 1;
      } else if (pnl < 0) {
        totalLoss += Math.abs(pnl);
        losingTradesCount += 1;
      }
    });

    const winRate = (winningTradesCount / filteredTrades.length) * 100;
    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
    const avgWin = winningTradesCount > 0 ? totalProfit / winningTradesCount : 0;
    const avgLoss = losingTradesCount > 0 ? totalLoss / losingTradesCount : 0;
    const avgRatio = avgLoss === 0 ? avgWin : avgWin / avgLoss;

    return { netPnl, profitFactor, winRate, avgRatio };
  };

  const stats = calculateStats();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);

  // Get linked notes for a trade
  const getTradeNotes = (tradeId: string) => {
    const linkedNotes = entries.filter((entry) =>
      entry.linkedTrades?.includes(tradeId)
    );
    return linkedNotes.map((note) => note.content).join('\n');
  };

  const handleEdit = (tradeId: string) => {
    navigate(`/edit-trade/${tradeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-semibold mb-6">Trade Log</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold text-gray-600">Net P&L</p>
            <h2 className={`text-2xl font-bold ${stats.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.netPnl)}
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold text-gray-600">Profit Factor</p>
            <h2 className="text-2xl font-bold">{stats.profitFactor.toFixed(2)}</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold text-gray-600">Win Rate</p>
            <h2 className="text-2xl font-bold">{formatPercent(stats.winRate)}</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm font-semibold text-gray-600">Avg Win/Loss Ratio</p>
            <h2 className="text-2xl font-bold">{stats.avgRatio.toFixed(2)}</h2>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
              <Calendar size={18} />
              <span>Date range</span>
            </button>
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
                filteredTrades.map((trade) => {
                  console.log('Rendering Trade:', trade); // Debugging

                  const pnl = trade.pnl || 0;

                  return (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.date}</td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.time}</td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm font-bold text-gray-900">{trade.symbol}</td>
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
                          pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(pnl)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trades;
