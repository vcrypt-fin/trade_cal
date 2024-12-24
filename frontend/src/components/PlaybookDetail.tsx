import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrades, Trade } from '../context/TradeContext';
import Sidebar from './Sidebar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PlaybookStats {
  netPnl: number;
  trades: number;
  winRate: number;
  profitFactor: number;
  missedTrades: number;
  expectancy: number;
  averageWinner: number;
  largestProfit: number;
  totalRMultiple: number;
}

function calculatePlaybookStats(trades: Trade[]): PlaybookStats {
  if (trades.length === 0) {
    return {
      netPnl: 0,
      trades: 0,
      winRate: 0,
      profitFactor: 0,
      missedTrades: 0,
      expectancy: 0,
      averageWinner: 0,
      largestProfit: 0,
      totalRMultiple: 0
    };
  }

  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl < 0);
  
  const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  
  const netPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = (winningTrades.length / trades.length) * 100;
  const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
  const averageWinner = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
  const largestProfit = Math.max(...trades.map(t => t.pnl));

  return {
    netPnl,
    trades: trades.length,
    winRate,
    profitFactor,
    missedTrades: 0,
    expectancy: netPnl / trades.length,
    averageWinner,
    largestProfit,
    totalRMultiple: netPnl / (trades.length * 100)
  };
}

function prepareChartData(trades: Trade[]) {
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulative = 0;
  return sortedTrades.map(trade => {
    cumulative += trade.pnl;
    return {
      date: trade.date,
      value: cumulative,
      pnl: trade.pnl
    };
  });
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);

export default function PlaybookDetail() {
  const { id } = useParams();
  const { trades, getPlaybookById } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const playbook = getPlaybookById(id || '');
  const playbookTrades = trades.filter(trade => trade.strategy === id);
  const stats = calculatePlaybookStats(playbookTrades);
  const chartData = prepareChartData(playbookTrades);

  if (!playbook) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
          <div className="text-purple-100">Playbook not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/playbook" className="text-purple-400 hover:text-purple-300">
            Playbook
          </Link>
          <span className="text-purple-600">/</span>
          <span className="text-purple-400">{playbook.name}</span>
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-purple-100">{playbook.name} - Overview</h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Net P&L</h3>
            <p className={`text-2xl font-bold ${stats.netPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(stats.netPnl)}
            </p>
          </div>
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Total Trades</h3>
            <p className="text-2xl font-bold text-purple-100">{stats.trades}</p>
          </div>
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Win Rate</h3>
            <p className="text-2xl font-bold text-purple-100">{formatPercent(stats.winRate)}</p>
          </div>
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Profit Factor</h3>
            <p className="text-2xl font-bold text-purple-100">{stats.profitFactor.toFixed(2)}</p>
          </div>
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Average Winner</h3>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.averageWinner)}</p>
          </div>
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-sm text-purple-400 mb-1">Largest Profit</h3>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.largestProfit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Cumulative P&L</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A1A4A" opacity={0.3} />
                  <XAxis 
                    dataKey="date"
                    stroke="#A855F7"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#A855F7"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2A1A4A', border: 'none', borderRadius: '8px', color: '#E9D5FF' }}
                    labelStyle={{ color: '#A855F7' }}
                    formatter={(value: number) => [formatCurrency(value), 'P&L']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#A855F7"
                    strokeWidth={2}
                    fill="url(#colorPnl)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4 text-purple-100">Recent Trades</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 border-b border-purple-800/30 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {playbookTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-purple-800/10">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                      {trade.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                      {trade.time}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(trade.pnl)}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-200">
                      {trade.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}