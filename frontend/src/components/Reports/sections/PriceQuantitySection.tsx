import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface PriceQuantityStats {
  priceData: { date: string; price: number }[];
  volumeData: { date: string; volume: number }[];
  instrumentData: { instrument: string; trades: number; pnl: number }[];
}

const PriceQuantitySection: React.FC<{ view: string }> = ({ view }) => {
  const { trades } = useTrades();

  const stats = React.useMemo(() => {
    const priceData = trades.map(trade => ({
      date: trade.date,
      price: trade.exitPrice
    }));

    const volumeData = trades.map(trade => ({
      date: trade.date,
      volume: trade.quantity
    }));

    const instrumentData = trades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = { trades: 0, pnl: 0 };
      }
      acc[trade.symbol].trades++;
      acc[trade.symbol].pnl += trade.pnl;
      return acc;
    }, {} as Record<string, { trades: number; pnl: number }>);

    return {
      priceData,
      volumeData,
      instrumentData: Object.entries(instrumentData).map(([instrument, stats]) => ({
        instrument,
        ...stats
      }))
    };
  }, [trades]);

  const renderContent = () => {
    switch (view) {
      case 'price':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Price Analysis</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#2196F3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'volume':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Volume Analysis</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'instrument':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Instrument Analysis</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.instrumentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="instrument" />
                  <YAxis yAxisId="left" orientation="left" stroke="#4CAF50" />
                  <YAxis yAxisId="right" orientation="right" stroke="#2196F3" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="pnl" fill="#4CAF50" name="P&L" />
                  <Bar yAxisId="right" dataKey="trades" fill="#2196F3" name="Trades" />
                </BarChart>
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

export default PriceQuantitySection;