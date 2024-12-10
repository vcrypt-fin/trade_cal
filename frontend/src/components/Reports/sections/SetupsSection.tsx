import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade, StatItem } from '../../../types/trade';

const SetupsSection: React.FC = () => {
  const { trades } = useTrades();

  const setupStats = React.useMemo(() => {
    const stats = new Map<string, StatItem>();

    (trades as Trade[]).forEach((trade: Trade) => {
      if (!trade.setup) return;
      
      if (!stats.has(trade.setup)) {
        stats.set(trade.setup, {
          id: trade.setup,
          label: trade.setup,
          trades: 0,
          pnl: 0,
          winningTrades: 0,
          totalProfits: 0,
          totalLoss: 0,
          volume: 0
        });
      }

      const setupStat = stats.get(trade.setup)!;
      setupStat.trades++;
      setupStat.pnl += trade.pnl;
      setupStat.volume += trade.quantity;

      if (trade.pnl > 0) {
        setupStat.winningTrades++;
        setupStat.totalProfits += trade.pnl;
      } else {
        setupStat.totalLoss += Math.abs(trade.pnl);
      }
    });

    return Array.from(stats.values());
  }, [trades]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Setups Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={setupStats} 
          title="Trade Distribution by Setup"
        />
        <PerformanceChart 
          data={setupStats} 
          title="Performance by Setup"
        />
      </div>
      <StatsTable data={setupStats} />
    </div>
  );
};

export default SetupsSection; 