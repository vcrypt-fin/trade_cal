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

interface DistributionChartProps {
  data: Array<{
    id: string;
    label: string;
    trades: number;
  }>;
  title: string;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" />
            <Tooltip />
            <Bar dataKey="trades" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;