import React from 'react';

interface StatsTableProps {
  data: Array<{
    id: string;
    label: string;
    pnl: number;
    winningTrades: number;
    trades: number;
    totalProfits: number;
    totalLoss: number;
    volume: number;
  }>;
}

const StatsTable: React.FC<StatsTableProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);

    const colorClass = value === 0 ? 'text-purple-200' : 
                      value > 0 ? 'text-green-400' : 
                      'text-red-400';

    return { formatted, colorClass };
  };

  const getWinRateColor = (trades: number, winningTrades: number) => {
    if (trades === 0) return 'text-purple-200';
    const winRate = (winningTrades / trades) * 100;
    if (winRate >= 50) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-purple-800/30">
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Net Profits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Winning %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Total Profits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Total Loss</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Trades</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-800/30">
          {data.map((stat) => {
            const pnlFormatted = formatCurrency(stat.pnl);
            const profitsFormatted = formatCurrency(stat.totalProfits);
            const lossFormatted = formatCurrency(stat.totalLoss);

            return (
              <tr key={stat.id} className="hover:bg-purple-900/20">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">{stat.label}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${pnlFormatted.colorClass}`}>
                  {pnlFormatted.formatted}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getWinRateColor(stat.trades, stat.winningTrades)}`}>
                  {stat.trades > 0 
                    ? `${((stat.winningTrades / stat.trades) * 100).toFixed(1)}%`
                    : '-'
                  }
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${profitsFormatted.colorClass}`}>
                  {profitsFormatted.formatted}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${lossFormatted.colorClass}`}>
                  {lossFormatted.formatted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  {stat.trades}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  {stat.volume}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;