import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade } from '../../../types/trade';

const StrategySection: React.FC<{ view: string }> = ({ view }) => {
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

  const strategyStats = React.useMemo(() => {
    const strategyMap = new Map();

    filteredTrades.forEach(trade => {
      const strategy = trade.strategy || 'No Strategy';
      if (!strategyMap.has(strategy)) {
        strategyMap.set(strategy, {
          id: strategy,
          label: strategy,
          trades: 0,
          pnl: 0,
          winningTrades: 0,
          totalProfits: 0,
          totalLoss: 0,
          volume: 0
        });
      }

      const strategyData = strategyMap.get(strategy);
      strategyData.trades++;
      strategyData.pnl += trade.pnl;
      strategyData.volume += trade.quantity;

      if (trade.pnl > 0) {
        strategyData.winningTrades++;
        strategyData.totalProfits += trade.pnl;
      } else {
        strategyData.totalLoss += Math.abs(trade.pnl);
      }
    });

    return Array.from(strategyMap.values())
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  return (
    <div className="space-y-4">
      {view === 'table' && (
        <StatsTable data={strategyStats} />
      )}
      {view === 'distribution' && (
        <DistributionChart data={strategyStats} title="Strategy Distribution" />
      )}
      {view === 'performance' && (
        <PerformanceChart data={strategyStats} title="Strategy Performance" />
      )}
    </div>
  );
};

export default StrategySection; 