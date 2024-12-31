import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../context/TradeContext";
import Sidebar from "../Sidebar";
import TradeForm, { Execution, Trade } from "./TradeForm";

const contractSpecs: Record<string, { symbol: string; multiplier: number }> = {
  MNQ: { symbol: "MNQ", multiplier: 2 },
  MES: { symbol: "MES", multiplier: 5 },
  ES: { symbol: "ES", multiplier: 50 },
  NQ: { symbol: "NQ", multiplier: 20 },
  RTY: { symbol: "RTY", multiplier: 10 },
  CL: { symbol: "CL", multiplier: 1000 },
  GC: { symbol: "GC", multiplier: 100 },
  SI: { symbol: "SI", multiplier: 5000 },
};

const brokerages = [{ id: "tradovate", name: "Tradovate" }];

interface ManualTradeFormProps {
  onBack: () => void;
}

export default function ManualTradeForm({ onBack }: ManualTradeFormProps) {
  const navigate = useNavigate();
  const { addTrade, playbooks } = useTrades();

  const [trade, setTrade] = useState<Trade>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    time: new Date()
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/,/g, ""),
    symbol: "",
    side: "LONG",
    entryPrice: 0,
    exitPrice: 0,
    quantity: 0,
    pnl: 0,
    strategy: "",
    notes: "",
    brokerage: "",
    contractMultiplier: 0,
    timestamp: new Date().toISOString(),
  });

  const [executions, setExecutions] = useState<Execution[]>([
    {
      id: crypto.randomUUID(),
      type: "ENTRY",
      price: trade.entryPrice.toString(),
      quantity: trade.quantity.toString(),
      fee: "0",
    },
  ]);

  const calculatePnL = (): number => {
    const contractMultiplier = contractSpecs[trade.symbol]?.multiplier || 1;
    const entryExecutions = executions.filter((exe) => exe.type === "ENTRY");
    const exitExecutions = executions.filter((exe) => exe.type === "EXIT");

    if (entryExecutions.length === 0 || exitExecutions.length === 0) {
      return 0;
    }

    let totalPnL = 0;

    entryExecutions.forEach((entry) => {
      const entryPrice = parseFloat(entry.price);
      const entryQuantity = parseFloat(entry.quantity);
      let remainingQuantity = entryQuantity;

      for (const exit of exitExecutions) {
        if (remainingQuantity <= 0) break;

        const exitPrice = parseFloat(exit.price);
        const exitQuantity = parseFloat(exit.quantity);
        const tradedQuantity = Math.min(remainingQuantity, exitQuantity);
        const fee = parseFloat(exit.fee) || 0;

        const pointDifference = exitPrice - entryPrice;
        const direction = trade.side === "LONG" ? 1 : -1;
        totalPnL +=
          tradedQuantity * pointDifference * contractMultiplier * direction -
          fee;

        remainingQuantity -= tradedQuantity;
      }
    });

    return totalPnL;
  };

  const calculateRR = (entry: number, sl: number, tp: number): number => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return risk > 0 ? reward / risk : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contract = contractSpecs[trade.symbol];
    if (!contract) {
      alert("Please select a valid contract.");
      return;
    }

    try {
      const original_sl = trade.original_sl || 0;
      const takeProfit = trade.takeProfit || 0;
      const entryPrice = trade.entryPrice;
      const exitPrice = parseFloat(
        executions.find((exe) => exe.type === "EXIT")?.price || "0"
      );

      const tradeData = {
        ...trade,
        entryPrice: entryPrice,
        exitPrice: exitPrice,
        timestamp: trade.timestamp || new Date().toISOString(),
        pnl: calculatePnL(),
        forecasted_rr: calculateRR(entryPrice, original_sl, takeProfit),
        actual_rr: calculateRR(entryPrice, original_sl, exitPrice),
        contractMultiplier: contract.multiplier,
      };

      await addTrade(tradeData);
      navigate("/trades");
    } catch (error) {
      console.error("❌ Error adding trade:", error);
      alert("Failed to add trade. Please check all fields.");
    }
  };

  const handleExecutionChange = (
    id: string,
    field: keyof Omit<Execution, "id">,
    value: string
  ) => {
    setExecutions((prev) =>
      prev.map((exe) => (exe.id === id ? { ...exe, [field]: value } : exe))
    );
  };

  const addExecution = () => {
    setExecutions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "EXIT",
        price: "",
        quantity: "",
        fee: "0",
      },
    ]);
  };

  const removeExecution = (id: string) => {
    setExecutions((prev) => prev.filter((exe) => exe.id !== id));
  };

  if (playbooks.length === 0) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">
              No Strategies Available
            </h2>
            <p className="text-gray-700 mb-6">
              You currently have no strategies. Please create a strategy in the
              Playbooks section to proceed with adding trades.
            </p>
            <button
              onClick={() =>
                navigate("/playbook", { state: { from: "/add-trade" } })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Playbooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <TradeForm
          trade={trade}
          setTrade={setTrade}
          executions={executions}
          setExecutions={setExecutions}
          addExecution={addExecution}
          removeExecution={removeExecution}
          handleExecutionChange={handleExecutionChange}
          playbooks={playbooks}
          brokerages={brokerages}
          contractSpecs={contractSpecs}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Trade
          </button>
        </div>
      </div>
    </div>
  );
}
