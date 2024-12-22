import { useState, useEffect } from 'react';
import { Widget, StatWidgetType } from '../types/widget';

const DEFAULT_WIDGETS: Widget[] = [
  { id: '1', type: 'net_pnl', position: 0, title: 'Net P&L', visible: true },
  { id: '2', type: 'win_rate', position: 1, title: 'Win Rate', visible: true },
  { id: '3', type: 'profit_factor', position: 2, title: 'Profit Factor', visible: true },
  { id: '4', type: 'current_streak', position: 3, title: 'Current Streak', visible: true },
];

export const useWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem('dashboard_widgets');
    return savedWidgets ? JSON.parse(savedWidgets) : DEFAULT_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (type: StatWidgetType, title: string) => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: widgets.length,
      title,
      visible: true,
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidgetOrder = (updatedWidgets: Widget[]) => {
    setWidgets(updatedWidgets);
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidgetOrder,
    toggleWidgetVisibility,
  };
};

export default useWidgets; 