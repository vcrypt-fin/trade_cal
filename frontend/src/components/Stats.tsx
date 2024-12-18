import React from 'react';
import { Info } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { Trade } from '../types/trade';

interface StatCardProps {
  title: string;
  value: string | number;
  info?: string;
  type?: 'currency' | 'percent' | 'number';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, info, type = 'number', className }) => {
  const getValueColor = (val: string | number) => {
    if (className) return className;
    
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
          <div className="relative group">
            <Info 
              size={16} 
              className="text-gray-400 cursor-help"
              aria-label={info}
            />
            <div className="hidden group-hover:block absolute z-50 p-2 bg-gray-800 text-white text-sm rounded shadow-lg -right-2 top-6 w-48">
              {info}
            </div>
          </div>
        )}
      </div>
      <p className={`text-2xl font-semibold ${getValueColor(value)}`}>
        {formatValue(value)}
      </p>
    </div>
  );
};

const getFilteredTrades = (trades: Trade[], filters: any) => {
  console.log('=== Filter Debug ===');
  console.log('Current filters:', {
    startDate: filters.startDate,
    endDate: filters.endDate,
    symbols: filters.symbols,
    strategies: filters.strategies
  });
  console.log('Total trades before filtering:', trades.length);

  // Log a sample trade for debugging
  if (trades.length > 0) {
    console.log('Sample trade date format:', trades[0].date);
  }

  const filtered = trades.filter(trade => {
    // Parse dates properly
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
    
    // Detailed logging for first few trades
    if (trades.indexOf(trade) < 3) {
      console.log(`Trade ${trade.id} (${trade.date}):`, {
        tradeDate: tradeDate.toISOString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        matchesDateRange,
        matchesSymbol,
        matchesStrategy
      });
    }

    return matchesDateRange && matchesSymbol && matchesStrategy;
  });

  console.log('Filtered trades count:', filtered.length);
  console.log('=== End Filter Debug ===');
  return filtered;
};

const Stats: React.FC = () => {
  const { trades, filters } = useTrades();
  
  console.log('Stats rendered with filters:', filters);
  
  // Log whenever filters change
  React.useEffect(() => {
    console.log('=== Stats Component Update ===');
    console.log('Filters updated:', filters);
    console.log('Available trades:', trades.length);
    console.log('=== End Stats Update ===');
  }, [trades, filters]);

  const filteredTrades = React.useMemo(() => {
    console.log('Stats: Recalculating filtered trades with filters:', filters);
    return getFilteredTrades(trades, filters);
  }, [trades, filters]);

  const netPnl = React.useMemo(() => 
    filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0),
    [filteredTrades]
  );

  const { winningTrades, losingTrades } = React.useMemo(() => ({
    winningTrades: filteredTrades.filter(trade => trade.pnl > 0),
    losingTrades: filteredTrades.filter(trade => trade.pnl < 0)
  }), [filteredTrades]);

  const { grossProfit, grossLoss, profitFactor } = React.useMemo(() => {
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
    return {
      grossProfit,
      grossLoss,
      profitFactor: grossLoss === 0 ? grossProfit : +(grossProfit / grossLoss).toFixed(2)
    };
  }, [winningTrades, losingTrades]);

  const winRate = React.useMemo(() => 
    filteredTrades.length > 0 
      ? +((winningTrades.length / filteredTrades.length) * 100).toFixed(1)
      : 0,
    [filteredTrades.length, winningTrades.length]
  );

  const calculateStreak = () => {
    if (filteredTrades.length === 0) return { value: 0, type: 'none' };
    
    // Sort trades by date and time to ensure most recent is first
    const sortedTrades = [...filteredTrades].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Get the most recent trade
    const mostRecentTrade = sortedTrades[0];
    const isWinning = mostRecentTrade.pnl > 0;
    let streak = 1;
    
    // Count consecutive trades of the same type
    for (let i = 1; i < sortedTrades.length; i++) {
      const currentIsWin = sortedTrades[i].pnl > 0;
      if (currentIsWin === isWinning) {
        streak++;
      } else {
        break;
      }
    }
    
    return { 
      value: streak, 
      type: isWinning ? 'winning' : mostRecentTrade.pnl < 0 ? 'losing' : 'none' 
    };
  };

  const streak = calculateStreak();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Net P&L"
        value={netPnl}
        info={`Filtered P&L from ${filters.startDate} to ${filters.endDate}`}
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
        value={profitFactor.toFixed(2)}
        info="Ratio of gross profit to gross loss"
        type="number"
      />
      <StatCard
        title="Current Streak"
        value={streak.value}
        info={`Current ${streak.type} streak`}
        type="number"
        className={streak.value === 0 ? 'text-gray-900' : streak.type === 'winning' ? 'text-green-600' : 'text-red-600'}
      />
    </div>
  );
};

export default Stats;