import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade } from '../../../types/trade';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
// Dynamic bucket generation
const createDurationBuckets = (trades: Trade[]) => {
  return [
    { min: 0, max: 5, label: '0-5m' },
    { min: 5, max: 15, label: '5-15m' },
    { min: 15, max: 30, label: '15-30m' },
    { min: 30, max: 60, label: '30-60m' },
    { min: 60, max: 120, label: '1-2h' },
    { min: 120, max: 240, label: '2-4h' },
    { min: 240, max: Infinity, label: '4h+' }
  ];
};

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getWeekRange = (date: Date) => {
  const week = getWeekNumber(date);
  const year = date.getFullYear();
  
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfWeek = new Date(firstDayOfYear);
  firstDayOfWeek.setDate(firstDayOfYear.getDate() + ((week - 1) * 7));
  
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
};

// Helper to calculate trade duration in minutes
const getTradeMinutes = (trade: any) => {
  const entryTime = new Date(`${trade.date}T${trade.time}`);
  const exitTime = new Date(`${trade.date}T${trade.exitTime}`);
  return Math.round((exitTime.getTime() - entryTime.getTime()) / 1000 / 60);
};

const DateTimeSection: React.FC<{ view: string }> = ({ view }) => {
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

  const DURATION_BUCKETS = React.useMemo(() => createDurationBuckets(filteredTrades), [filteredTrades]);

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
      hour,
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

  const weekStats = React.useMemo(() => {
    const weekMap = new Map();
    
    filteredTrades.forEach(trade => {
      const date = new Date(trade.date);
      const weekNum = getWeekNumber(date);
      const year = date.getFullYear();
      const weekKey = `${year}-W${weekNum}`;
      const weekRange = getWeekRange(date);
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          id: weekKey,
          label: weekRange,
          weekNumber: weekNum,
          trades: 0,
          pnl: 0,
          winningTrades: 0,
          totalProfits: 0,
          totalLoss: 0,
          volume: 0
        });
      }
      
      const weekData = weekMap.get(weekKey);
      weekData.trades++;
      weekData.pnl += trade.pnl;
      weekData.volume += trade.quantity;
      
      if (trade.pnl > 0) {
        weekData.winningTrades++;
        weekData.totalProfits += trade.pnl;
      } else {
        weekData.totalLoss += Math.abs(trade.pnl);
      }
    });

    return Array.from(weekMap.values())
      .sort((a, b) => a.weekNumber - b.weekNumber);
  }, [filteredTrades]);

  const monthStats = React.useMemo(() => {
    const stats = MONTHS.map((month, index) => ({
      id: `month-${index}`,
      label: month.substring(0, 3),
      monthIndex: index,
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

  const durationStats = React.useMemo(() => {
    const stats = DURATION_BUCKETS.map((bucket, index) => ({
      id: `duration-${index}`,
      label: bucket.label,
      min: bucket.min,
      max: bucket.max,
      trades: 0,
      pnl: 0,
      winningTrades: 0,
      totalProfits: 0,
      totalLoss: 0,
      volume: 0
    }));

    filteredTrades.forEach(trade => {
      // Assuming each tick represents ~1 minute of trading time
      const priceChange = Math.abs(trade.exitPrice - trade.entryPrice);
      const estimatedMinutes = Math.max(1, Math.round(priceChange));
      
      const bucketIndex = DURATION_BUCKETS.findIndex(
        bucket => estimatedMinutes >= bucket.min && estimatedMinutes < bucket.max
      );
      
      if (bucketIndex === -1) return;
      
      stats[bucketIndex].trades++;
      stats[bucketIndex].pnl += trade.pnl || 0;
      stats[bucketIndex].volume += trade.quantity;
      
      if (trade.pnl > 0) {
        stats[bucketIndex].winningTrades++;
        stats[bucketIndex].totalProfits += trade.pnl;
      } else if (trade.pnl < 0) {
        stats[bucketIndex].totalLoss += Math.abs(trade.pnl);
      }
    });

    return stats;
  }, [filteredTrades, DURATION_BUCKETS]);


  const renderTradeTime = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Trading Time Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart data={timeStats} title="Trade Distribution by Hour" />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart data={timeStats} title="Performance by Hour" />
        </div>
      </div>
      <StatsTable data={timeStats} />
    </div>
  );

  const renderDays = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Trading Days Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart data={dayStats} title="Trade Distribution by Day of Week" />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart data={dayStats} title="Performance by Day of Week" />
        </div>
      </div>
      <StatsTable data={dayStats} />
    </div>
  );

  const renderWeek = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Weekly Trading Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart 
            data={weekStats} 
            title="Trade Distribution by Week"
          />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart 
            data={weekStats} 
            title="Performance by Week"
          />
        </div>
      </div>
      <StatsTable data={weekStats} />
    </div>
  );
  // Add renderMonth function
  const renderMonth = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Monthly Trading Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart 
            data={monthStats} 
            title="Trade Distribution by Month"
          />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart 
            data={monthStats} 
            title="Performance by Month"
          />
        </div>
      </div>
      <StatsTable data={monthStats} />
    </div>
  );

  const renderDuration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Trade Duration Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart 
            data={durationStats} 
            title="Trade Distribution by Duration"
          />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart 
            data={durationStats} 
            title="Performance by Duration"
          />
        </div>
      </div>
      <StatsTable data={durationStats} />
    </div>
  );


  const renderContent = () => {
    switch (view) {
      case 'days':
        return renderDays();
      case 'tradeTime':
        return renderTradeTime();
      case 'weeks':
        return renderWeek();
      case 'months':
        return renderMonth();
      case 'tradeDuration':
        return renderDuration();
      case 'dateTime':
        return (
          <div className="space-y-8">
            {renderTradeTime()}
            {renderDays()}
            {renderWeek()}
            {renderMonth()}
            {renderDuration()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default DateTimeSection;