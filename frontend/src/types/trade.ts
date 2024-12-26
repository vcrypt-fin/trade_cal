export interface Trade {
  id: string;
  date: string;
  time: string;
  exitTime?: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  setup?: string;
  tags?: string[];
  entryPrice: number;
  exitPrice: number;
  original_sl?: number;
  takeProfit?: number;
  forecasted_rr?: number;
  actual_rr?: number;
  quantity: number;
  pnl: number;
  strategy?: string;
  notes?: string;
  deleted?: boolean;
  userId?: string;
  brokerage?: string;
  contractMultiplier?: number;
  playbookId?: string;
}

export interface DailyPnLData {
  date: string;
  pnl: number;
  fill: string;
}

export interface CumulativePnLData {
  date: string;
  value: number;
}

export interface MonthlyPnL {
  month: string;
  pnl: number;
}

export interface MonthlyTrades {
  [key: string]: Trade[];
}

export interface StatItem {
  id: string;
  label: string;
  trades: number;
  pnl: number;
  winningTrades: number;
  totalProfits: number;
  totalLoss: number;
  volume: number;
} 