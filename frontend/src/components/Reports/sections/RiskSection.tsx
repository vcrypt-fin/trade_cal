import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface RiskStats {
  rMultipleData: { r: number; frequency: number }[];
  positionSizeData: { size: number; pnl: number }[];
}

const RiskSection: React.FC<{ view: string }> = ({ view }) => {
  const { trades } = useTrades();

  const stats = React.useMemo(() => {
    // Calculate R-multiple distribution
    const rMultiples = trades.map(trade => ({
      r: trade.pnl / 100, // Simplified R calculation
      frequency: 1
    }));

    // Calculate position size distribution
    const positionSizes = trades.map(trade => ({
      size: trade.quantity * trade.entryPrice,
      pnl: trade.pnl
    }));

    return {
      rMultipleData: rMultiples,
      positionSizeData: positionSizes
    };
  }, [trades]);

  const renderContent = () => {
    switch (view) {
      case 'rMultiple':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">R-Multiple Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.rMultipleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="r" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'positionSize':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Position Size vs P&L</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" name="Position Size" />
                  <YAxis dataKey="pnl" name="P&L" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    name="Trades"
                    data={stats.positionSizeData}
                    fill="#2196F3"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};

export default RiskSection;