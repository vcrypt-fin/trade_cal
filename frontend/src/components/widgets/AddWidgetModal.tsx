import React from 'react';
import { X } from 'lucide-react';
import { StatWidgetType, Widget } from '../../types/widget';
import './AddWidgetModal.css';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: StatWidgetType, title: string) => void;
  activeWidgets?: Widget[];
  isSingleTradeView?: boolean;
}

interface WidgetOption {
  type: StatWidgetType;
  title: string;
  description: string;
  singleTradeOnly?: boolean;
}

export const AVAILABLE_WIDGETS: WidgetOption[] = [
  // Standard widgets for all views
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
  { type: 'average_rr', title: 'Average R:R', description: 'Average actual risk-to-reward ratio across all trades' },
  
  // Trade-specific widgets (only shown in SingleTradeView)
  { 
    type: 'total_trades', 
    title: 'Position Size', 
    description: 'Number of contracts/shares traded',
    singleTradeOnly: true 
  },
  { 
    type: 'gross_profit', 
    title: 'Risk Amount', 
    description: 'Amount risked in this trade based on stop loss',
    singleTradeOnly: true 
  },
  { 
    type: 'gross_loss', 
    title: 'Potential Reward', 
    description: 'Potential reward based on take profit target',
    singleTradeOnly: true 
  },
  { 
    type: 'largest_win', 
    title: 'Return %', 
    description: 'Percentage return on this trade',
    singleTradeOnly: true 
  },
  { 
    type: 'largest_loss', 
    title: 'Slippage', 
    description: 'Slippage from target price (if exited beyond target)',
    singleTradeOnly: true 
  },
  { 
    type: 'current_streak', 
    title: 'Trade Duration', 
    description: 'Time spent in the trade',
    singleTradeOnly: true 
  },
  { 
    type: 'win_rate', 
    title: 'Price Volatility', 
    description: 'Price range between stop loss and take profit',
    singleTradeOnly: true 
  },
  { 
    type: 'average_win', 
    title: 'Average Fill', 
    description: 'Average fill price for entry and exit',
    singleTradeOnly: true 
  },
  { 
    type: 'average_loss', 
    title: 'Commission', 
    description: 'Total commission and fees for this trade',
    singleTradeOnly: true 
  }
];

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
  activeWidgets = [],
  isSingleTradeView = false
}) => {
  if (!isOpen) return null;

  const isWidgetActive = (type: StatWidgetType) => {
    return activeWidgets.some(widget => widget.type === type && widget.visible);
  };

  const filteredWidgets = AVAILABLE_WIDGETS.filter(widget => 
    isSingleTradeView ? true : !widget.singleTradeOnly
  );

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
        <div className="p-4 max-h-[60vh] overflow-y-auto widget-scroll">
          <div className="grid grid-cols-2 gap-4">
            {filteredWidgets.map(widget => {
              const isActive = isWidgetActive(widget.type);
              return (
                <button
                  key={widget.type}
                  onClick={() => {
                    if (!isActive) {
                      onAddWidget(widget.type, widget.title);
                      onClose();
                    }
                  }}
                  className={`p-4 border border-purple-900/20 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'opacity-30 cursor-not-allowed blur-[1px]' 
                      : 'hover:bg-purple-900/20 cursor-pointer'
                  }`}
                  disabled={isActive}
                >
                  <h3 className="font-medium mb-1 text-gray-200">{widget.title}</h3>
                  <p className="text-sm text-gray-400">{widget.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal; 