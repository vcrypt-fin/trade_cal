// src/context/TradeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  const SERVER_URL = `${window.location.origin}/api`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tradeResponse = await fetch(`${SERVER_URL}/trades`, {
          credentials: 'include', // Send cookies with the request
        });
        const playbookResponse = await fetch(`${SERVER_URL}/playbooks`, {
          credentials: 'include',
        });

        if (tradeResponse.ok && playbookResponse.ok) {
          const tradeData = await tradeResponse.json();
          const playbookData = await playbookResponse.json();
          setTrades(tradeData);
          setPlaybooks(playbookData);
        } else {
          console.error('Failed to fetch data from server');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addTrade = async (trade: Trade) => {
    try {
      const response = await fetch(`${SERVER_URL}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trade),
      });

      if (response.ok) {
        setTrades((prev) => [...prev, trade]);
      } else {
        console.error('Failed to add trade');
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  const editTrade = async (updatedTrade: Trade) => {
    try {
      const response = await fetch(`${SERVER_URL}/trades/${updatedTrade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedTrade),
      });

      if (response.ok) {
        setTrades((prev) =>
          prev.map((trade) => (trade.id === updatedTrade.id ? updatedTrade : trade))
        );
      } else {
        console.error('Failed to edit trade');
      }
    } catch (error) {
      console.error('Error editing trade:', error);
    }
  };

  const addPlaybook = async (playbook: Omit<Playbook, 'id' | 'createdAt'>) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${SERVER_URL}/playbooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPlaybook),
      });

      if (response.ok) {
        setPlaybooks((prev) => [...prev, newPlaybook]);
      } else {
        console.error('Failed to add playbook');
      }
    } catch (error) {
      console.error('Error adding playbook:', error);
    }
  };

  const getPlaybookById = (id: string) => {
    return playbooks.find((p) => p.id === id);
  };

  const clearAllTrades = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/clear`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTrades([]);
        setPlaybooks([]);
      } else {
        console.error('Failed to clear all trades and playbooks');
      }
    } catch (error) {
      console.error('Error clearing trades and playbooks:', error);
    }
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
