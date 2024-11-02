import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';

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
  const { trades } = useTrades();
  const DURATION_BUCKETS = React.useMemo(() => createDurationBuckets(trades), [trades]);

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

    trades.forEach(trade => {
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
  }, [trades]);

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

    trades.forEach(trade => {
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
  }, [trades]);

  const weekStats = React.useMemo(() => {
    const weekMap = new Map();
    
    trades.forEach(trade => {
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
  }, [trades]);
  // Add monthStats calculation inside DateTimeSection component
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

    trades.forEach(trade => {
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
  }, [trades]);

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

    trades.forEach(trade => {
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
  }, [trades, DURATION_BUCKETS]);


  const renderTradeTime = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trading Time Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart data={timeStats} title="Trade Distribution by Hour" />
        <PerformanceChart data={timeStats} title="Performance by Hour" />
      </div>
      <StatsTable data={timeStats} />
    </div>
  );

  const renderDays = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trading Days Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart data={dayStats} title="Trade Distribution by Day of Week" />
        <PerformanceChart data={dayStats} title="Performance by Day of Week" />
      </div>
      <StatsTable data={dayStats} />
    </div>
  );

  const renderWeek = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Weekly Trading Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={weekStats} 
          title="Trade Distribution by Week"
        />
        <PerformanceChart 
          data={weekStats} 
          title="Performance by Week"
          
        />
      </div>
      <StatsTable data={weekStats} />
    </div>
  );
  // Add renderMonth function
  const renderMonth = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Monthly Trading Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={monthStats} 
          title="Trade Distribution by Month"
        />
        <PerformanceChart 
          data={monthStats} 
          title="Performance by Month"
        />
      </div>
      <StatsTable data={monthStats} />
    </div>
  );

  const renderDuration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trade Duration Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={durationStats} 
          title="Trade Distribution by Duration"
        />
        <PerformanceChart 
          data={durationStats} 
          title="Performance by Duration"
        />
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
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      {renderContent()}
    </div>
  );
};

export default DateTimeSection;