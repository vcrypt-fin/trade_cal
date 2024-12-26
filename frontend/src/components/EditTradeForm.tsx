// src/components/EditTradeForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import type { Trade } from '../types/trade';
import Sidebar from './Sidebar';

const EditTradeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trades, editTrade, playbooks } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [formData, setFormData] = useState<Trade | null>(null);

  useEffect(() => {
    if (id) {
      const tradeToEdit = trades.find((trade) => trade.id === id);
      if (tradeToEdit) {
        // Directly set the time without conversion
        setFormData(tradeToEdit);
      } else {
        alert('Trade not found');
        navigate('/trades');
      }
    }
  }, [id, trades, navigate]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Trade | null) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'entryPrice' ||
              name === 'exitPrice' ||
              name === 'quantity'
                ? parseFloat(value)
                : value,
          }
        : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      // No conversion needed; save time as is
      editTrade(formData);
      alert('Trade updated successfully!');
      navigate('/trades');
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
                  value={formData.exitPrice !== undefined ? formData.exitPrice : ''}
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
