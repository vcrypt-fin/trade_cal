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
  const colors = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF', '#EEF2FF'];

  const handleBarClick = (data: any) => {
    if (onBarClick) {
      onBarClick(data.label);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            onClick={handleBarClick} // Attach click handler to the chart
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="label" 
              type="category" 
              width={50}  
              style={{ fontSize: '11px' }}  
            />
            <Tooltip />
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
