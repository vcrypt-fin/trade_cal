import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
);

const DateTimeSection: React.FC<{ view: string }> = ({ view }) => {
  const { trades } = useTrades();

  const dayStats = React.useMemo(() => {
    const stats = DAYS_OF_WEEK.map((day, index) => ({
      id: `day-${index}`,
      label: day.substring(0, 3),  // Use abbreviated day names
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

  const renderTradeTime = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trading Time Analysis</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={timeStats}
          title="Trade Distribution by Hour"
        />
        <PerformanceChart 
          data={timeStats}
          title="Performance by Hour"
        />
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
        <DistributionChart 
          data={dayStats}
          title="Trade Distribution by Day of Week"
        />
        <PerformanceChart 
          data={dayStats}
          title="Performance by Day of Week"
        />
      </div>

      <StatsTable data={dayStats} />
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'days':
        return renderDays();
      case 'tradeTime':
        return renderTradeTime();
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