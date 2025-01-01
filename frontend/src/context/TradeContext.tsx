// src/context/TradeContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "./SupabaseClient";
import { Trade } from '../types/trade';

export interface Playbook {
  id: string;
  userId: string;
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
  addTrade: (trade: Omit<Trade, "id">) => Promise<void>;
  editTrade: (updatedTrade: Trade) => Promise<void>;
  addPlaybook: (playbook: Omit<Playbook, "id" | "createdAt">) => Promise<void>;
  editPlaybook: (playbook: Playbook) => Promise<void>;
  deletePlaybook: (id: string) => Promise<void>;
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

export const TradeContext = createContext<TradeContextType>({
  trades: [],
  playbooks: [],
  addTrade: async () => {},
  editTrade: async () => {},
  addPlaybook: async () => {},
  editPlaybook: async () => {},
  deletePlaybook: async () => {},
  addBulkTrades: async () => {},
  getPlaybookById: () => undefined,
  clearAllTrades: async () => {},
  fetchTrades: async () => {},
  fetchPlaybooks: async () => {},
  isLoading: true,
  filters: {
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    symbols: [],
    strategies: [],
  },
  setFilters: () => {},
  resetFilters: () => {},
});

export const useTrades = () => useContext(TradeContext);

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [filters, setFiltersState] = useState<Filters>({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    symbols: [],
    strategies: [],
  });

  const setFilters = useCallback((newFilters: Filters) => {
    console.log("TradeContext: Setting new filters:", newFilters);
    setFiltersState((prevFilters) => {
      console.log("TradeContext: Previous filters:", prevFilters);
      return newFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      symbols: [],
      strategies: [],
    };
    console.log("Resetting filters to:", defaultFilters);
    setFiltersState(defaultFilters);
  }, []);

  const fetchPlaybooks = useCallback(async () => {
    try {
      setIsFetching(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const { data, error } = await supabase
        .from("playbooks")
        .select("*")
        .eq("userId", session.user.id)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      setPlaybooks(data || []);
    } catch (error) {
      console.error("Failed to fetch playbooks:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchTrades = useCallback(async () => {
    try {
      setIsFetching(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("userId", session.user.id)
        .order("date", { ascending: false })
        .order("time", { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error("Failed to fetch trades:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const addTrade = useCallback(
    async (trade: Omit<Trade, "id">) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const tradeData = {
        ...trade,
        userId: session.user.id,
      };

      console.log("Inserting trade into Supabase:", tradeData);
      const { error } = await supabase.from("trades").insert([tradeData]);

      if (error) {
        console.error("Error adding trade:", error);
        throw error;
      }

      await fetchTrades(); // Refresh trades
    },
    [fetchTrades]
  );

  const editTrade = useCallback(
    async (updatedTrade: Trade) => {
      console.log("Updating trade in Supabase:", updatedTrade);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      // Create a clean update object with only the fields we want to update
      const tradeUpdate = {
        date: updatedTrade.date,
        time: updatedTrade.time,
        symbol: updatedTrade.symbol,
        side: updatedTrade.side,
        entryPrice: updatedTrade.entryPrice,
        exitPrice: updatedTrade.exitPrice,
        original_sl: updatedTrade.original_sl,
        takeProfit: updatedTrade.takeProfit,
        quantity: updatedTrade.quantity,
        pnl: updatedTrade.pnl,
        strategy: updatedTrade.strategy,
        notes: updatedTrade.notes,
        brokerage: updatedTrade.brokerage,
        contractMultiplier: updatedTrade.contractMultiplier,
        playbookId: updatedTrade.playbookId,
        img: updatedTrade.img,
        forecasted_rr: updatedTrade.forecasted_rr,
        actual_rr: updatedTrade.actual_rr
      };

      const { error } = await supabase
        .from("trades")
        .update(tradeUpdate)
        .eq('id', updatedTrade.id)
        .eq('userId', session.user.id);

      if (error) {
        console.error("Failed to edit trade:", error);
        throw error;
      } else {
        await fetchTrades();
      }
    },
    [fetchTrades]
  );

  const addPlaybook = useCallback(
    async (playbook: Omit<Playbook, "id" | "createdAt">) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const newPlaybook = {
        ...playbook,
        userId: session.user.id,
        name: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date().toISOString(),
      };

      console.log("Inserting playbook into Supabase:", newPlaybook);
      const { error } = await supabase.from("playbooks").insert([newPlaybook]);

      if (error) {
        console.error("Failed to add playbook:", error);
      } else {
        await fetchPlaybooks();
      }
    },
    [fetchPlaybooks]
  );

  const editPlaybook = useCallback(
    async (playbook: Playbook) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const { error } = await supabase
        .from("playbooks")
        .update({
          name: playbook.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: playbook.description
        })
        .match({ id: playbook.id, userId: session.user.id });

      if (error) {
        console.error("Failed to edit playbook:", error);
      } else {
        await fetchPlaybooks();
      }
    },
    [fetchPlaybooks]
  );

  const deletePlaybook = useCallback(
    async (id: string) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const { error } = await supabase
        .from("playbooks")
        .delete()
        .match({ id, userId: session.user.id });

      if (error) {
        console.error("Failed to delete playbook:", error);
      } else {
        await fetchPlaybooks();
      }
    },
    [fetchPlaybooks]
  );

  const addBulkTrades = useCallback(
    async (newTrades: Trade[]) => {
      console.log("Bulk inserting trades into Supabase:", newTrades);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      const tradesData = newTrades.map((trade) => ({
        ...trade,
        userId: session.user.id,
      }));

      const { error } = await supabase.from("trades").insert(tradesData);

      if (error) {
        console.error("Failed to add bulk trades:", error);
      } else {
        await fetchTrades();
      }
    },
    [fetchTrades]
  );

  const getPlaybookById = useCallback(
    (id: string) => {
      return playbooks.find((p) => p.id === id);
    },
    [playbooks]
  );

  const clearAllTrades = useCallback(async () => {
    console.log("Clearing all trades and playbooks from Supabase...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("User is not logged in or session error occurred.");
    }

    const { error: tradesError } = await supabase
      .from("trades")
      .delete()
      .eq("userId", session.user.id);

    if (tradesError) {
      console.error("Error clearing trades:", tradesError);
      return;
    }

    const { error: playbooksError } = await supabase
      .from("playbooks")
      .delete()
      .eq("userId", session.user.id);

    if (playbooksError) {
      console.error("Error clearing playbooks:", playbooksError);
      return;
    }

    setTrades([]);
    setPlaybooks([]);
    console.log("All data cleared successfully");
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTrades(), fetchPlaybooks()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchTrades, fetchPlaybooks]);

  // Update loading state based on fetching status
  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const contextValue = useMemo(
    () => ({
      trades,
      playbooks,
      addTrade,
      editTrade,
      addPlaybook,
      editPlaybook,
      deletePlaybook,
      addBulkTrades,
      getPlaybookById,
      clearAllTrades,
      fetchTrades,
      fetchPlaybooks,
      isLoading,
      filters,
      setFilters,
      resetFilters,
    }),
    [
      trades,
      playbooks,
      addTrade,
      editTrade,
      addPlaybook,
      editPlaybook,
      deletePlaybook,
      addBulkTrades,
      getPlaybookById,
      clearAllTrades,
      fetchTrades,
      fetchPlaybooks,
      isLoading,
      filters,
      setFilters,
      resetFilters,
    ]
  );

  return (
    <TradeContext.Provider value={contextValue}>
      {children}
    </TradeContext.Provider>
  );
}
