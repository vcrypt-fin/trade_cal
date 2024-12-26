import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade, StatItem } from '../../../types/trade';

const SetupsSection: React.FC = () => {
  const { trades, playbooks } = useTrades();

  const setupStats = React.useMemo(() => {
    const stats = new Map<string, StatItem>();

    (trades as Trade[]).forEach((trade: Trade) => {
      if (!trade.strategy) return;
      
      // Find the playbook name for this strategy
      const playbook = playbooks.find(p => p.id === trade.strategy);
      if (!playbook) return;

      if (!stats.has(trade.strategy)) {
        stats.set(trade.strategy, {
          id: trade.strategy,
          label: playbook.name, // Use playbook name instead of ID
          trades: 0,
          pnl: 0,
          winningTrades: 0,
          totalProfits: 0,
          totalLoss: 0,
          volume: 0
        });
      }

      const setupStat = stats.get(trade.strategy)!;
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
  }, [trades, playbooks]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-100">Setups Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <DistributionChart 
            data={setupStats} 
            title="Trade Distribution by Setup"
          />
        </div>
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <PerformanceChart 
            data={setupStats} 
            title="Performance by Setup"
          />
        </div>
      </div>
      <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
        <StatsTable data={setupStats} />
      </div>
    </div>
  );
};

export default SetupsSection; 