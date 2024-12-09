export interface Trade {
  id: string;
  date: string;
  time: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  strategy: string;
  notes?: string;
  deleted?: boolean;
} 