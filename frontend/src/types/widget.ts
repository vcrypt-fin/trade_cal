export type StatWidgetType = 
  | 'net_pnl'
  | 'win_rate'
  | 'profit_factor'
  | 'current_streak'
  | 'gross_profit'
  | 'gross_loss'
  | 'total_trades'
  | 'average_win'
  | 'average_loss'
  | 'largest_win'
  | 'largest_loss'
  | 'win_loss_ratio';

export interface Widget {
  id: string;
  type: StatWidgetType;
  position: number;
  title: string;
  visible: boolean;
}

export interface WidgetData {
  value: number | string;
  info?: string;
  type: 'currency' | 'percent' | 'number';
} 