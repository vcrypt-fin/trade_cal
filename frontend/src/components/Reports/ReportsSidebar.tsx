import React from 'react';
import {
  Clock,
  BarChart2,
  TrendingUp,
  Tag,
  Settings,
  AlertTriangle,
  MoreHorizontal,
  Calendar,
  ArrowLeftRight
} from 'lucide-react';

interface ReportsSidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const ReportsSidebar: React.FC<ReportsSidebarProps> = ({ selectedView, onViewChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    {
      id: 'dateTime',
      label: 'Date & Time',
      icon: Clock,
      subItems: [
        { id: 'days', label: 'Days' },
        { id: 'weeks', label: 'Weeks' },
        { id: 'months', label: 'Months' },
        { id: 'tradeTime', label: 'Trade time' },
        { id: 'tradeDuration', label: 'Trade duration' },
      ]
    },
    {
      id: 'priceQuantity',
      label: 'Price & Quantity',
      icon: TrendingUp,
      subItems: [
        { id: 'price', label: 'Price' },
        { id: 'volume', label: 'Volume' },
        { id: 'instrument', label: 'Instrument' },
      ]
    },
    {
      id: 'risk',
      label: 'Risk',
      icon: AlertTriangle,
      subItems: [
        { id: 'rMultiple', label: 'R-Multiple' },
        { id: 'positionSize', label: 'Position Size' },
      ]
    },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'setups', label: 'Setups', icon: Settings },
    { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
    { id: 'other', label: 'Other', icon: MoreHorizontal },
    { id: 'winsVsLosses', label: 'Wins vs Losses', icon: ArrowLeftRight },
    { id: 'compare', label: 'Compare', icon: BarChart2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      {menuItems.map((item) => (
        <div key={item.id}>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedView === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
          {item.subItems && (
            <div className="ml-6 mt-1">
              {item.subItems.map((subItem) => (
                <button
                  key={subItem.id}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                    selectedView === subItem.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onViewChange(subItem.id)}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportsSidebar;