// src/components/DashboardLayout.tsx

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Stats from './Stats';
import Calendar from './Calendar';
import { TickerBar } from './TickerBar';
import { cn } from '../utils/cn';
import NewsWidget from './widgets/NewsWidget';
import EconomicCalendarWidget from './widgets/EconomicCalendarWidget';
import AddLargeWidgetModal from './AddLargeWidgetModal';
import { X } from 'lucide-react';
import { LargeWidgetType } from '../types/widget';
import LeaderboardWidget from './widgets/LeaderboardWidget';

export type LargeWidget = {
  id: string;
  type: 'news' | 'economic-calendar' | 'leaderboard';
};

const DashboardLayout: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTickerCollapsed, setIsTickerCollapsed] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [largeWidgets, setLargeWidgets] = useState<LargeWidget[]>(() => {
    // Load saved widgets from localStorage
    const saved = localStorage.getItem('largeWidgets');
    return saved ? JSON.parse(saved) : [];
  });

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('largeWidgets', JSON.stringify(largeWidgets));
  }, [largeWidgets]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const handleSymbolChange = (symbols: string[]) => {
    setSelectedSymbols(symbols);
  };

  const handleStrategyChange = (strategies: string[]) => {
    setSelectedStrategies(strategies);
  };

  const handleAddWidget = (type: LargeWidgetType) => {
    if (largeWidgets.length >= 2) return;
    
    const newWidget: LargeWidget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
    };
    
    setLargeWidgets([...largeWidgets, newWidget]);
    setIsWidgetModalOpen(false);
  };

  const handleRemoveWidget = (id: string) => {
    setLargeWidgets(largeWidgets.filter(widget => widget.id !== id));
  };

  const renderLargeWidget = (type: LargeWidgetType) => {
    console.log('Attempting to render large widget:', type);
    switch (type) {
      case 'news':
        return <NewsWidget />;
      case 'economic-calendar':
        return <EconomicCalendarWidget />;
      case 'leaderboard':
        console.log('Rendering LeaderboardWidget');
        return <LeaderboardWidget />;
      default:
        console.log('Unknown widget type:', type);
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <TickerBar
        isCollapsed={isCollapsed}
        isTickerCollapsed={isTickerCollapsed}
        onTickerToggle={() => setIsTickerCollapsed(!isTickerCollapsed)}
      />
      <div className={cn(
        'flex-1 transition-all duration-300 pt-12',
        isCollapsed ? 'ml-[60px]' : 'ml-[250px]'
      )}>
        <div className="p-4">
          <Header
            dateRange={dateRange}
            selectedSymbols={selectedSymbols}
            selectedStrategies={selectedStrategies}
            onDateRangeChange={handleDateRangeChange}
            onSymbolChange={handleSymbolChange}
            onStrategyChange={handleStrategyChange}
          />
          
          {/* Stats Section */}
          <div data-tour="stats-widgets">
            <Stats />
          </div>

          <div className="mt-8 flex gap-6">
            <div className="flex-1">
              <Calendar
                dateRange={dateRange}
                symbols={selectedSymbols}
                strategies={selectedStrategies}
              />
            </div>
            
            {/* Large Widgets Section */}
            <div className="w-[300px] relative" data-tour="large-widgets">
              {largeWidgets.length === 0 ? (
                <button
                  data-tour="add-widget"
                  onClick={() => setIsWidgetModalOpen(true)}
                  className="h-[calc(100vh-13rem)] w-full border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className="text-3xl text-white/60">+</div>
                  <span className="text-sm text-white/60">Add Large Widget</span>
                </button>
              ) : (
                <div className="h-[calc(100vh-13rem)] space-y-4">
                  {largeWidgets.map((widget) => (
                    <div 
                      key={widget.id}
                      className="relative h-[calc(50%-0.5rem)] bg-[#110420]/50 rounded-lg p-4 border border-purple-800/30"
                    >
                      <button
                        onClick={() => handleRemoveWidget(widget.id)}
                        className="absolute top-2 right-2 p-1 text-white/40 hover:text-white/60 rounded-full hover:bg-white/5"
                      >
                        <X size={16} />
                      </button>
                      {renderLargeWidget(widget.type)}
                    </div>
                  ))}
                  {largeWidgets.length < 2 && (
                    <button
                      data-tour="add-widget"
                      onClick={() => setIsWidgetModalOpen(true)}
                      className="h-[calc(50%-0.5rem)] w-full border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
                    >
                      <div className="text-3xl text-white/60">+</div>
                      <span className="text-sm text-white/60">Add Widget</span>
                    </button>
                  )}
                </div>
              )}
              <AddLargeWidgetModal
                isOpen={isWidgetModalOpen}
                onClose={() => setIsWidgetModalOpen(false)}
                onAddWidget={handleAddWidget}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;