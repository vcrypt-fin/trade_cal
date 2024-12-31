import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import ManualTradeForm from "./ManualTradeForm";
import BrokerageLink from "./BrokerageLink";
import BrokerageImport from "./BrokerageImport";
import CSVTradeImport from "./CSVTradeImport";
import { supabase } from '../../context/SupabaseClient';

const SNAPTRADE_URL = "https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1/snaptrade"

export default function AddTradeForm() {
  const [entryMethod, setEntryMethod] = useState<
    "import" | "manual" | "brokerage" | "csv" | null
  >(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  if (!entryMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[280px]"
          } p-8`}
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/" className="text-purple-400 hover:text-purple-300">
                ← Back
              </Link>
              <h1 className="text-2xl font-semibold text-purple-100">
                Add New Trade
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => setEntryMethod("import")}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">
                  Import from Linked Accounts
                </h2>
                <p className="text-purple-200">
                  Import trades from linked brokerage accounts
                </p>
              </button>
              <button
                onClick={() => setEntryMethod("manual")}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">
                  Manual Entry
                </h2>
                <p className="text-purple-200">
                  Manually input your trade details
                </p>
              </button>
              <button
                onClick={() => setEntryMethod("brokerage")}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">
                  Link Brokerage
                </h2>
                <p className="text-purple-200">
                  Import trades from your brokerage account
                </p>
              </button>
              <button
                onClick={() => setEntryMethod("csv")}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">
                  Import CSV
                </h2>
                <p className="text-purple-200">
                  Upload a CSV file of your trades
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entryMethod === "manual")
    return <ManualTradeForm onBack={() => setEntryMethod(null)} />;
  if (entryMethod === "brokerage")
    return (
      <BrokerageLink
        onBack={() => setEntryMethod(null)}
        onConnectionComplete={handleConnectionComplete}
      />
    );
  if (entryMethod === "import")
    return <BrokerageImport onBack={() => setEntryMethod(null)} />;
  if (entryMethod === "csv")
    return <CSVTradeImport onBack={() => setEntryMethod(null)} />;
  return null;
}
