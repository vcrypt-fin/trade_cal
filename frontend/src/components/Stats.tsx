import React from 'react';
import { Info } from 'lucide-react';
import { useTrades } from '../context/TradeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  info?: string;
  type?: 'currency' | 'percent' | 'number';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, info, type = 'number' }) => {
  const getValueColor = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) : val;
    if (numValue > 0) return 'text-green-600';
    if (numValue < 0) return 'text-red-600';
    return 'text-gray-900';
  };

  const formatValue = (val: string | number) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(typeof val === 'string' ? parseFloat(val) : val);
    }
    if (type === 'percent') {
      return `${val}%`;
    }
    return val;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-600">{title}</h3>
        {info && (
          <Info size={16} className="text-gray-400 cursor-help" title={info} />
        )}
      </div>
      <p className={`text-2xl font-semibold ${getValueColor(value)}`}>
        {formatValue(value)}
      </p>
    </div>
  );
};

const Stats: React.FC = () => {
  const { trades } = useTrades();

  // Calculate Net P&L
  const netPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);

  // Calculate Profit Factor
  const winningTrades = trades.filter(trade => trade.pnl > 0);
  const losingTrades = trades.filter(trade => trade.pnl < 0);
  const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

  // Calculate Win Rate
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

  // Calculate Current Streak
  const calculateStreak = () => {
    if (trades.length === 0) return { value: 0, type: 'trades' };
    
    let streak = 1;
    let isWinning = trades[trades.length - 1].pnl > 0;
    
    for (let i = trades.length - 2; i >= 0; i--) {
      const currentIsWin = trades[i].pnl > 0;
      if (currentIsWin === isWinning) {
        streak++;
      } else {
        break;
      }
    }
    
    return { value: streak, type: isWinning ? 'winning' : 'losing' };
  };

  const streak = calculateStreak();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Net P&L"
        value={netPnl}
        info="Total profit/loss for all trades"
        type="currency"
      />
      <StatCard
        title="Win Rate"
        value={winRate.toFixed(1)}
        info="Percentage of winning trades"
        type="percent"
      />
      <StatCard
        title="Profit Factor"
        value={profitFactor}
        info="Ratio of gross profit to gross loss"
        type="number"
      />
      <StatCard
        title="Current Streak"
        value={streak.value}
        info={`Current ${streak.type} streak`}
        type="number"
      />
    </div>
  );
};

export default Stats;