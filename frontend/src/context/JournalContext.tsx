import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade } from './TradeContext';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  trades: Trade[];
  tags: string[];
  linkedTrades: string[];
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  getEntry: (date: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      tags: [],
      linkedTrades: []
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const getEntry = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  return (
    <JournalContext.Provider value={{ 
      entries, 
      addEntry, 
      updateEntry,
      getEntry
    }}>
      {children}
    </JournalContext.Provider>
  );
}