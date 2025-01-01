import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, TrendingUp, BarChart2 } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTrades } from '../context/TradeContext';
import type { Playbook as PlaybookType } from '../context/TradeContext';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialName: string;
  initialDescription: string;
  onSubmit: (name: string, description: string) => Promise<void>;
}

function CustomModal({ isOpen, onClose, title, initialName, initialDescription, onSubmit }: CustomModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-purple-100">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A1A4A] text-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter playbook name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#2A1A4A] text-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-32"
              placeholder="Enter playbook description"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2A1A4A] text-purple-100 rounded-lg hover:bg-purple-800/20"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(name, description)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DropdownMenu({ isOpen, onClose, onEdit, onDelete }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#120322] border border-purple-800/30">
      <div className="py-1" role="menu">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm text-purple-100 hover:bg-[#2A1A4A]"
          role="menuitem"
        >
          Edit Playbook
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2A1A4A]"
          role="menuitem"
        >
          Delete Playbook
        </button>
      </div>
    </div>
  );
}

export function Playbook() {
  const navigate = useNavigate();
  const { trades, playbooks, addPlaybook, editPlaybook, deletePlaybook, isLoading, fetchTrades, fetchPlaybooks } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookType | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [newPlaybookName, setNewPlaybookName] = useState('');
  const [newPlaybookDescription, setNewPlaybookDescription] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Initial data load and background refresh
  useEffect(() => {
    const loadData = async () => {
      // If we have no data, show loading state and fetch
      if (trades.length === 0 || playbooks.length === 0) {
        await Promise.all([fetchTrades(), fetchPlaybooks()]);
        return;
      }

      // If we have data, do a background refresh
      setIsBackgroundLoading(true);
      try {
        await Promise.all([fetchTrades(), fetchPlaybooks()]);
      } catch (error) {
        console.error('Background refresh failed:', error);
      } finally {
        setIsBackgroundLoading(false);
      }
    };

    loadData();

    // Set up periodic background refresh every 30 seconds
    const refreshInterval = setInterval(loadData, 30000);

    return () => clearInterval(refreshInterval);
  }, [fetchTrades, fetchPlaybooks, trades.length, playbooks.length]);

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

  const handleModalConfirm = async () => {
    if (newPlaybookName) {
      try {
        await addPlaybook({
          name: newPlaybookName,
          description: newPlaybookDescription,
          userId: '' // This will be set by the backend
        });
        setIsModalOpen(false);
        setNewPlaybookName('');
        setNewPlaybookDescription('');
      } catch (error) {
        console.error('Error creating playbook:', error);
        // Add error handling UI feedback here
      }
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);

  const handleEditClick = (playbook: PlaybookType) => {
    setSelectedPlaybook(playbook);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this playbook?')) {
      await deletePlaybook(id);
    }
  };

  const handleModalSubmit = async (name: string, description: string) => {
    if (modalMode === 'edit' && selectedPlaybook) {
      await editPlaybook({
        ...selectedPlaybook,
        name,
        description
      });
    } else {
      await addPlaybook({
        name,
        description,
        userId: ''  // This will be set by the backend
      });
    }
    setIsModalOpen(false);
    setSelectedPlaybook(null);
  };

  // Only show loading state if we have no cached data
  if (isLoading && (trades.length === 0 || playbooks.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-purple-100">
            Playbook
            {isBackgroundLoading && (
              <span className="ml-3 inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            )}
          </h1>
          <button
            onClick={() => {
              setModalMode('add');
              setSelectedPlaybook(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            data-tour="create-playbook"
          >
            <Plus size={20} /> Create Playbook
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {playbookSummaries.map((playbook) => (
            <div
              key={playbook.id}
              className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 cursor-pointer hover:bg-[#2A1A4A] transition-colors duration-300"
              onClick={() => handlePlaybookClick(playbook.id)}
              data-tour="playbook-card"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-purple-100">{playbook.name}</h2>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === playbook.id ? null : playbook.id);
                    }}
                    className="text-purple-400 hover:text-purple-300 p-1"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  <DropdownMenu
                    isOpen={openDropdownId === playbook.id}
                    onClose={() => setOpenDropdownId(null)}
                    onEdit={() => handleEditClick(playbook)}
                    onDelete={() => handleDeleteClick(playbook.id)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-purple-400" size={16} />
                  <div>
                    <p className="text-sm text-purple-400">Net P&L</p>
                    <p className={`font-semibold ${
                      playbook.netPnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(playbook.netPnl)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-purple-400" size={16} />
                  <div>
                    <p className="text-sm text-purple-400">Win Rate</p>
                    <p className="font-semibold text-purple-100">{formatPercent(playbook.winRate)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-purple-400">
                {playbook.trades} trade{playbook.trades !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlaybook(null);
        }}
        title={modalMode === 'edit' ? 'Edit Playbook' : 'Add Playbook'}
        initialName={selectedPlaybook?.name || ''}
        initialDescription={selectedPlaybook?.description || ''}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}