// src/components/Stats/components/DistributionChart.tsx
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

interface DistributionChartProps {
  data: Array<{
    id: string;
    label: string;
    trades: number;
  }>;
  title: string;
  onBarClick?: (label: string) => void; // Optional click handler
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, title, onBarClick }) => {
  const colors = ['#4CAF50']; // Single green color for all bars

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
            <XAxis type="number" stroke="#A78BFA" />
            <YAxis 
              dataKey="label" 
              type="category" 
              width={50}  
              style={{ fontSize: '11px' }}
              stroke="#A78BFA"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#120322', 
                border: '1px solid #2A1A4A',
                color: '#E9D5FF'
              }} 
            />
            <Bar dataKey="trades">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;
