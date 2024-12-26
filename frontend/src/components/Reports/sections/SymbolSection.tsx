import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade } from '../../../types/trade';

const SymbolSection: React.FC<{ view: string }> = ({ view }) => {
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

  const symbolStats = React.useMemo(() => {
    const symbolMap = new Map();

    filteredTrades.forEach(trade => {
      if (!symbolMap.has(trade.symbol)) {
        symbolMap.set(trade.symbol, {
          id: trade.symbol,
          label: trade.symbol,
          trades: 0,
          pnl: 0,
          winningTrades: 0,
          totalProfits: 0,
          totalLoss: 0,
          volume: 0
        });
      }

      const symbolData = symbolMap.get(trade.symbol);
      symbolData.trades++;
      symbolData.pnl += trade.pnl;
      symbolData.volume += trade.quantity;

      if (trade.pnl > 0) {
        symbolData.winningTrades++;
        symbolData.totalProfits += trade.pnl;
      } else {
        symbolData.totalLoss += Math.abs(trade.pnl);
      }
    });

    return Array.from(symbolMap.values())
      .sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  return (
    <div className="space-y-4">
      {view === 'table' && (
        <StatsTable data={symbolStats} />
      )}
      {view === 'distribution' && (
        <DistributionChart data={symbolStats} title="Symbol Distribution" />
      )}
      {view === 'performance' && (
        <PerformanceChart data={symbolStats} title="Symbol Performance" />
      )}
    </div>
  );
};

export default SymbolSection; 