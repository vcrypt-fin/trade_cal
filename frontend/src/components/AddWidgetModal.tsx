import React from 'react';
import { X } from 'lucide-react';
import { StatWidgetType } from '../types/widget';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: StatWidgetType, title: string) => void;
}

interface WidgetOption {
  type: StatWidgetType;
  title: string;
  description: string;
}

export const AVAILABLE_WIDGETS: WidgetOption[] = [
  { type: 'net_pnl', title: 'Net P&L', description: 'Total profit/loss for the selected period' },
  { type: 'win_rate', title: 'Win Rate', description: 'Percentage of winning trades' },
  { type: 'profit_factor', title: 'Profit Factor', description: 'Ratio of gross profit to gross loss' },
  { type: 'current_streak', title: 'Current Streak', description: 'Current winning or losing streak' },
  { type: 'gross_profit', title: 'Gross Profit', description: 'Sum of all winning trades' },
  { type: 'gross_loss', title: 'Gross Loss', description: 'Sum of all losing trades' },
  { type: 'total_trades', title: 'Total Trades', description: 'Total number of trades' },
  { type: 'average_win', title: 'Average Win', description: 'Average profit per winning trade' },
  { type: 'average_loss', title: 'Average Loss', description: 'Average loss per losing trade' },
  { type: 'largest_win', title: 'Largest Win', description: 'Largest winning trade' },
  { type: 'largest_loss', title: 'Largest Loss', description: 'Largest losing trade' },
  { type: 'win_loss_ratio', title: 'Win/Loss Ratio', description: 'Ratio of average win to average loss' },
];

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1625] rounded-lg w-full max-w-2xl border border-purple-900/20">
        <div className="flex items-center justify-between p-4 border-b border-purple-900/20">
          <h2 className="text-lg font-semibold text-gray-200">Add Widget</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-900/20 rounded-full"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_WIDGETS.map(widget => (
              <button
                key={widget.type}
                onClick={() => {
                  onAddWidget(widget.type, widget.title);
                  onClose();
                }}
                className="p-4 border border-purple-900/20 rounded-lg text-left hover:bg-purple-900/20 transition-colors"
              >
                <h3 className="font-medium mb-1 text-gray-200">{widget.title}</h3>
                <p className="text-sm text-gray-400">{widget.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal; 