// src/context/TradeContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface Trade {
  id: string;
  date: string; // 'YYYY-MM-DD'
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
  playbookId?: string;
  notes: string;
  pnl: number;
}

export interface Playbook {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface Filters {
  startDate: string;
  endDate: string;
  symbols: string[];
  strategies: string[];
}

interface TradeContextType {
  trades: Trade[];
  playbooks: Playbook[];
  addTrade: (trade: Trade) => Promise<void>;
  editTrade: (updatedTrade: Trade) => Promise<void>;
  addPlaybook: (playbook: Omit<Playbook, 'id' | 'createdAt'>) => Promise<void>;
  addBulkTrades: (newTrades: Trade[]) => Promise<void>;
  getPlaybookById: (id: string) => Playbook | undefined;
  clearAllTrades: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  fetchPlaybooks: () => Promise<void>;
  isLoading: boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function useTrades() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
}

const LOCAL_STORAGE_TRADES_KEY = 'trades';
const LOCAL_STORAGE_PLAYBOOKS_KEY = 'playbooks';
const SERVER_URL = 'http://localhost:3000/api';

const loadFromLocalStorage = <T,>(key: string): T[] => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return [];
    }
  }
  return [];
};

const saveToLocalStorage = <T,>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filters, setFiltersState] = useState<Filters>({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    symbols: [],
    strategies: [],
  });

  const setFilters = useCallback((newFilters: Filters) => {
    console.log('TradeContext: Setting new filters:', newFilters);
    setFiltersState(prevFilters => {
      console.log('TradeContext: Previous filters:', prevFilters);
      return newFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      symbols: [],
      strategies: [],
    };
    console.log('Resetting filters to:', defaultFilters);
    setFiltersState(defaultFilters);
  }, []);

  const fetchPlaybooks = useCallback(async () => {
    console.log('Fetching playbooks from backend...');
    try {
      const response = await fetch(`${SERVER_URL}/playbooks`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data);
        saveToLocalStorage<Playbook>(LOCAL_STORAGE_PLAYBOOKS_KEY, data);
        console.log('Fetched playbooks:', data);
      } else {
        console.error('Failed to fetch playbooks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching playbooks:', error);
    }
  }, []);

  const fetchTrades = useCallback(async () => {
    console.log('Fetching trades...');
    try {
      const response = await fetch(`${SERVER_URL}/trades`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const formattedTrades = Array.isArray(data) ? data : [];
        setTrades(formattedTrades);
        saveToLocalStorage<Trade>(LOCAL_STORAGE_TRADES_KEY, formattedTrades);
        console.log('Fetched trades:', formattedTrades);
      } else {
        console.error('Failed to fetch trades:', response.status);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTrade = useCallback(async (trade: Omit<Trade, 'id'>) => {
    try {
      console.log('Sending trade data:', trade);
      
      const response = await fetch(`${SERVER_URL}/trades`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(trade),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to add trade');
      }

      const newTrade = await response.json();
      setTrades(prev => [...prev, newTrade]);
      await fetchTrades(); // Refresh trades after adding
    } catch (error) {
      console.error('Error adding trade:', error);
      throw error;
    }
  }, [fetchTrades]);

  const editTrade = useCallback(async (updatedTrade: Trade) => {
    try {
      const response = await fetch(`${SERVER_URL}/trades/${updatedTrade.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrade),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchTrades(); // Refresh trades after editing
      } else {
        console.error('Failed to edit trade:', response.status);
      }
    } catch (error) {
      console.error('Error editing trade:', error);
    }
  }, [fetchTrades]);

  const addPlaybook = useCallback(async (playbook: Omit<Playbook, 'id' | 'createdAt'>) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${SERVER_URL}/playbooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlaybook),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchPlaybooks(); // Refresh playbooks after adding
      } else {
        console.error('Failed to add playbook:', response.status);
      }
    } catch (error) {
      console.error('Error adding playbook:', error);
    }
  }, [fetchPlaybooks]);

  const addBulkTrades = useCallback(async (newTrades: Trade[]) => {
    try {
      const response = await fetch(`${SERVER_URL}/trades/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrades),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchTrades(); // Refresh trades after bulk add
      } else {
        console.error('Failed to add bulk trades:', response.status);
      }
    } catch (error) {
      console.error('Error adding bulk trades:', error);
    }
  }, [fetchTrades]);

  const getPlaybookById = useCallback((id: string) => {
    return playbooks.find(p => p.id === id);
  }, [playbooks]);

  const clearAllTrades = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/clear`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTrades([]);
        setPlaybooks([]);
        saveToLocalStorage<Trade>(LOCAL_STORAGE_TRADES_KEY, []);
        saveToLocalStorage<Playbook>(LOCAL_STORAGE_PLAYBOOKS_KEY, []);
        console.log('All data cleared successfully');
      } else {
        console.error('Failed to clear data:', response.status);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTrades(), fetchPlaybooks()]);
      setIsLoading(false);
    };

    initializeData();
  }, [fetchTrades, fetchPlaybooks]);

  const contextValue = useMemo(() => ({
    trades,
    playbooks,
    addTrade,
    editTrade,
    addPlaybook,
    addBulkTrades,
    getPlaybookById,
    clearAllTrades,
    fetchTrades,
    fetchPlaybooks,
    isLoading,
    filters,
    setFilters,
    resetFilters,
  }), [
    trades,
    playbooks,
    addTrade,
    editTrade,
    addPlaybook,
    addBulkTrades,
    getPlaybookById,
    clearAllTrades,
    fetchTrades,
    fetchPlaybooks,
    isLoading,
    filters,
    setFilters,
    resetFilters,
  ]);

  return (
    <TradeContext.Provider value={contextValue}>
      {children}
    </TradeContext.Provider>
  );
}
