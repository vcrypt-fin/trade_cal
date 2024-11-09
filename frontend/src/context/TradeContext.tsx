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
  addTrade: (trade: Trade) => Promise<void>;
  editTrade: (updatedTrade: Trade) => Promise<void>;
  addPlaybook: (playbook: Omit<Playbook, 'id' | 'createdAt'>) => Promise<void>;
  addBulkTrades: (newTrades: Trade[]) => Promise<void>;
  getPlaybookById: (id: string) => Playbook | undefined;
  clearAllTrades: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  isLoading: boolean;
  // New additions for filter management
  filters: {
    startDate: string;
    endDate: string;
    symbols: string[];
    strategies: string[];
  };
  setFilters: (filters: {
    startDate: string;
    endDate: string;
    symbols: string[];
    strategies: string[];
  }) => void;
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

// Helper functions for localStorage operations
const LOCAL_STORAGE_TRADES_KEY = 'trades';
const LOCAL_STORAGE_PLAYBOOKS_KEY = 'playbooks';

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

const SERVER_URL = 'http://localhost:3000/api'; // Ensure this is your actual backend URL

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize as loading

  // Filters state
  const [filters, setFiltersState] = useState<{
    startDate: string;
    endDate: string;
    symbols: string[];
    strategies: string[];
  }>({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    symbols: [],
    strategies: [],
  });

  const setFilters = useCallback((newFilters: {
    startDate: string;
    endDate: string;
    symbols: string[];
    strategies: string[];
  }) => {
    console.log('Setting filters:', newFilters);
    setFiltersState(newFilters);
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

  // Fetch trades from backend
  const fetchTrades = useCallback(async () => {
    console.log('Fetching trades from backend...');
    try {
      const tradeResponse = await fetch(`${SERVER_URL}/trades`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (tradeResponse.ok) {
        const parsedData = await tradeResponse.json();
        console.log('Parsed trade data:', parsedData);

        // Handle both correct and malformed data structures
        let tradeData: Trade[] = [];

        if (Array.isArray(parsedData)) {
          if (
            parsedData.length === 1 &&
            typeof parsedData[0] === 'object' &&
            !Array.isArray(parsedData[0])
          ) {
            // Malformed structure: array with single object containing numerical keys
            const firstElement = parsedData[0];
            const extractedTrades = Object.keys(firstElement)
              .filter(key => !isNaN(Number(key))) // Filter numerical keys
              .map(key => firstElement[key]);
            tradeData = extractedTrades as Trade[];
            console.warn('Detected malformed trades data structure. Extracted trades:', tradeData);
          } else {
            // Correct structure: flat array of trade objects
            tradeData = parsedData as Trade[];
          }
        } else {
          console.error('Parsed trade data is not an array:', parsedData);
        }

        // Ensure all trades have a defined 'date'
        const formattedTrades = tradeData.filter(trade => {
          if (!trade.date) {
            console.warn('Trade without date:', trade);
            return false; // Exclude trades without a date
          }
          return true;
        });

        setTrades(formattedTrades);
        saveToLocalStorage<Trade>(LOCAL_STORAGE_TRADES_KEY, formattedTrades);
        console.log('Fetched trades from backend:', formattedTrades);
      } else {
        const errorText = await tradeResponse.text();
        console.error('Failed to fetch trades:', tradeResponse.status, tradeResponse.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setIsLoading(false); // Data fetching complete
    }
  }, []); // Empty dependency array since SERVER_URL is stable

  // Memoize other functions using useCallback

  const addTrade = useCallback(async (trade: Trade) => {
    console.log('Adding trade:', trade);
    try {
      const response = await fetch(`${SERVER_URL}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const newTrade: Trade = await response.json();
        setTrades(prev => [...prev, newTrade]);
        console.log('Trade added successfully:', newTrade);
      } else {
        const errorText = await response.text();
        console.error('Failed to add trade:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  }, []);

  const editTrade = useCallback(async (updatedTrade: Trade) => {
    console.log('Editing trade:', updatedTrade);
    try {
      const response = await fetch(`${SERVER_URL}/trades/${updatedTrade.id}`, {
        method: 'PATCH', // Ensure backend expects PATCH for partial updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrade),
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const updated: Trade = await response.json();
        setTrades(prev =>
          prev.map(trade => (trade.id === updatedTrade.id ? updated : trade))
        );
        console.log('Trade edited successfully:', updated);
      } else {
        const errorText = await response.text();
        console.error('Failed to edit trade:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error editing trade:', error);
    }
  }, []);

  const addPlaybook = useCallback(async (playbook: Omit<Playbook, 'id' | 'createdAt'>) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    console.log('Adding playbook:', newPlaybook);

    try {
      const response = await fetch(`${SERVER_URL}/playbooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlaybook),
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const createdPlaybook: Playbook = await response.json();
        setPlaybooks(prev => [...prev, createdPlaybook]);
        console.log('Playbook added successfully:', createdPlaybook);
      } else {
        const errorText = await response.text();
        console.error('Failed to add playbook:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error adding playbook:', error);
    }
  }, []);

  const addBulkTrades = useCallback(async (newTrades: Trade[]) => {
    console.log('Adding bulk trades:', newTrades);
    try {
      const response = await fetch(`${SERVER_URL}/trades/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrades), // Ensure this is a flat array
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const result = await response.json();
        let addedTrades: Trade[] = [];
        let skippedTrades: Trade[] = [];

        if (result.added && Array.isArray(result.added)) {
          addedTrades = result.added;
          skippedTrades = result.skipped || [];
        } else if (Array.isArray(result)) {
          // Handle malformed response: assume all are added
          addedTrades = result as Trade[];
          skippedTrades = [];
          console.warn('Malformed bulk trades response. Assuming all trades are added:', addedTrades);
        } else {
          console.warn('Unexpected bulk trades response structure:', result);
        }

        if (addedTrades.length > 0) {
          setTrades(prev => [...prev, ...addedTrades]);
          console.log('Bulk trades added successfully:', addedTrades);
        }

        if (skippedTrades.length > 0) {
          console.warn('Bulk trades skipped (duplicates or invalid):', skippedTrades);
          alert(`${skippedTrades.length} duplicate or invalid trades were skipped.`);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to add bulk trades:', response.status, response.statusText, errorText);
        alert(`Failed to add bulk trades: ${errorText}`);
      }
    } catch (error: any) {
      console.error('Error adding bulk trades:', error);
      alert(`Error adding bulk trades: ${error.message || 'Unknown error'}`);
    }
  }, []);

  const getPlaybookById = useCallback((id: string) => {
    const playbook = playbooks.find(p => p.id === id);
    console.log(`Retrieving playbook by ID (${id}):`, playbook);
    return playbook;
  }, [playbooks]);

  const clearAllTrades = useCallback(async () => {
    console.log('Clearing all trades and playbooks...');
    try {
      const response = await fetch(`${SERVER_URL}/clear`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        setTrades([]);
        setPlaybooks([]);
        saveToLocalStorage<Trade>(LOCAL_STORAGE_TRADES_KEY, []);
        saveToLocalStorage<Playbook>(LOCAL_STORAGE_PLAYBOOKS_KEY, []);
        console.log('All trades and playbooks cleared successfully.');
        alert('All trades and playbooks have been cleared.');
      } else {
        const errorText = await response.text();
        console.error('Failed to clear trades and playbooks:', response.status, response.statusText, errorText);
        alert(`Failed to clear data: ${errorText}`);
      }
    } catch (error) {
      console.error('Error clearing trades and playbooks:', error);
      alert(`Error clearing data: ${error.message || 'Unknown error'}`);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
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
    isLoading,
    // New additions
    filters,
    setFilters,
    resetFilters,
  }), [trades, playbooks, addTrade, editTrade, addPlaybook, addBulkTrades, getPlaybookById, clearAllTrades, fetchTrades, isLoading, filters]);

  return (
    <TradeContext.Provider value={contextValue}>
      {children}
    </TradeContext.Provider>
  );
}
