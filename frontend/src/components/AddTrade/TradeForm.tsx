import React, { useCallback, useEffect, useState } from "react";
import { Execution, Trade } from "@/types/trade";
import { useTrades } from "../../context/TradeContext";

interface ContractSpec {
  symbol: string;
  multiplier: number;
}

interface TradeFormProps {
  trade: Trade;
  setTrade: React.Dispatch<React.SetStateAction<Trade>>;
  onTradeUpdate?: (trade: Trade) => void; // Optional callback
}

const TradeForm: React.FC<TradeFormProps> = ({
  trade,
  setTrade,
  onTradeUpdate,
}) => {
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const { playbooks } = useTrades();

  // Local data for contract types and brokerages
  const contractSpecs: Record<string, ContractSpec> = {
    MNQ: { symbol: "MNQ", multiplier: 2 },
    MES: { symbol: "MES", multiplier: 5 },
    ES: { symbol: "ES", multiplier: 50 },
    NQ: { symbol: "NQ", multiplier: 20 },
    RTY: { symbol: "RTY", multiplier: 10 },
    CL: { symbol: "CL", multiplier: 1000 },
    GC: { symbol: "GC", multiplier: 100 },
    SI: { symbol: "SI", multiplier: 5000 },
  };

  const brokerages = [
    { id: "tradeovate", name: "Tradeovate" },
    { id: "ninjatrader", name: "NinjaTrader" },
    { id: "interactivebrokers", name: "Interactive Brokers" },
  ];

  // Input handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTrade((prev) => ({ ...prev, [name]: value }));
    setFormErrors(null);
  };

  const handleExecutionChange = (
    id: string,
    field: keyof Execution,
    value: string | number
  ) => {
    setTrade((prev) => ({
      ...prev,
      executions: prev.executions?.map((exe) =>
        exe.id === id ? { ...exe, [field]: value } : exe
      ),
    }));
  };

  const addExecution = () => {
    setTrade((prev) => ({
      ...prev,
      executions: [
        ...(prev.executions || []),
        {
          id: crypto.randomUUID(),
          type: "EXIT",
          price: 0,
          quantity: 0,
          fee: 0,
        },
      ],
    }));
  };

  const removeExecution = (id: string) => {
    setTrade((prev) => ({
      ...prev,
      executions: prev.executions?.filter((exe) => exe.id !== id),
    }));
  };

  // Validation logic
  const validateForm = useCallback(() => {
    if (!trade.symbol) return "Contract is required.";
    if (!trade.side) return "Trade side (LONG/SHORT) is required.";
    if (!trade.entryPrice || isNaN(Number(trade.entryPrice)))
      return "Valid entry price is required.";
    if (!trade.quantity || isNaN(Number(trade.quantity)))
      return "Valid quantity is required.";
    return null;
  }, [trade]);

  // Automatically update the trade when state changes
  useEffect(() => {
    if (onTradeUpdate) {
      const errors = validateForm();
      if (!errors) {
        onTradeUpdate(trade);
      } else {
        setFormErrors(errors);
      }
    }
  }, [trade, onTradeUpdate, validateForm]);

  return (
    <div className="space-y-6 border p-4 rounded-md shadow-md">
      {formErrors && <div className="text-red-500 text-sm">{formErrors}</div>}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={trade.date || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={trade.time || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract
          </label>
          <select
            name="symbol"
            value={trade.symbol || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select Contract</option>
            {Object.keys(contractSpecs).map((key) => (
              <option key={key} value={key}>
                {key} (x{contractSpecs[key].multiplier})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Side
          </label>
          <select
            name="side"
            value={trade.side || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select Side</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Strategy
          </label>
          <select
            name="strategy"
            value={trade.strategy || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select Strategy</option>
            {playbooks.map((playbook) => (
              <option key={playbook.id} value={playbook.id}>
                {playbook.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brokerage
          </label>
          <select
            name="brokerage"
            value={trade.brokerage || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select Brokerage</option>
            {brokerages.map((broker) => (
              <option key={broker.id} value={broker.id}>
                {broker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price
          </label>
          <input
            type="number"
            name="entryPrice"
            value={trade.entryPrice || ""}
            onChange={handleInputChange}
            step="0.01"
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss
          </label>
          <input
            type="number"
            name="original_sl"
            value={trade.original_sl || ""}
            onChange={handleInputChange}
            step="0.01"
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Take Profit
          </label>
          <input
            type="number"
            name="takeProfit"
            value={trade.takeProfit || ""}
            onChange={handleInputChange}
            step="0.01"
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Executions</h3>
        {trade.executions?.map((exe) => (
          <div key={exe.id} className="mb-4 p-4 border rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={exe.type}
                  onChange={(e) =>
                    handleExecutionChange(exe.id, "type", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                >
                  <option value="ENTRY">Entry</option>
                  <option value="EXIT">Exit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={exe.price}
                  onChange={(e) =>
                    handleExecutionChange(exe.id, "price", +e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={exe.quantity}
                  onChange={(e) =>
                    handleExecutionChange(exe.id, "quantity", +e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                />
              </div>
            </div>
            {exe.type === "EXIT" && (
              <button
                type="button"
                onClick={() => removeExecution(exe.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addExecution}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Execution
        </button>
      </div>
    </div>
  );
};

export default TradeForm;
