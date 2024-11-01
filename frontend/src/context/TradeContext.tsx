// src/context/TradeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Trade {
  id: string; // Ensure id is a string to accommodate UUIDs
  date: string;
  time: string;
  timestamp?: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  brokerage: string;
  contractMultiplier: number;
  entryPrice: number;
  exitPrice?: number; // Made optional to handle incomplete trades
  quantity: number;
  strategy: string;
  notes: string;
  pnl: number;
}

export interface Playbook {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface TradeContextType {
  trades: Trade[];
  playbooks: Playbook[];
  addTrade: (trade: Trade) => void;
  editTrade: (updatedTrade: Trade) => void;
  addPlaybook: (playbook: Omit<Playbook, 'id' | 'createdAt'>) => void;
  getPlaybookById: (id: string) => Playbook | undefined;
  clearAllTrades: () => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function useTrades() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
}

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const savedTrades = localStorage.getItem('trades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });

  const [playbooks, setPlaybooks] = useState<Playbook[]>(() => {
    const savedPlaybooks = localStorage.getItem('playbooks');
    return savedPlaybooks
      ? JSON.parse(savedPlaybooks)
      : [
          {
            id: 'gap-and-go',
            name: 'Gap and Go',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'reversal',
            name: 'Reversal',
            createdAt: new Date().toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('playbooks', JSON.stringify(playbooks));
  }, [playbooks]);

  const addTrade = (trade: Trade) => {
    setTrades((prev) => [...prev, trade]);
  };

  const editTrade = (updatedTrade: Trade) => {
    setTrades((prev) =>
      prev.map((trade) => (trade.id === updatedTrade.id ? updatedTrade : trade))
    );
  };

  const addPlaybook = (playbook: Omit<Playbook, 'id' | 'createdAt'>) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    setPlaybooks((prev) => [...prev, newPlaybook]);
  };

  const getPlaybookById = (id: string) => {
    return playbooks.find((p) => p.id === id);
  };

  const clearAllTrades = () => {
    setTrades([]);
    setPlaybooks([]);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        playbooks,
        addTrade,
        editTrade,
        addPlaybook,
        getPlaybookById,
        clearAllTrades,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}
