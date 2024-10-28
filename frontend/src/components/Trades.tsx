import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Filter, Calendar } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { useJournal } from '../context/JournalContext';
import { useLocation } from 'react-router-dom';

const Trades: React.FC = () => {
  const location = useLocation();
  const { trades } = useTrades();
  const { entries } = useJournal();
  const [filteredTrades, setFilteredTrades] = useState(trades);

  useEffect(() => {
    if (location.state?.date) {
      setFilteredTrades(trades.filter(trade => trade.date === location.state.date));
    } else {
      setFilteredTrades(trades);
    }
  }, [location.state, trades]);

  // Calculate summary statistics
  const calculateStats = () => {
    if (filteredTrades.length === 0) return {
      netPnl: 0,
      profitFactor: 0,
      winRate: 0,
      avgRatio: 0
    };

    const winningTrades = filteredTrades.filter(t => t.pnl > 0);
    const losingTrades = filteredTrades.filter(t => t.pnl < 0);
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    
    const netPnl = filteredTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = (winningTrades.length / filteredTrades.length) * 100;
    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
    const avgWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
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
    const linkedNotes = entries.filter(entry => 
      entry.linkedTrades?.includes(tradeId)
    );
    return linkedNotes.map(note => note.content).join('\n');
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
                  Entry
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                  Exit
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
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.date}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.time}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm font-bold text-gray-900">{trade.symbol}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.side === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.quantity}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.entryPrice}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.exitPrice}</td>
                  <td className={`px-6 py-4 border-b border-gray-200 text-sm font-semibold ${
                    trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(trade.pnl)}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.strategy}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    <div className="max-h-20 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ 
                        __html: getTradeNotes(trade.id) || trade.notes 
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trades;