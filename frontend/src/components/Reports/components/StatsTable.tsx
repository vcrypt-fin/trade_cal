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
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);

  const getPnLColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-900';  // Black for zero
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winning %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loss</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trades</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((stat) => (
            <tr key={stat.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.label}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${getPnLColor(stat.pnl)}`}>
                {formatCurrency(stat.pnl)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.trades > 0 
                  ? `${((stat.winningTrades / stat.trades) * 100).toFixed(1)}%`
                  : '-'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                {formatCurrency(stat.totalProfits)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                {formatCurrency(stat.totalLoss)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.trades}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {stat.volume}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;