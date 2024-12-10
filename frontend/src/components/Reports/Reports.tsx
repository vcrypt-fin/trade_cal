import React, { useState, useMemo } from 'react';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';
import ReportsSidebar from './ReportsSidebar';
import DateTimeSection from './sections/DateTimeSection';
import PriceQuantitySection from './sections/PriceQuantitySection';
import RiskSection from './sections/RiskSection';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import TagsSection from './sections/TagsSection';
import SetupsSection from './sections/SetupsSection';
import WinsVsLossesSection from './sections/WinsVsLossesSection';
import { Trade, MonthlyTrades, MonthlyPnL, DailyPnLData, CumulativePnLData } from '../../types/trade';

const Reports: React.FC = () => {
  const { trades } = useTrades();
  const [selectedView, setSelectedView] = useState('overview');

  const stats = useMemo(() => {
    if (!trades.length) {
      return {
        bestMonth: { value: 0, date: '-' },
        lowestMonth: { value: 0, date: '-' },
        averageMonthly: 0,
        totalPnL: 0,
        totalTrades: 0,
        avgDailyVolume: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        largestProfit: 0,
        largestLoss: 0,
        charts: {
          cumulativePnLData: [],
          dailyPnLData: []
        }
      };
    }

    // Group trades by month
    const monthlyTrades = (trades as Trade[]).reduce<MonthlyTrades>((acc, trade) => {
      const monthKey = format(parseISO(trade.date), 'yyyy-MM');
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(trade);
      return acc;
    }, {});

    // Calculate monthly P&Ls
    const monthlyPnLs: MonthlyPnL[] = Object.entries(monthlyTrades).map(([month, monthTrades]) => ({
      month,
      pnl: monthTrades.reduce((sum: number, trade: Trade) => sum + trade.pnl, 0)
    }));

    // Find best and worst months
    const bestMonth = monthlyPnLs.length ? monthlyPnLs.reduce((best, current) => 
      current.pnl > best.pnl ? current : best, monthlyPnLs[0]
    ) : { month: '-', pnl: 0 };

    const lowestMonth = monthlyPnLs.length ? monthlyPnLs.reduce((worst, current) => 
      current.pnl < worst.pnl ? current : worst, monthlyPnLs[0]
    ) : { month: '-', pnl: 0 };

    // Calculate daily P&L data
    const dailyPnLData: DailyPnLData[] = trades.reduce<DailyPnLData[]>((acc, trade) => {
      const existingDay = acc.find(day => day.date === trade.date);
      if (existingDay) {
        existingDay.pnl += trade.pnl;
      } else {
        acc.push({ 
          date: trade.date, 
          pnl: trade.pnl, 
          fill: trade.pnl >= 0 ? '#4CAF50' : '#EF4444'
        });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate cumulative P&L data
    let cumulative = 0;
    const cumulativePnLData = dailyPnLData.map(day => ({
      date: day.date,
      value: (cumulative += day.pnl)
    }));

    // Calculate winning and losing trades
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);

    const avgWinningTrade = winningTrades.length ? 
      winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 
      0;

    const avgLosingTrade = losingTrades.length ? 
      losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length : 
      0;

    const averageMonthly = monthlyPnLs.length ? 
      monthlyPnLs.reduce((sum, month) => sum + month.pnl, 0) / monthlyPnLs.length : 
      0;

    return {
      bestMonth: {
        value: bestMonth.pnl,
        date: bestMonth.month === '-' ? '-' : format(parseISO(bestMonth.month + '-01'), 'MMM yyyy')
      },
      lowestMonth: {
        value: lowestMonth.pnl,
        date: lowestMonth.month === '-' ? '-' : format(parseISO(lowestMonth.month + '-01'), 'MMM yyyy')
      },
      averageMonthly: isNaN(averageMonthly) ? 0 : averageMonthly,
      totalPnL: trades.reduce((sum, trade) => sum + trade.pnl, 0),
      totalTrades: trades.length,
      avgDailyVolume: dailyPnLData.length ? trades.length / dailyPnLData.length : 0,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWinningTrade: isNaN(avgWinningTrade) ? 0 : avgWinningTrade,
      avgLosingTrade: isNaN(avgLosingTrade) ? 0 : avgLosingTrade,
      largestProfit: winningTrades.length ? Math.max(...trades.map(t => t.pnl)) : 0,
      largestLoss: losingTrades.length ? Math.min(...trades.map(t => t.pnl)) : 0,
      charts: {
        cumulativePnLData,
        dailyPnLData
      }
    };
  }, [trades]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Best Month</h3>
          <p className={`text-2xl font-semibold ${stats.bestMonth.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.bestMonth.value)}
          </p>
          <p className="text-sm text-gray-500">{stats.bestMonth.date}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Lowest Month</h3>
          <p className={`text-2xl font-semibold ${stats.lowestMonth.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.lowestMonth.value)}
          </p>
          <p className="text-sm text-gray-500">{stats.lowestMonth.date}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Average Monthly P&L</h3>
          <p className={`text-2xl font-semibold ${stats.averageMonthly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.averageMonthly)}
          </p>
        </div>
      </div>

     <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Net Cumulative P&L</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.charts.cumulativePnLData}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E0E0E0', color: '#333' }}
                formatter={(value: number) => [formatCurrency(value), 'P&L']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                fill="url(#colorPnl)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Net Daily P&L</h3>
        <div className="h-64">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.charts.dailyPnLData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E0E0E0', color: '#333' }}
                formatter={(value: number) => [formatCurrency(value), 'P&L']}
              />
              <Bar 
                dataKey="pnl"
                fill="#4CAF50"
              >
                {stats.charts.dailyPnLData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#4CAF50' : '#EF4444'}
                    stroke={entry.pnl >= 0 ? '#2E7D32' : '#DC2626'}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>

          </ResponsiveContainer>


        </div>
      </div>
    </div>


      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Total P&L</h3>
          <p className={`text-2xl font-semibold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalPnL)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Win Rate</h3>
          <p className="text-2xl font-semibold">
            {((stats.winningTrades / stats.totalTrades) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Average Winner</h3>
          <p className="text-2xl font-semibold text-green-600">
            {formatCurrency(stats.avgWinningTrade)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Average Loser</h3>
          <p className="text-2xl font-semibold text-red-600">
            {formatCurrency(stats.avgLosingTrade)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (selectedView) {
      case 'overview':
        return renderOverview();
      case 'days':
      case 'weeks':
      case 'months':
      case 'tradeTime':
      case 'tradeDuration':
        return <DateTimeSection view={selectedView} />;
      case 'price':
      case 'volume':
      case 'instrument':
        return <PriceQuantitySection view={selectedView} />;
      case 'rMultiple':
      case 'positionSize':
        return <RiskSection view={selectedView} />;
      case 'tags':
        return <TagsSection />;
      case 'setups':
        return <SetupsSection />;
      case 'winsVsLosses':
        return <WinsVsLossesSection />;
      default:
        return <div>Section under development</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex flex-1 ml-64">
        <ReportsSidebar selectedView={selectedView} onViewChange={setSelectedView} />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Reports</h1>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Reports;