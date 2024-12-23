import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Trade } from '../../types/trade';

interface JournalEntryProps {
  date: string;
  netPnl: string;
  totalTrades: number;
  winners: number;
  losers: number;
  grossPnl: string;
  commissions: string;
  trades: Trade[];
  isExpanded: boolean;
  onToggle: () => void;
  onViewNote: () => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  date,
  netPnl,
  totalTrades,
  winners,
  losers,
  grossPnl,
  commissions,
  trades,
  isExpanded,
  onToggle,
  onViewNote,
}) => {
  return (
    <div className="space-y-6 p-6 bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-lg font-semibold text-purple-100">{date}</h2>
          <p className={`font-semibold ${
            parseFloat(netPnl.replace(/[^0-9.-]+/g, "")) >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            Net P&L {netPnl}
          </p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewNote();
            }}
            className="text-purple-300 border-purple-700 hover:bg-purple-800/20 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg border mr-4"
          >
            View Note
          </button>
          {isExpanded ? (
            <ChevronUp size={24} className="text-purple-300" />
          ) : (
            <ChevronDown size={24} className="text-purple-300" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20">
              <p className="text-sm text-purple-400">Total Trades</p>
              <p className="font-bold text-purple-200">{totalTrades}</p>
            </div>
            <div className="bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20">
              <p className="text-sm text-purple-400">Winners</p>
              <p className="font-bold text-green-400">{winners}</p>
            </div>
            <div className="bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20">
              <p className="text-sm text-purple-400">Losers</p>
              <p className="font-bold text-red-400">{losers}</p>
            </div>
            <div className="bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20">
              <p className="text-sm text-purple-400">Gross P&L</p>
              <p className="font-bold text-purple-200">{grossPnl}</p>
            </div>
            <div className="bg-[#2A1A4A] p-4 rounded-lg border border-purple-800/20">
              <p className="text-sm text-purple-400">Commissions</p>
              <p className="font-bold text-purple-200">{commissions}</p>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#2A1A4A] rounded-lg border border-purple-800/20">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-purple-400 border-b border-purple-800/30">
                  <th className="p-4">Time</th>
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Side</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Entry</th>
                  <th className="p-4">Exit</th>
                  <th className="p-4">P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr key={index} className="text-sm text-purple-200 border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors duration-200">
                    <td className="p-4">{trade.time}</td>
                    <td className="p-4">{trade.symbol}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trade.side === 'LONG' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="p-4">{trade.quantity}</td>
                    <td className="p-4">{trade.entryPrice}</td>
                    <td className="p-4">{trade.exitPrice}</td>
                    <td className={`p-4 ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;