import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../context/TradeContext";
import { useCsvImport } from "../../context/CsvImportContext";
import Sidebar from "../Sidebar";
import TradeForm, { Trade, Execution } from "./TradeForm";

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
  const [parsedTrades, setParsedTrades] = useState<Trade[]>([]); // Parsed trades
  const [currentExecutions, setCurrentExecutions] = useState<Execution[][]>([]);

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
        setParsedTrades(
          trades.map((trade: Trade) => ({
            ...trade,
            id: crypto.randomUUID(),
            timestamp: trade.timestamp || new Date().toISOString(),
          }))
        );

        setCurrentExecutions(
          trades.map(() => [
            {
              id: crypto.randomUUID(),
              type: "ENTRY",
              price: "",
              quantity: "",
              fee: "0",
            },
          ])
        );
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

  const handleTradeChange = (index: number, updatedTrade: Trade) => {
    setParsedTrades((prevTrades) =>
      prevTrades.map((trade, i) => (i === index ? updatedTrade : trade))
    );
  };

  const handleExecutionChange = (
    tradeIndex: number,
    executionIndex: number,
    field: keyof Execution,
    value: string
  ) => {
    setCurrentExecutions((prevExecutions) =>
      prevExecutions.map((executions, i) =>
        i === tradeIndex
          ? executions.map((exe, j) =>
              j === executionIndex ? { ...exe, [field]: value } : exe
            )
          : executions
      )
    );
  };

  const addExecution = (tradeIndex: number) => {
    setCurrentExecutions((prevExecutions) =>
      prevExecutions.map((executions, i) =>
        i === tradeIndex
          ? [
              ...executions,
              {
                id: crypto.randomUUID(),
                type: "EXIT",
                price: "",
                quantity: "",
                fee: "0",
              },
            ]
          : executions
      )
    );
  };

  const removeExecution = (tradeIndex: number, executionId: string) => {
    setCurrentExecutions((prevExecutions) =>
      prevExecutions.map((executions, i) =>
        i === tradeIndex
          ? executions.filter((exe) => exe.id !== executionId)
          : executions
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const tradesWithExecutions = parsedTrades.map((trade, index) => ({
        ...trade,
        executions: currentExecutions[index],
      }));

      await addBulkTrades(tradesWithExecutions);
      alert("Trades successfully submitted!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting trades:", error);
      alert("Failed to submit trades. Please try again.");
    }
  };

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
              <div className="space-y-6">
                {parsedTrades.map((trade, index) => (
                  <TradeForm
                    key={index}
                    trade={trade}
                    setTrade={(updatedTrade) =>
                      handleTradeChange(index, updatedTrade)
                    }
                    executions={currentExecutions[index]}
                    setExecutions={(newExecutions) =>
                      setCurrentExecutions((prev) =>
                        prev.map((execs, i) =>
                          i === index ? newExecutions : execs
                        )
                      )
                    }
                    addExecution={() => addExecution(index)}
                    removeExecution={(executionId) =>
                      removeExecution(index, executionId)
                    }
                    handleExecutionChange={(executionIndex, field, value) =>
                      handleExecutionChange(index, executionIndex, field, value)
                    }
                    playbooks={playbooks}
                    brokerages={supportedBrokers.map((broker) => ({
                      id: broker,
                      name: broker,
                    }))}
                    contractSpecs={contractSpecs}
                  />
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
