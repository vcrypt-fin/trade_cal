// src/context/TradeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Trade {
  id: string;
  date: string;
  time: string;
  timestamp?: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  brokerage: string;
  contractMultiplier: number;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  strategy: string;
  notes: string;
  pnl: number;
}

export interface Playbook {
  id: string;
  name: string;
  description?: string;
}

interface TradeContextProps {
  trades: Trade[];
  playbooks: Playbook[];
  addTrade: (trade: Trade) => void;
  editTrade: (updatedTrade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
  addPlaybook: (playbook: Playbook) => void;
}

const TradeContext = createContext<TradeContextProps | undefined>(undefined);

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  
  const addTrade = (trade: Trade) => {
    setTrades(prev => [...prev, trade]);
  };
  
  const editTrade = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade => trade.id === updatedTrade.id ? updatedTrade : trade));
  };
  
  const deleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
  };
  
  const addPlaybook = (playbook: Playbook) => {
    setPlaybooks(prev => [...prev, playbook]);
  };
  
  return (
    <TradeContext.Provider value={{ trades, playbooks, addTrade, editTrade, deleteTrade, addPlaybook }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = (): TradeContextProps => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
