import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from 'recharts';

const WinsVsLossesSection: React.FC = () => {
  const { trades } = useTrades();

  const stats = React.useMemo(() => {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const breakEvenTrades = trades.filter(t => t.pnl === 0);

    const data = [
      {
        name: 'Winning Trades',
        value: winningTrades.length,
        totalPnl: winningTrades.reduce((sum, t) => sum + t.pnl, 0),
        color: '#4CAF50'
      },
      {
        name: 'Losing Trades',
        value: losingTrades.length,
        totalPnl: losingTrades.reduce((sum, t) => sum + t.pnl, 0),
        color: '#EF4444'
      },
      {
        name: 'Break Even',
        value: breakEvenTrades.length,
        totalPnl: 0,
        color: '#9CA3AF'
      }
    ].filter(item => item.value > 0); // Only show categories that have trades

    return data;
  }, [trades]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);

  if (trades.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Wins vs Losses Analysis</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          No trades available for analysis
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Wins vs Losses Analysis</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-sm text-gray-600 mb-2">{stat.name}</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-gray-500">
                ({((stat.value / trades.length) * 100).toFixed(1)}%)
              </p>
            </div>
            <p className={`text-sm ${
              stat.totalPnl > 0 ? 'text-green-600' : 
              stat.totalPnl < 0 ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {formatCurrency(stat.totalPnl)}
            </p>
          </div>
        ))}
      </div>

      {stats.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({name, value, percent}) => 
                    `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} trades (${((value / trades.length) * 100).toFixed(1)}%)`,
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinsVsLossesSection; 