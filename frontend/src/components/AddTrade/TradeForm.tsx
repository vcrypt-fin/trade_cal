import React from "react";
import { Execution, Trade } from "@/types/trade";

interface TradeFormProps {
  trade: Trade;
  setTrade: React.Dispatch<React.SetStateAction<Trade>>;
  executions: Execution[];
  setExecutions: React.Dispatch<React.SetStateAction<Execution[]>>;
  addExecution: () => void;
  removeExecution: (id: string) => void;
  handleExecutionChange: (
    id: string,
    field: keyof Omit<Execution, "id">,
    value: string
  ) => void;
  playbooks: { id: string; name: string }[];
  brokerages: { id: string; name: string }[];
  contractSpecs: Record<string, { symbol: string; multiplier: number }>;
}

const TradeForm: React.FC<TradeFormProps> = ({
  trade,
  setTrade,
  executions,
  addExecution,
  removeExecution,
  handleExecutionChange,
  playbooks,
  brokerages,
  contractSpecs,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTrade((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 border p-4 rounded-md shadow-md">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={trade.date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={trade.time}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
            required
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
            value={trade.symbol}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
            required
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
            value={trade.side}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
            required
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
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
            value={trade.entryPrice}
            onChange={handleInputChange}
            step="0.01"
            className="w-full p-2 border rounded-lg focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss (Original)
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
        <h3 className="text-lg font-medium mb-4">Executions</h3>
        {executions.map((exe) => (
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
                    handleExecutionChange(exe.id, "price", e.target.value)
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
                    handleExecutionChange(exe.id, "quantity", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeExecution(exe.id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
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
