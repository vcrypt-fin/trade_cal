import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Trade } from '../../context/TradeContext';

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-lg font-bold">{date}</h2>
          <p className={`font-semibold ${
            parseFloat(netPnl.replace(/[^0-9.-]+/g, "")) >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
          >
            View Note
          </button>
          {isExpanded ? (
            <ChevronUp size={24} className="text-gray-500" />
          ) : (
            <ChevronDown size={24} className="text-gray-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total Trades</p>
              <p className="font-bold">{totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Winners</p>
              <p className="font-bold">{winners}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Losers</p>
              <p className="font-bold">{losers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gross P&L</p>
              <p className="font-bold">{grossPnl}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Commissions</p>
              <p className="font-bold">{commissions}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Time
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Symbol
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Side
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Entry
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Exit
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.time}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.symbol}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trade.side === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.quantity}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.entryPrice}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{trade.exitPrice}</td>
                    <td className={`px-6 py-4 border-b border-gray-200 text-sm font-semibold ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
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