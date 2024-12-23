import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../context/TradeContext";
import { useCsvImport } from "../../context/CsvImportContext";
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

const CSVTradeImport: React.FC = () => {
  const navigate = useNavigate();
  const { addBulkTrades, playbooks } = useTrades();
  const { parseCsv, supportedBrokers } = useCsvImport();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string>(
    supportedBrokers[0]
  );
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTrades, setParsedTrades] = useState<any[]>([]); // Parsed trades
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Index of expanded trade

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParsingError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setParsingError("Please upload a valid CSV file");
        return;
      }
      setCsvFile(file);
    }
  };

  const handleImport = async () => {
    if (!csvFile) return;
    setIsProcessing(true);
    setParsingError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        setParsingError("Failed to read file");
        setIsProcessing(false);
        return;
      }

      const csvData = event.target.result.toString();
      try {
        const trades = parseCsv(csvData, selectedBroker); // Parse CSV
        setParsedTrades(trades); // Set parsed trades
      } catch (error: any) {
        console.error("Error importing trades:", error);
        setParsingError(error.message || "An unknown error occurred.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setParsingError("Failed to read file");
      setIsProcessing(false);
    };

    reader.readAsText(csvFile);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleTradeUpdate = (index: number, field: string, value: string) => {
    setParsedTrades((prevTrades) =>
      prevTrades.map((trade, i) =>
        i === index ? { ...trade, [field]: value } : trade
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await addBulkTrades(parsedTrades);
      alert("Trades successfully submitted!");
      navigate("/"); // Redirect after submission
    } catch (error) {
      console.error("Error submitting trades:", error);
      alert("Failed to submit trades. Please try again.");
    }
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
            Import Trades from CSV
          </h1>

          {/* Step 1: Broker Selection and File Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Broker
            </label>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            >
              {supportedBrokers.map((broker) => (
                <option key={broker} value={broker}>
                  {broker}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full mt-1"
            />

            {parsingError && (
              <div className="text-red-500 text-sm mt-2">{parsingError}</div>
            )}

            <button
              onClick={handleImport}
              disabled={!csvFile || isProcessing}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {isProcessing ? "Processing..." : "Import Trades"}
            </button>
          </div>

          {/* Step 2: Review and Update Trades */}
          {parsedTrades.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Review and Edit Trades
              </h2>
              <div className="space-y-4">
                {parsedTrades.map((trade, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md border"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Trade {index + 1}
                      </h3>
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-blue-600 underline"
                      >
                        {expandedIndex === index ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {expandedIndex === index && (
                      <div className="mt-4 space-y-6">
                        {/* Date and Time Fields */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={trade.date || ""}
                              onChange={(e) =>
                                handleTradeUpdate(index, "date", e.target.value)
                              }
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
                              value={trade.time || ""}
                              onChange={(e) =>
                                handleTradeUpdate(index, "time", e.target.value)
                              }
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
                            value={trade.symbol || ""}
                            onChange={(e) =>
                              handleTradeUpdate(
                                index,
                                "contractType",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select contract type</option>
                            {Object.entries(contractSpecs).map(
                              ([symbol, spec]) => (
                                <option key={symbol} value={symbol}>
                                  {symbol} (x{spec.multiplier})
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Side */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Side
                          </label>
                          <select
                            value={trade.side || ""}
                            onChange={(e) =>
                              handleTradeUpdate(index, "side", e.target.value)
                            }
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
                              value={trade.entryPrice || ""}
                              onChange={(e) =>
                                handleTradeUpdate(
                                  index,
                                  "entryPrice",
                                  e.target.value
                                )
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
                              value={trade.quantity || ""}
                              onChange={(e) =>
                                handleTradeUpdate(
                                  index,
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

                        {/* Strategy */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Strategy
                          </label>
                          <select
                            value={trade.strategy || ""}
                            onChange={(e) =>
                              handleTradeUpdate(
                                index,
                                "strategy",
                                e.target.value
                              )
                            }
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
                            value={trade.notes || ""}
                            onChange={(e) =>
                              handleTradeUpdate(index, "notes", e.target.value)
                            }
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Submit Trades
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVTradeImport;
