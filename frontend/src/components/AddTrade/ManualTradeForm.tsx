// src/components/ManualTradeForm.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTrades } from "../../context/TradeContext";
import Sidebar from "../Sidebar";

interface ContractSpec {
  symbol: string;
  multiplier: number;
}

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

const brokerages = [{ id: "tradovate", name: "Tradovate" }];

// Define the structure for Execution entries
interface Execution {
  id: string;
  type: "ENTRY" | "EXIT";
  price: string;
  quantity: string;
  fee: string;
}

const ManualTradeForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTrade, playbooks } = useTrades();

  // Initialize form data excluding exitPrice and takeProfits
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date()
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/,/g, ""), // Ensures HH:MM:SS format
    contractType: "",
    side: "",
    entryPrice: "",
    quantity: "",
    strategy: "",
    notes: "",
    brokerage: "",
    timestamp: new Date().toISOString(), // Added timestamp field
  });

  // Initialize executions with one Entry execution
  const [executions, setExecutions] = useState<Execution[]>([
    {
      id: crypto.randomUUID(),
      type: "ENTRY",
      price: formData.entryPrice,
      quantity: formData.quantity,
      fee: "0",
    },
  ]);

  // Function to calculate total PNL
  const calculatePnL = (data: typeof formData, exes: Execution[]) => {
    //console.log('🔍 calculatePnL input:', { data, exes });

    const contractType = data.contractType;
    const multiplier = contractSpecs[contractType]?.multiplier || 1;
    const direction = data.side === "LONG" ? 1 : -1;

    console.log("📊 PNL calculation params:", {
      contractType,
      multiplier,
      direction,
    });

    let totalPnL = 0;
    const entry = exes.find((exe) => exe.type === "ENTRY");

    //console.log('🎯 Entry execution:', entry);

    if (!entry) {
      console.warn("⚠️ No entry execution found");
      return 0;
    }

    const entryPrice = parseFloat(entry.price);
    const entryQuantity = parseFloat(entry.quantity);

    //console.log('📈 Processing exit executions...');
    exes.forEach((exe) => {
      if (exe.type === "EXIT") {
        const exitPrice = parseFloat(exe.price);
        const exitQuantity = parseFloat(exe.quantity);
        const fee = parseFloat(exe.fee) || 0;

        const pointDifference = exitPrice - entryPrice;
        const pnl =
          pointDifference * exitQuantity * multiplier * direction - fee;

        console.log("Exit execution details:", {
          exitPrice,
          exitQuantity,
          fee,
          pointDifference,
          executionPnL: pnl,
        });

        totalPnL += pnl;
      }
    });

    //console.log('💰 Final PNL:', totalPnL);
    return totalPnL;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update the Entry execution if entryPrice or quantity changes
    if (name === "entryPrice" || name === "quantity") {
      setExecutions((prevExes) =>
        prevExes.map((exe) =>
          exe.type === "ENTRY"
            ? {
                ...exe,
                price: name === "entryPrice" ? value : exe.price,
                quantity: name === "quantity" ? value : exe.quantity,
              }
            : exe
        )
      );
    }
  };

  // Handle changes for Execution entries
  const handleExecutionChange = (
    id: string,
    field: keyof Omit<Execution, "id">,
    value: string
  ) => {
    setExecutions((prevExes) =>
      prevExes.map((exe) => (exe.id === id ? { ...exe, [field]: value } : exe))
    );
  };

  // Add a new Execution entry
  const addExecution = () => {
    setExecutions((prevExes) => [
      ...prevExes,
      {
        id: crypto.randomUUID(),
        type: "EXIT",
        price: "",
        quantity: "",
        fee: "0",
      },
    ]);
  };

  // Remove an Execution entry
  const removeExecution = (id: string) => {
    setExecutions((prevExes) => prevExes.filter((exe) => exe.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log('🚀 Form submission started');

    // Parse and format the time
    const timeValue = formData.time;
    console.log("Original time value:", timeValue);

    let timeWithSeconds;
    if (timeValue.includes("PM") || timeValue.includes("AM")) {
      // Parse the 12-hour format time
      const [time, period] = timeValue.split(" ");
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours, 10);

      // Convert to 24-hour format
      if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      // Format with leading zeros and append seconds
      timeWithSeconds = `${hour24.toString().padStart(2, "0")}:${minutes}:00`;
    } else {
      // If it's already in 24-hour format, just append seconds
      const [hours, minutes] = timeValue.split(":");
      timeWithSeconds = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:00`;
    }

    console.log("⏰ Formatted time:", timeWithSeconds);

    try {
      const tradeData = {
        id: crypto.randomUUID(),
        date: formData.date,
        time: timeWithSeconds, // Use the formatted time with seconds
        timestamp: new Date(
          `${formData.date}T${timeWithSeconds}`
        ).toISOString(),
        pnl: calculatePnL(formData, executions),
        strategy: formData.strategy,
        notes: formData.notes,
        symbol: `${formData.contractType}`,
        side: formData.side as "LONG" | "SHORT",
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: executions.find((exe) => exe.type === "EXIT")?.price
          ? parseFloat(executions.find((exe) => exe.type === "EXIT")!.price)
          : undefined,
        quantity: parseFloat(formData.quantity),
        contractMultiplier:
          contractSpecs[formData.contractType]?.multiplier || 1,
        brokerage: formData.brokerage || "",
      };

      console.log("📤 Sending trade data to context:", tradeData);

      // Add error handling for the addTrade call
      addTrade(tradeData)
        .then(() => {
          console.log("✅ Trade submitted successfully");
          navigate("/trades");
        })
        .catch((error) => {
          console.error("❌ Error adding trade:", error);
          // Optionally show an error message to the user
          alert("Failed to add trade. Please ensure all fields are correct.");
        });
    } catch (error) {
      console.error("❌ Error preparing trade data:", error);
      alert("Failed to prepare trade data. Please check all fields.");
    }
  };

  // Check if there are strategies (playbooks)
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">Manual Trade Entry</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-6"
          >
            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Contract Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Type
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select contract type</option>
                {Object.entries(contractSpecs).map(([symbol, spec]) => (
                  <option key={symbol} value={symbol}>
                    {symbol} (x{spec.multiplier})
                  </option>
                ))}
              </select>
            </div>

            {/* Side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Side
              </label>
              <select
                name="side"
                value={formData.side}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select side</option>
                <option value="LONG">Long</option>
                <option value="SHORT">Short</option>
              </select>
            </div>

            {/* Entry Price and Quantity */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategy
              </label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select strategy</option>
                {playbooks.map((playbook) => (
                  <option key={playbook.id} value={playbook.id}>
                    {playbook.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Executions Section */}
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-4">Executions</h2>
              {executions.map((exe, index) => (
                <div key={exe.id} className="border p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">
                      {exe.type === "ENTRY"
                        ? "Entry Execution"
                        : `Exit Execution ${index}`}
                    </h3>
                    {exe.type !== "ENTRY" && executions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExecution(exe.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Execution"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Execution Type (Disabled for Entry) */}
                  {exe.type === "EXIT" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={exe.type}
                        onChange={(e) =>
                          handleExecutionChange(exe.id, "type", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled // Type is fixed as EXIT
                      >
                        <option value="EXIT">Exit</option>
                      </select>
                    </div>
                  )}

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-6">
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
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
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
                          handleExecutionChange(
                            exe.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        min="1"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee (Optional)
                    </label>
                    <input
                      type="number"
                      value={exe.fee}
                      onChange={(e) =>
                        handleExecutionChange(exe.id, "fee", e.target.value)
                      }
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExecution}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Exit Execution
              </button>
            </div>

            {/* Display Total PNL */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium">
                Estimated Total PNL:{" "}
                {calculatePnL(formData, executions).toFixed(2)}
              </h3>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Trade
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualTradeForm;
