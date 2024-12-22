import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { Trade } from '../types/trade';
import { Widget, StatWidgetType, WidgetData } from '../types/widget';
import StatWidget from './StatWidget';
import AddWidgetModal, { AVAILABLE_WIDGETS } from './AddWidgetModal';
import useWidgets from '../hooks/useWidgets';

const Stats: React.FC = () => {
  const { trades, filters } = useTrades();
  const { widgets, addWidget, removeWidget, updateWidgetOrder } = useWidgets();
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

  const getFilteredTrades = useCallback((trades: Trade[]) => {
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      tradeDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      const matchesDateRange = tradeDate >= startDate && tradeDate <= endDate;
      const matchesSymbol = filters.symbols.length === 0 || filters.symbols.includes(trade.symbol);
      const matchesStrategy = filters.strategies.length === 0 || filters.strategies.includes(trade.strategy);
      
      return matchesDateRange && matchesSymbol && matchesStrategy;
    });
  }, [filters]);

  const filteredTrades = React.useMemo(() => 
    getFilteredTrades(trades),
    [trades, getFilteredTrades]
  );

  const calculateWidgetData = useCallback((widget: Widget): WidgetData => {
    const widgetConfig = AVAILABLE_WIDGETS.find(w => w.type === widget.type);
    if (!widgetConfig) {
      return { value: 0, type: 'number', info: 'Unknown widget type' };
    }

    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0);
    const losingTrades = filteredTrades.filter(trade => trade.pnl < 0);
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));

    switch (widget.type) {
      case 'net_pnl':
        return {
          value: filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0),
          info: widgetConfig.description,
          type: 'currency'
        };
      case 'win_rate':
        return {
          value: filteredTrades.length > 0 
            ? +((winningTrades.length / filteredTrades.length) * 100).toFixed(1)
            : 0,
          info: widgetConfig.description,
          type: 'percent'
        };
      case 'profit_factor':
        return {
          value: grossLoss === 0 ? grossProfit : +(grossProfit / grossLoss).toFixed(2),
          info: widgetConfig.description,
          type: 'number'
        };
      case 'current_streak': {
        if (filteredTrades.length === 0) return { value: 0, type: 'number', info: widgetConfig.description };
        
        const sortedTrades = [...filteredTrades].sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime();
        });
        
        const mostRecentTrade = sortedTrades[0];
        const isWinning = mostRecentTrade.pnl > 0;
        let streak = 1;
        
        for (let i = 1; i < sortedTrades.length; i++) {
          const currentIsWin = sortedTrades[i].pnl > 0;
          if (currentIsWin === isWinning) {
            streak++;
          } else {
            break;
          }
        }
        
        return { 
          value: streak,
          info: widgetConfig.description,
          type: 'number'
        };
      }
      case 'gross_profit':
        return {
          value: grossProfit,
          info: widgetConfig.description,
          type: 'currency'
        };
      case 'gross_loss':
        return {
          value: -grossLoss,
          info: widgetConfig.description,
          type: 'currency'
        };
      case 'total_trades':
        return {
          value: filteredTrades.length,
          info: widgetConfig.description,
          type: 'number'
        };
      case 'average_win':
        return {
          value: winningTrades.length > 0 
            ? +(grossProfit / winningTrades.length).toFixed(2)
            : 0,
          info: widgetConfig.description,
          type: 'currency'
        };
      case 'average_loss':
        return {
          value: losingTrades.length > 0 
            ? -(grossLoss / losingTrades.length).toFixed(2)
            : 0,
          info: widgetConfig.description,
          type: 'currency'
        };
      case 'largest_win': {
        const largestWin = winningTrades.reduce((max, trade) => 
          trade.pnl > max.pnl ? trade : max, 
          { pnl: 0 }
        );
        return {
          value: largestWin.pnl,
          info: widgetConfig.description,
          type: 'currency'
        };
      }
      case 'largest_loss': {
        const largestLoss = losingTrades.reduce((min, trade) => 
          trade.pnl < min.pnl ? trade : min, 
          { pnl: 0 }
        );
        return {
          value: largestLoss.pnl,
          info: widgetConfig.description,
          type: 'currency'
        };
      }
      case 'win_loss_ratio': {
        const avgWin = winningTrades.length > 0 
          ? grossProfit / winningTrades.length 
          : 0;
        const avgLoss = losingTrades.length > 0 
          ? grossLoss / losingTrades.length 
          : 0;
        return {
          value: avgLoss === 0 ? avgWin : +(avgWin / avgLoss).toFixed(2),
          info: widgetConfig.description,
          type: 'number'
        };
      }
      default:
        return { value: 0, type: 'number', info: 'Unknown widget type' };
    }
  }, [filteredTrades]);

  const handleDragStart = (e: React.DragEvent, widget: Widget) => {
    setDraggedWidget(widget);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWidget: Widget) => {
    e.preventDefault();
    if (!draggedWidget) return;

    const updatedWidgets = [...widgets];
    const draggedIndex = updatedWidgets.findIndex(w => w.id === draggedWidget.id);
    const targetIndex = updatedWidgets.findIndex(w => w.id === targetWidget.id);

    updatedWidgets.splice(draggedIndex, 1);
    updatedWidgets.splice(targetIndex, 0, draggedWidget);

    updatedWidgets.forEach((widget, index) => {
      widget.position = index;
    });

    updateWidgetOrder(updatedWidgets);
  };

  const handleAddWidget = (type: StatWidgetType, title: string) => {
    addWidget(type, title);
  };

  return (
    <div className="ml-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets
          .sort((a, b) => a.position - b.position)
          .filter(widget => widget.visible)
          .slice(0, 4)
          .map(widget => (
            <StatWidget
              key={widget.id}
              widget={widget}
              data={calculateWidgetData(widget)}
              onRemove={removeWidget}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        {widgets.filter(w => w.visible).length < 4 && (
          <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="h-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
          >
            <Plus size={24} />
          </button>
        )}
      </div>
      <AddWidgetModal
        isOpen={isAddWidgetModalOpen}
        onClose={() => setIsAddWidgetModalOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};

export default Stats;