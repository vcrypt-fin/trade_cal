// src/components/EditTradeForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import Sidebar from './Sidebar';
import { Trade } from '../types/trade';

interface FormData {
  date: string;
  time: string;
  symbol: string;
  side: string;
  entryPrice: string;
  exitPrice: string;
  original_sl: string;
  takeProfit: string;
  quantity: string;
  strategy: string;
  notes: string;
}

const EditTradeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trades, editTrade, playbooks } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    symbol: '',
    side: '',
    entryPrice: '',
    exitPrice: '',
    original_sl: '',
    takeProfit: '',
    quantity: '',
    strategy: '',
    notes: '',
  });

  const calculateRR = (entry: number, sl: number, tp: number, side: 'LONG' | 'SHORT'): number => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return risk !== 0 ? reward / risk : 0;
  };

  useEffect(() => {
    if (id) {
      const tradeToEdit = trades.find((trade) => trade.id === id);
      if (tradeToEdit) {
        setFormData({
          date: tradeToEdit.date,
          time: tradeToEdit.time,
          symbol: tradeToEdit.symbol,
          side: tradeToEdit.side,
          entryPrice: tradeToEdit.entryPrice.toString(),
          exitPrice: tradeToEdit.exitPrice?.toString() || '',
          original_sl: tradeToEdit.original_sl?.toString() || '',
          takeProfit: tradeToEdit.takeProfit?.toString() || '',
          quantity: tradeToEdit.quantity.toString(),
          strategy: tradeToEdit.strategy || '',
          notes: tradeToEdit.notes || '',
        });
      } else {
        alert('Trade not found');
        navigate('/trades');
      }
    }
  }, [id, trades, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tradeToEdit = trades.find((trade) => trade.id === id);
    if (!tradeToEdit) return;

    try {
      const entryPrice = parseFloat(formData.entryPrice);
      const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : undefined;
      const original_sl = formData.original_sl ? parseFloat(formData.original_sl) : undefined;
      const takeProfit = formData.takeProfit ? parseFloat(formData.takeProfit) : undefined;

      // Calculate forecasted and actual RR
      let forecasted_rr = undefined;
      let actual_rr = undefined;

      if (original_sl && takeProfit) {
        forecasted_rr = calculateRR(entryPrice, original_sl, takeProfit, formData.side as 'LONG' | 'SHORT');
      }

      if (original_sl && exitPrice) {
        actual_rr = calculateRR(entryPrice, original_sl, exitPrice, formData.side as 'LONG' | 'SHORT');
      }

      const updatedTrade: Trade = {
        ...tradeToEdit,
        date: formData.date,
        time: formData.time,
        symbol: formData.symbol,
        side: formData.side as 'LONG' | 'SHORT',
        entryPrice: entryPrice,
        exitPrice: exitPrice || 0,
        original_sl: original_sl,
        takeProfit: takeProfit,
        forecasted_rr: forecasted_rr,
        actual_rr: actual_rr,
        quantity: parseFloat(formData.quantity),
        strategy: formData.strategy,
        notes: formData.notes,
      };

      await editTrade(updatedTrade);
      navigate('/trades');
    } catch (error) {
      console.error('Error updating trade:', error);
      alert('Failed to update trade. Please check all fields.');
    }
  };

  // Check if there are strategies (playbooks)
  if (playbooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118] flex">
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-[#120322] p-8 rounded-lg border border-purple-800/30 backdrop-blur-sm max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4 text-purple-100">No Strategies Available</h2>
            <p className="text-purple-200 mb-6">
              You currently have no strategies. Please create a strategy in the Playbooks section to proceed with editing trades.
            </p>
            <button
              onClick={() => navigate('/playbook', { state: { from: `/edit-trade/${id}` } })}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              Go to Playbooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118] flex">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`flex-1 p-8 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-purple-100">Edit Trade</h1>
          </div>
          <form onSubmit={handleSubmit} className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm space-y-6">
            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  step="1" // Allows seconds
                />
              </div>
            </div>

            {/* Symbol */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Side */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Side</label>
              <select
                name="side"
                value={formData.side}
                onChange={handleChange}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select side</option>
                <option value="LONG">Long</option>
                <option value="SHORT">Short</option>
              </select>
            </div>

            {/* Entry Price, Exit Price, Quantity */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Entry Price</label>
                <input
                  type="number"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Exit Price</label>
                <input
                  type="number"
                  name="exitPrice"
                  value={formData.exitPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Stop Loss and Take Profit */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Original Stop Loss</label>
                <input
                  type="number"
                  name="original_sl"
                  value={formData.original_sl}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Take Profit</label>
                <input
                  type="number"
                  name="takeProfit"
                  value={formData.takeProfit}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Strategy</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-purple-200 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/trades')}
                className="px-4 py-2 border border-purple-800/30 rounded-lg text-purple-200 hover:bg-purple-800/20 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTradeForm;
