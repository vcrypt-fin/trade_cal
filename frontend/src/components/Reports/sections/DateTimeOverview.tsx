import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Clock, Calendar, Timer } from 'lucide-react';

const DateTimeOverview: React.FC = () => {
  const { trades, filters } = useTrades();

  // Get filtered trades
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

  // Reuse the stats calculations from DateTimeSection
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayStats = React.useMemo(() => {
    const stats = DAYS_OF_WEEK.map((day, index) => ({
      id: `day-${index}`,
      label: day.substring(0, 3),
      dayIndex: index,
      trades: 0,
      pnl: 0,
      winningTrades: 0,
      totalProfits: 0,
      totalLoss: 0,
      volume: 0
    }));

    filteredTrades.forEach(trade => {
      const date = new Date(trade.date);
      const dayIndex = date.getDay();
      
      stats[dayIndex].trades++;
      stats[dayIndex].pnl += trade.pnl;
      stats[dayIndex].volume += trade.quantity;
      
      if (trade.pnl > 0) {
        stats[dayIndex].winningTrades++;
        stats[dayIndex].totalProfits += trade.pnl;
      } else {
        stats[dayIndex].totalLoss += Math.abs(trade.pnl);
      }
    });

    return stats;
  }, [filteredTrades]);

  const timeStats = React.useMemo(() => {
    const stats = HOURS.map(hour => ({
      id: `hour-${hour}`,
      label: hour,
      trades: 0,
      pnl: 0,
      winningTrades: 0,
      totalProfits: 0,
      totalLoss: 0,
      volume: 0
    }));

    filteredTrades.forEach(trade => {
      const hour = trade.time.split(':')[0];
      const hourIndex = parseInt(hour, 10);
      
      stats[hourIndex].trades++;
      stats[hourIndex].pnl += trade.pnl;
      stats[hourIndex].volume += trade.quantity;
      
      if (trade.pnl > 0) {
        stats[hourIndex].winningTrades++;
        stats[hourIndex].totalProfits += trade.pnl;
      } else {
        stats[hourIndex].totalLoss += Math.abs(trade.pnl);
      }
    });

    return stats;
  }, [filteredTrades]);

  const monthStats = React.useMemo(() => {
    const stats = MONTHS.map((month, index) => ({
      id: `month-${index}`,
      label: month.substring(0, 3),
      trades: 0,
      pnl: 0,
      winningTrades: 0,
      totalProfits: 0,
      totalLoss: 0,
      volume: 0
    }));

    filteredTrades.forEach(trade => {
      const date = new Date(trade.date);
      const monthIndex = date.getMonth();
      
      stats[monthIndex].trades++;
      stats[monthIndex].pnl += trade.pnl;
      stats[monthIndex].volume += trade.quantity;
      
      if (trade.pnl > 0) {
        stats[monthIndex].winningTrades++;
        stats[monthIndex].totalProfits += trade.pnl;
      } else {
        stats[monthIndex].totalLoss += Math.abs(trade.pnl);
      }
    });

    return stats;
  }, [filteredTrades]);

  return (
    <div className="space-y-8">
      <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-purple-100">Trading Time Analysis</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <DistributionChart data={timeStats} title="Trade Distribution by Hour" />
          <PerformanceChart data={timeStats} title="Performance by Hour" />
        </div>
      </div>

      <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-purple-100">Trading Days Analysis</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <DistributionChart data={dayStats} title="Trade Distribution by Day" />
          <PerformanceChart data={dayStats} title="Performance by Day" />
        </div>
      </div>

      <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Timer className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-purple-100">Monthly Trading Analysis</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <DistributionChart data={monthStats} title="Trade Distribution by Month" />
          <PerformanceChart data={monthStats} title="Performance by Month" />
        </div>
      </div>
    </div>
  );
};

export default DateTimeOverview; 