import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';

export type WidgetType = 'news' | 'economic-calendar';

interface WidgetSelectorProps {
  onSelect: (type: WidgetType) => void;
  onClose: () => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onSelect, onClose }) => {
  const widgets = [
    {
      type: 'news' as WidgetType,
      title: 'Market News',
      description: 'Real-time market news and updates',
      icon: Newspaper
    },
    {
      type: 'economic-calendar' as WidgetType,
      title: 'Economic Calendar',
      description: 'Upcoming economic events and releases',
      icon: Calendar
    }
  ];

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#110420] border border-purple-800/30 rounded-lg p-6 w-[400px]">
        <h3 className="text-lg font-semibold text-white mb-4">Add Widget</h3>
        <div className="space-y-3">
          {widgets.map((widget) => (
            <button
              key={widget.type}
              className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-start gap-4"
              onClick={() => {
                onSelect(widget.type);
                onClose();
              }}
            >
              <widget.icon className="text-white/60 mt-1" size={20} />
              <div className="text-left">
                <h4 className="text-white font-medium">{widget.title}</h4>
                <p className="text-white/60 text-sm">{widget.description}</p>
              </div>
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full py-2 text-white/60 hover:text-white/80 text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WidgetSelector; 