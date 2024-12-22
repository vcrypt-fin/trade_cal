export type WidgetType = 'price' | 'volume' | 'change' | 'market-cap' | 'pe-ratio' | 'dividend-yield';

export type LargeWidgetType = 'news' | 'economic-calendar';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  symbol: string;
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
  }
]; 