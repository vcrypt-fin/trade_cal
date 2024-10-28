// src/context/TradeContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface Trade {
  date: string;
  profit: number;
  trades: number;
  winRate?: number;
  strategy: string;
}

interface TradeContextProps {
  trades: Record<string, Trade[]>;
  addTrade: (newTrade: Trade) => void;
}

const TradeContext = createContext<TradeContextProps | undefined>(undefined);

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Record<string, Trade[]>>({});

  const addTrade = (newTrade: Trade) => {
    setTrades(prevTrades => {
      const { date } = newTrade;
      return {
        ...prevTrades,
        [date]: [...(prevTrades[date] || []), newTrade],
      };
    });
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade }}>
      {children}
    </TradeContext.Provider>
  );
};
