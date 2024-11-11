import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, TrendingUp, BarChart2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTrades } from '../context/TradeContext';

// Custom Modal Component
function CustomModal({ isOpen, onRequestClose, title, onConfirm, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function Playbook() {
  const navigate = useNavigate();
  const { trades, playbooks, addPlaybook } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaybookName, setNewPlaybookName] = useState('');
  const [newPlaybookDescription, setNewPlaybookDescription] = useState('');

  // Calculate summary stats for each playbook
  const playbookSummaries = playbooks.map(playbook => {
    const playbookTrades = trades.filter(trade => trade.strategy === playbook.id);
    const netPnl = playbookTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = playbookTrades.filter(trade => trade.pnl > 0);
    const winRate = playbookTrades.length > 0 
      ? (winningTrades.length / playbookTrades.length) * 100 
      : 0;

    return {
      ...playbook,
      netPnl,
      trades: playbookTrades.length,
      winRate
    };
  });

  const handlePlaybookClick = (id: string) => {
    navigate(`/playbook/${id}`);
  };

  const handleCreatePlaybook = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (newPlaybookName) {
      addPlaybook({
        name: newPlaybookName,
        description: newPlaybookDescription
      });
      setIsModalOpen(false);
      setNewPlaybookName('');
      setNewPlaybookDescription('');
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Playbook</h1>
          <button
            onClick={handleCreatePlaybook}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="inline-block mr-2" /> Create Playbook
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {playbookSummaries.map((playbook) => (
            <div
              key={playbook.id}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
              onClick={() => handlePlaybookClick(playbook.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{playbook.name}</h2>
                <MoreHorizontal size={20} className="text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Net P&L</p>
                    <p className={`font-semibold ${
                      playbook.netPnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(playbook.netPnl)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="font-semibold">{formatPercent(playbook.winRate)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {playbook.trades} trade{playbook.trades !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title="Add New Playbook"
        onConfirm={handleModalConfirm}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Playbook Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter playbook name"
              value={newPlaybookName}
              onChange={(e) => setNewPlaybookName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter playbook description"
              value={newPlaybookDescription}
              onChange={(e) => setNewPlaybookDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
}