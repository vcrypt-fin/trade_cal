import React, { useState } from 'react';
import {
  Clock,
  BarChart2,
  TrendingUp,
  Tag,
  Settings,
  AlertTriangle,
  MoreHorizontal,
  Calendar,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ReportsSidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const ReportsSidebar: React.FC<ReportsSidebarProps> = ({ 
  selectedView, 
  onViewChange, 
  isCollapsed = false,
  onToggle 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    {
      id: 'dateTime',
      label: 'Date & Time',
      icon: Clock,
      link: 'dateTimeOverview',
      subItems: [
        { id: 'days', label: 'Days' },
        { id: 'weeks', label: 'Weeks' },
        { id: 'months', label: 'Months' },
        { id: 'tradeTime', label: 'Trade time' },
        { id: 'tradeDuration', label: 'Trade duration' },
      ]
    },
    {
      id: 'risk',
      label: 'Risk',
      icon: AlertTriangle,
      subItems: [
        { id: 'forecastedRR', label: 'Forecasted RR' },
        { id: 'actualRR', label: 'Actual RR' },
      ]
    },
    { id: 'setups', label: 'Setups', icon: Settings },
    { id: 'winsVsLosses', label: 'Wins vs Losses', icon: ArrowLeftRight },
  ];

  return (
    <div className={cn(
      'bg-[#120322] border-r border-purple-800/30 p-4 transition-all duration-300 min-h-screen',
      isCollapsed ? 'w-[60px]' : 'w-64'
    )}>
      {onToggle && (
        <button
          onClick={onToggle}
          className="w-full flex justify-end mb-4"
        >
          <div className="rounded-lg p-1 hover:bg-white/10">
            <ChevronLeft className={cn('h-5 w-5 transition-transform text-white', 
              isCollapsed && 'rotate-180'
            )} />
          </div>
        </button>
      )}
      {menuItems.map((item) => (
        <div key={item.id}>
          <button
            className={cn(
              'w-full rounded-lg flex items-center gap-2 mb-1',
              isCollapsed ? 'justify-center p-2' : 'text-left px-4 py-2',
              (selectedView === item.id || selectedView === item.link)
                ? 'bg-[#2A1A4A] text-purple-300' 
                : 'text-purple-200 hover:bg-[#2A1A4A]/50'
            )}
            onClick={() => {
              if (item.subItems && !isCollapsed) {
                toggleCategory(item.id);
              } else {
                onViewChange(item.link || item.id);
              }
            }}
          >
            <div className={cn(
              'flex items-center justify-center',
              isCollapsed && 'w-8 h-8'
            )}>
              <item.icon size={isCollapsed ? 28 : 18} strokeWidth={isCollapsed ? 1.5 : 2} />
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.subItems && (
                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition-transform',
                      expandedCategories[item.id] && 'rotate-180'
                    )}
                  />
                )}
              </>
            )}
          </button>
          {!isCollapsed && item.subItems && expandedCategories[item.id] && (
            <div className="ml-6 mt-1 space-y-1">
              {item.subItems.map((subItem) => (
                <button
                  key={subItem.id}
                  className={cn(
                    'w-full text-left px-4 py-2 rounded-lg text-sm',
                    selectedView === subItem.id 
                      ? 'bg-[#2A1A4A] text-purple-300' 
                      : 'text-purple-200 hover:bg-[#2A1A4A]/50'
                  )}
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