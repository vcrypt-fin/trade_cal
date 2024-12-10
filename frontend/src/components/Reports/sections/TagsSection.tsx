import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatsTable from '../components/StatsTable';
import DistributionChart from '../components/DistributionChart';
import PerformanceChart from '../components/PerformanceChart';
import { Trade, StatItem } from '../../../types/trade';

const TagsSection: React.FC = () => {
  const { trades } = useTrades();

  const tagStats = React.useMemo(() => {
    const stats = new Map<string, StatItem>();

    (trades as Trade[]).forEach((trade: Trade) => {
      if (!trade.tags) return;
      
      trade.tags.forEach((tag: string) => {
        if (!stats.has(tag)) {
          stats.set(tag, {
            id: tag,
            label: tag,
            trades: 0,
            pnl: 0,
            winningTrades: 0,
            totalProfits: 0,
            totalLoss: 0,
            volume: 0
          });
        }

        const tagStat = stats.get(tag)!;
        tagStat.trades++;
        tagStat.pnl += trade.pnl;
        tagStat.volume += trade.quantity;

        if (trade.pnl > 0) {
          tagStat.winningTrades++;
          tagStat.totalProfits += trade.pnl;
        } else {
          tagStat.totalLoss += Math.abs(trade.pnl);
        }
      });
    });

    return Array.from(stats.values());
  }, [trades]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tags Analysis</h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <DistributionChart 
          data={tagStats} 
          title="Trade Distribution by Tag"
        />
        <PerformanceChart 
          data={tagStats} 
          title="Performance by Tag"
        />
      </div>
      <StatsTable data={tagStats} />
    </div>
  );
};

export default TagsSection; 