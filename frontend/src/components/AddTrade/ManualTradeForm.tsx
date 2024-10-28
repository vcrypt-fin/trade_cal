import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';
import AddTradeForm from './components/AddTrade/AddTradeForm';

interface ContractSpec {
  symbol: string;
  multiplier: number;
}

const contractSpecs: Record<string, ContractSpec> = {
  'MNQ': { symbol: 'MNQ', multiplier: 2 },
  'MES': { symbol: 'MES', multiplier: 5 },
  'ES': { symbol: 'ES', multiplier: 50 },
  'NQ': { symbol: 'NQ', multiplier: 20 },
  'RTY': { symbol: 'RTY', multiplier: 10 },
  'CL': { symbol: 'CL', multiplier: 1000 },
  'GC': { symbol: 'GC', multiplier: 100 },
  'SI': { symbol: 'SI', multiplier: 5000 },
};

const brokerages = [
  { id: 'tradeovate', name: 'Tradeovate' }
];

const ManualTradeForm: React.FC = () => {
  const navigate = useNavigate();
  const { addTrade, playbooks } = useTrades();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
    symbol: '',
    contractType: '',
    side: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    strategy: '',
    notes: '',
    brokerage: ''
  });

  const calculatePnL = (data: typeof formData) => {
    const quantity = parseFloat(data.quantity);
    const entryPrice = parseFloat(data.entryPrice);
    const exitPrice = parseFloat(data.exitPrice);
    const contractType = data.contractType;
    const multiplier = contractSpecs[contractType]?.multiplier || 1;
    
    const pointDifference = exitPrice - entryPrice;
    const direction = data.side === 'LONG' ? 1 : -1;
    
    return pointDifference * quantity * multiplier * direction;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pnl = calculatePnL(formData);
    
    addTrade({
      id: crypto.randomUUID(),
      date: formData.date,
      time: formData.time,
      pnl,
      strategy: formData.strategy,
      notes: formData.notes,
      symbol: `${formData.contractType}`,
      side: formData.side,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      quantity: parseFloat(formData.quantity),
      contractMultiplier: contractSpecs[formData.contractType]?.multiplier || 1,
      brokerage: formData.brokerage
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">Manual Trade Entry</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
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

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage</label>
              <select
                name="brokerage"
                value={formData.brokerage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select brokerage</option>
                {brokerages.map(brokerage => (
                  <option key={brokerage.id} value={brokerage.id}>
                    {brokerage.name}
                  </option>
                ))}
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Side</label>
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Exit Price</label>
                <input
                  type="number"
                  name="exitPrice"
                  value={formData.exitPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
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