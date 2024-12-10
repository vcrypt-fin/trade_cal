export interface Trade {
  id: string;
  date: string;
  time: string;
  exitTime?: string;
  symbol: string;
  setup?: string;
  tags?: string[];
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
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