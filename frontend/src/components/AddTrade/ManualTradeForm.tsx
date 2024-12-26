// src/components/ManualTradeForm.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';


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

// Define the structure for Execution entries
interface Execution {
  id: string;
  type: 'ENTRY' | 'EXIT';
  price: string;
  quantity: string;
  fee: string;
}

interface ManualTradeFormProps {
  onBack: () => void;
}

export default function ManualTradeForm({ onBack }: ManualTradeFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTrade, playbooks } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Initialize form data excluding exitPrice and takeProfits
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/,/g, ''),  // Ensures HH:MM:SS format
    contractType: '',
    side: '',
    entryPrice: '',
    original_sl: '',  // Added original stop loss
    takeProfit: '',   // Added take profit
    quantity: '',
    strategy: '',
    notes: '',
    brokerage: '',
    timestamp: new Date().toISOString(),
  });

  // Initialize executions with one Entry execution
  const [executions, setExecutions] = useState<Execution[]>([
    { id: crypto.randomUUID(), type: 'ENTRY', price: formData.entryPrice, quantity: formData.quantity, fee: '0' }
  ]);

  // Function to calculate total PNL
  const calculatePnL = (data: typeof formData, exes: Execution[]) => {
    //console.log('🔍 calculatePnL input:', { data, exes });
    
    const contractType = data.contractType;
    const multiplier = contractSpecs[contractType]?.multiplier || 1;
    const direction = data.side === 'LONG' ? 1 : -1;
  
    console.log('📊 PNL calculation params:', {
      contractType,
      multiplier,
      direction,
    });
  
    let totalPnL = 0;
    const entry = exes.find(exe => exe.type === 'ENTRY');
    
    //console.log('🎯 Entry execution:', entry);
    
    if (!entry) {
      console.warn('⚠️ No entry execution found');
      return 0;
    }
  
    const entryPrice = parseFloat(entry.price);
    const entryQuantity = parseFloat(entry.quantity);
  
    //console.log('📈 Processing exit executions...');
    exes.forEach(exe => {
      if (exe.type === 'EXIT') {
        const exitPrice = parseFloat(exe.price);
        const exitQuantity = parseFloat(exe.quantity);
        const fee = parseFloat(exe.fee) || 0;
  
        const pointDifference = exitPrice - entryPrice;
        const pnl = pointDifference * exitQuantity * multiplier * direction - fee;
        
        console.log('Exit execution details:', {
          exitPrice,
          exitQuantity,
          fee,
          pointDifference,
          executionPnL: pnl
        });
        
        totalPnL += pnl;
      }
    });
  
    //console.log('💰 Final PNL:', totalPnL);
    return totalPnL;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update the Entry execution if entryPrice or quantity changes
    if (name === 'entryPrice' || name === 'quantity') {
      setExecutions(prevExes =>
        prevExes.map(exe => exe.type === 'ENTRY' ? { ...exe, price: name === 'entryPrice' ? value : exe.price, quantity: name === 'quantity' ? value : exe.quantity } : exe)
      );
    }
  };

  // Handle changes for Execution entries
  const handleExecutionChange = (id: string, field: keyof Omit<Execution, 'id'>, value: string) => {
    setExecutions(prevExes =>
      prevExes.map(exe => (exe.id === id ? { ...exe, [field]: value } : exe))
    );
  };

  // Add a new Execution entry
  const addExecution = () => {
    setExecutions(prevExes => [
      ...prevExes,
      { id: crypto.randomUUID(), type: 'EXIT', price: '', quantity: '', fee: '0' }
    ]);
  };

  // Remove an Execution entry
  const removeExecution = (id: string) => {
    setExecutions(prevExes => prevExes.filter(exe => exe.id !== id));
  };

  const calculateRR = (entry: number, sl: number, tp: number, side: 'LONG' | 'SHORT'): number => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return risk !== 0 ? reward / risk : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add seconds to time if not present
    const timeWithSeconds = formData.time.split(':').length === 2 
      ? `${formData.time}:00` 
      : formData.time;

    try {
      const entryPrice = parseFloat(formData.entryPrice);
      const original_sl = formData.original_sl ? parseFloat(formData.original_sl) : undefined;
      const takeProfit = formData.takeProfit ? parseFloat(formData.takeProfit) : undefined;
      const exitPrice = executions.find(exe => exe.type === 'EXIT')?.price ? 
        parseFloat(executions.find(exe => exe.type === 'EXIT')!.price) : 
        undefined;

      // Calculate forecasted and actual RR
      let forecasted_rr = undefined;
      let actual_rr = undefined;

      if (original_sl && takeProfit) {
        forecasted_rr = calculateRR(entryPrice, original_sl, takeProfit, formData.side as 'LONG' | 'SHORT');
      }

      if (original_sl && exitPrice) {
        actual_rr = calculateRR(entryPrice, original_sl, exitPrice, formData.side as 'LONG' | 'SHORT');
      }

      const tradeData = {
        id: crypto.randomUUID(),
        date: formData.date,
        time: timeWithSeconds,
        timestamp: new Date(`${formData.date}T${timeWithSeconds}`).toISOString(),
        pnl: calculatePnL(formData, executions),
        strategy: formData.strategy,
        notes: formData.notes,
        symbol: `${formData.contractType}`,
        side: formData.side as 'LONG' | 'SHORT',
        entryPrice: entryPrice,
        exitPrice: exitPrice || 0,
        original_sl: original_sl,
        takeProfit: takeProfit,
        forecasted_rr: forecasted_rr,
        actual_rr: actual_rr,
        quantity: parseFloat(formData.quantity) || 0,
        contractMultiplier: contractSpecs[formData.contractType]?.multiplier || 1,
        brokerage: formData.brokerage || '',
      };
  
      console.log('📤 Sending trade data to context:', tradeData);
      
      // Add error handling for the addTrade call
      addTrade(tradeData)
        .then(() => {
          console.log('✅ Trade submitted successfully');
          navigate('/trades');
        })
        .catch((error) => {
          console.error('❌ Error adding trade:', error);
          alert('Failed to add trade. Please ensure all fields are correct.');
        });

    } catch (error) {
      console.error('❌ Error preparing trade data:', error);
      alert('Failed to prepare trade data. Please check all fields.');
    }
  };

  // Check if there are strategies (playbooks)
  if (playbooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} flex items-center justify-center p-8`}>
          <div className="bg-[#120322] p-8 rounded-lg border border-purple-800/30 backdrop-blur-sm max-w-md text-center">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onBack}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-semibold text-purple-100">No Strategies Available</h2>
            </div>
            <p className="text-purple-200 mb-6">
              You currently have no strategies. Please create a strategy in the Playbooks section to proceed with adding trades.
            </p>
            <Link
              to="/playbook"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block"
            >
              Go to Playbooks
            </Link>
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-purple-100">Add Trade</h1>
          </div>
          <form onSubmit={handleSubmit} className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm space-y-6">
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
                  step="1"
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Contract</label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Contract</option>
                  {Object.keys(contractSpecs).map(contract => (
                    <option key={contract} value={contract}>{contract}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Side</label>
                <select
                  name="side"
                  value={formData.side}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Side</option>
                  <option value="LONG">Long</option>
                  <option value="SHORT">Short</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Strategy</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Strategy</option>
                {playbooks.map(playbook => (
                  <option key={playbook.id} value={playbook.id}>{playbook.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Brokerage</label>
              <select
                name="brokerage"
                value={formData.brokerage}
                onChange={handleChange}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Brokerage</option>
                {brokerages.map(brokerage => (
                  <option key={brokerage.id} value={brokerage.id}>{brokerage.name}</option>
                ))}
              </select>
            </div>

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

            <div>
              <h3 className="text-lg font-medium text-purple-100 mb-4">Executions</h3>
              {executions.map((execution, index) => (
                <div key={execution.id} className="mb-4 p-4 bg-[#1A0F2E] rounded-lg border border-purple-800/30">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">Type</label>
                      <select
                        value={execution.type}
                        onChange={(e) => handleExecutionChange(execution.id, 'type', e.target.value as 'ENTRY' | 'EXIT')}
                        className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={execution.type === 'ENTRY'}
                      >
                        <option value="ENTRY">Entry</option>
                        <option value="EXIT">Exit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={execution.price}
                        onChange={(e) => handleExecutionChange(execution.id, 'price', e.target.value)}
                        className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={execution.quantity}
                        onChange={(e) => handleExecutionChange(execution.id, 'quantity', e.target.value)}
                        className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  {execution.type === 'EXIT' && (
                    <button
                      type="button"
                      onClick={() => removeExecution(execution.id)}
                      className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addExecution}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                Add Exit
              </button>
            </div>

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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/trades')}
                className="px-4 py-2 bg-[#2A1A4A] text-purple-100 rounded-lg hover:bg-purple-800/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Trade
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
