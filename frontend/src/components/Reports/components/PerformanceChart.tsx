import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    id: string;
    label: string;
    pnl: number;
  }>;
  title: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);

  const getBarColor = (value: number) => {
    if (value > 0) return '#4CAF50';  // Green
    if (value < 0) return '#EF4444';  // Red
    return '#1F2937';  // Black for zero
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="label" 
              type="category" 
              width={50}  // Control the width of the Y-axis
              style={{ fontSize: '11px' }}  // Reduce font size
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar 
              dataKey="pnl" 
              fill={(data: any) => getBarColor(data.pnl)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;