export type WidgetType = 'price' | 'volume' | 'change' | 'market-cap' | 'pe-ratio' | 'dividend-yield';

export type LargeWidgetType = 'news' | 'economic-calendar' | 'leaderboard';

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
  | 'win_loss_ratio'
  | 'average_rr';

export interface Widget {
  id: string;
  type: StatWidgetType;
  title: string;
  position: number;
  visible: boolean;
}

export interface LargeWidget {
  id: string;
  type: LargeWidgetType;
  position: number;
}

export interface WidgetData {
  value: string | number;
  type: 'currency' | 'percent' | 'number';
  info?: string;
}

export const LARGE_WIDGETS = [
  {
    type: 'news' as LargeWidgetType,
    title: 'Market News',
    description: 'Real-time news updates for your tracked symbols',
    icon: 'Newspaper'
  },
  {
    type: 'economic-calendar' as LargeWidgetType,
    title: 'Economic Calendar',
    description: 'Upcoming economic events and FOMC meetings',
    icon: 'Calendar'
  },
  {
    type: 'leaderboard' as LargeWidgetType,
    title: 'Leaderboard',
    description: 'Top traders ranked by daily, weekly, and overall performance',
    icon: 'Trophy'
  }
]; 