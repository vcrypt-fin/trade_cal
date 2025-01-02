import React from 'react';
import { X, Newspaper, Calendar, Trophy } from 'lucide-react';
import { LargeWidgetType, LARGE_WIDGETS } from '../types/widget';

interface AddLargeWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: LargeWidgetType) => void;
}

const WIDGET_ICONS = {
  'news': Newspaper,
  'economic-calendar': Calendar,
  'leaderboard': Trophy
} as const;

const AddLargeWidgetModal: React.FC<AddLargeWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  console.log('AddLargeWidgetModal rendered with widgets:', LARGE_WIDGETS);

  if (!isOpen) return null;

  const handleAddWidget = (type: LargeWidgetType) => {
    console.log('Adding widget:', type);
    onAddWidget(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1625] rounded-lg w-full max-w-lg border border-purple-900/20">
        <div className="flex items-center justify-between p-4 border-b border-purple-900/20">
          <h2 className="text-lg font-semibold text-gray-200">Add Large Widget</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-900/20 rounded-full"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {LARGE_WIDGETS.map(widget => {
              const Icon = WIDGET_ICONS[widget.type];
              return (
                <button
                  key={widget.type}
                  onClick={() => handleAddWidget(widget.type)}
                  className="w-full p-4 border border-purple-900/20 rounded-lg flex items-start gap-4 hover:bg-purple-900/20 transition-colors"
                >
                  <Icon className="text-purple-700 mt-1 stroke-[2.5px]" size={24} />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-200">{widget.title}</h3>
                    <p className="text-sm text-gray-400">{widget.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLargeWidgetModal; 