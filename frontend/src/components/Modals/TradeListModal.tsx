// src/components/Modals/TradeListModal.tsx
import React from 'react';
import { Trade } from '../../context/TradeContext';
import { X } from 'lucide-react';

interface TradeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trades: Trade[];
}

const TradeListModal: React.FC<TradeListModalProps> = ({ isOpen, onClose, title, trades }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close Modal">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {trades.length === 0 ? (
            <p className="text-center text-gray-500">No trades available for this category.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Time</th>
                  <th className="px-4 py-2 border-b">Symbol</th>
                  <th className="px-4 py-2 border-b">Side</th>
                  <th className="px-4 py-2 border-b">Quantity</th>
                  <th className="px-4 py-2 border-b">Entry Price</th>
                  <th className="px-4 py-2 border-b">Exit Price</th>
                  <th className="px-4 py-2 border-b">P&L</th>
                  <th className="px-4 py-2 border-b">Strategy</th>
                  <th className="px-4 py-2 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => (
                  <tr key={trade.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{trade.date}</td>
                    <td className="px-4 py-2 border-b">{trade.time}</td>
                    <td className="px-4 py-2 border-b font-semibold">{trade.symbol}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          trade.side === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">{trade.quantity}</td>
                    <td className="px-4 py-2 border-b">${trade.entryPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">
                      {trade.exitPrice !== undefined ? `$${trade.exitPrice.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className={`px-4 py-2 border-b font-semibold ${trade.pnl !== undefined && trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.pnl !== undefined ? `$${trade.pnl.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b">{trade.strategy || 'N/A'}</td>
                    <td className="px-4 py-2 border-b">{trade.notes || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeListModal;
