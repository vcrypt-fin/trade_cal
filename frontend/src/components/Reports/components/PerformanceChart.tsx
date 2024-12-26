// src/components/Stats/components/PerformanceChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    id: string;
    label: string;
    pnl: number;
  }>;
  title: string;
  onBarClick?: (label: string) => void; // Optional click handler
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title, onBarClick }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);

  const getBarColor = (value: number) => {
    if (value > 0) return '#4CAF50'; // Green for positive P&L
    if (value < 0) return '#EF4444'; // Red for negative P&L
    return '#1F2937'; // Gray for zero P&L
  };

  const handleBarClick = (data: any) => {
    if (onBarClick) {
      onBarClick(data.label);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-4 text-purple-100">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2A1A4A" />
            <XAxis 
              type="number" 
              tickFormatter={(value) => formatCurrency(value)} 
              stroke="#A78BFA"
            />
            <YAxis 
              dataKey="label" 
              type="category" 
              width={50}  
              style={{ fontSize: '11px' }}
              stroke="#A78BFA"
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)} 
              contentStyle={{ 
                backgroundColor: '#120322', 
                border: '1px solid #2A1A4A',
                color: '#E9D5FF'
              }}
            />
            <Bar dataKey="pnl">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.pnl)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
