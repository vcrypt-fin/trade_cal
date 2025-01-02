// src/components/ManualTradeForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';
import { supabase } from '../../context/SupabaseClient';
import { Upload, Trash2 } from 'lucide-react';
import ManualTradeTutorial from '../ManualTradeTutorial';
import { toast } from 'react-hot-toast';
import { useTutorial } from '../../context/TutorialContext';


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

const FORM_STORAGE_KEY = 'trademind_manual_trade_form';

export default function ManualTradeForm({ onBack }: ManualTradeFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTrade, playbooks } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setShowManualTradeTutorial } = useTutorial();
  
  // Initialize form data from localStorage or defaults
  const [formData, setFormData] = useState(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      return {
        ...parsed,
        date: parsed.date || new Date().toISOString().split('T')[0],
        time: parsed.time || new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/,/g, '')
      };
    }
    
    return {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/,/g, ''),
      contractType: '',
      side: '',
      entryPrice: '',
      original_sl: '',
      takeProfit: '',
      quantity: '',
      strategy: '',
      notes: '',
      brokerage: '',
      timestamp: new Date().toISOString(),
    };
  });

  // Initialize executions from localStorage or defaults
  const [executions, setExecutions] = useState<Execution[]>(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      return parsed.executions || [{ 
        id: crypto.randomUUID(), 
        type: 'ENTRY', 
        price: formData.entryPrice, 
        quantity: formData.quantity, 
        fee: '0' 
      }];
    }
    return [{ 
      id: crypto.randomUUID(), 
      type: 'ENTRY', 
      price: formData.entryPrice, 
      quantity: formData.quantity, 
      fee: '0' 
    }];
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      ...formData,
      executions
    }));
  }, [formData, executions]);

  const clearForm = () => {
    const confirmed = window.confirm('Are you sure you want to clear all form data? This cannot be undone.');
    if (confirmed) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/,/g, ''),
        contractType: '',
        side: '',
        entryPrice: '',
        original_sl: '',
        takeProfit: '',
        quantity: '',
        strategy: '',
        notes: '',
        brokerage: '',
        timestamp: new Date().toISOString(),
      });
      setExecutions([{ 
        id: crypto.randomUUID(), 
        type: 'ENTRY', 
        price: '', 
        quantity: '', 
        fee: '0' 
      }]);
      setUploadedImage(null);
      setImagePreview(null);
      localStorage.removeItem(FORM_STORAGE_KEY);
      toast.success('Form data cleared successfully', {
        style: {
          background: '#2A1A4A',
          color: '#E5E7EB',
          border: '1px solid rgba(147, 51, 234, 0.3)',
        },
      });
    }
  };

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
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verify file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        alert('Please upload only PNG or JPEG files');
        return;
      }

      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Create a new File instance with explicit MIME type
      const newFile = new File([file], file.name, {
        type: file.type,
      });

      setUploadedImage(newFile);
      const previewUrl = URL.createObjectURL(newFile);
      setImagePreview(previewUrl);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user session');

      console.log('Original file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Create form data
      const formData = new FormData();
      // Important: Do not set any name for the file append
      formData.append('', file);

      // Make direct request to Supabase Storage API
      const response = await fetch(
        `https://wxvmssqfidodxyoxjtju.supabase.co/storage/v1/object/trade-images/${filePath}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error);
        throw new Error(error.message);
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('trade-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (validTypes.includes(file.type)) {
        console.log('Dropped file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
        setUploadedImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        alert('Please upload only PNG or JPEG files.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Check if there's at least one exit execution
    const hasExitExecution = executions.some(exe => exe.type === 'EXIT');
    if (!hasExitExecution) {
      setIsUploading(false);
      toast.error(
        <div className="flex flex-col gap-2">
          <span className="font-bold">⚠️ Missing Exit Execution</span>
          <span>You must add at least one exit execution to log your trade. Click the "Add Exit" button below the executions section.</span>
        </div>,
        {
          duration: 5000,
          style: {
            background: '#2A1A4A',
            color: '#E5E7EB',
            border: '1px solid rgba(147, 51, 234, 0.3)',
          },
        }
      );
      
      // Create and show tooltip
      const addExitBtn = document.querySelector('[data-tour="add-exit-btn"]');
      if (addExitBtn) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed bg-[#1E1E1E] text-white px-4 py-3 rounded-lg shadow-xl z-50 text-sm';
        tooltip.style.width = '220px';
        tooltip.innerHTML = `
          <div class="flex items-center gap-2 font-semibold text-[#FFB020] mb-2">
            <span class="text-lg">⚠</span>
            <span>Action Required</span>
          </div>
          <div class="text-[#D1D5DB] text-[13px] leading-tight">Click here to add your exit execution. This is required to calculate your P&L correctly.</div>
        `;
        
        // Position tooltip
        const btnRect = addExitBtn.getBoundingClientRect();
        tooltip.style.top = `${btnRect.top - 100}px`; // Position above button
        tooltip.style.left = `${btnRect.left + (btnRect.width / 2) - 110}px`; // Center horizontally
        
        // Add arrow
        const arrow = document.createElement('div');
        arrow.className = 'absolute w-4 h-4 bg-[#1E1E1E] rotate-45';
        arrow.style.bottom = '-8px';
        arrow.style.left = '50%';
        arrow.style.transform = 'translateX(-50%) rotate(45deg)';
        tooltip.appendChild(arrow);
        
        // Add to document
        document.body.appendChild(tooltip);
        
        // Highlight button
        addExitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addExitBtn.classList.add('animate-pulse', 'ring-2', 'ring-[#FFB020]', 'ring-opacity-50');
        
        // Remove tooltip and highlight after delay
        setTimeout(() => {
          tooltip.remove();
          addExitBtn.classList.remove('animate-pulse', 'ring-2', 'ring-[#FFB020]', 'ring-opacity-50');
        }, 5000);
      }
      return;
    }
    
    // Add seconds to time if not present
    const timeWithSeconds = formData.time.split(':').length === 2 
      ? `${formData.time}:00` 
      : formData.time;

    try {
      let imageUrl = null;
      if (uploadedImage) {
        imageUrl = await uploadImageToSupabase(uploadedImage);
      }

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
        img: imageUrl,
      };
      
      console.log('📤 Sending trade data to context:', tradeData);
      
      await addTrade(tradeData);
      console.log('✅ Trade submitted successfully');
      
      // Clear form data from localStorage after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      toast.success('Trade logged successfully!', {
        style: {
          background: '#2A1A4A',
          color: '#E5E7EB',
          border: '1px solid rgba(147, 51, 234, 0.3)',
        },
      });
      navigate('/trades');
    } catch (error) {
      console.error('❌ Error preparing trade data:', error);
      toast.error('Failed to log trade. Please check all fields.', {
        style: {
          background: '#2A1A4A',
          color: '#E5E7EB',
          border: '1px solid rgba(147, 51, 234, 0.3)',
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Check if there are strategies (playbooks)
  if (playbooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <ManualTradeTutorial />
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
      <ManualTradeTutorial />
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-semibold text-purple-100">Add Trade</h1>
            </div>
            <button
              onClick={clearForm}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear all form data"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm">Clear Form</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm space-y-6">
            <div className="grid grid-cols-2 gap-6" data-tour="trade-datetime">
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

            <div className="grid grid-cols-2 gap-6" data-tour="trade-contract">
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

            <div data-tour="trade-strategy">
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

            <div data-tour="trade-brokerage">
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

            <div className="grid grid-cols-3 gap-6" data-tour="trade-prices">
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

            <div data-tour="trade-quantity">
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

            <div data-tour="trade-executions">
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
                data-tour="add-exit-btn"
              >
                Add Exit
              </button>
            </div>

            <div data-tour="trade-screenshot">
              <label className="block text-sm font-medium text-purple-200 mb-1">Trade Screenshot</label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-800/30 border-dashed rounded-lg hover:border-purple-600 transition-colors duration-300 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Trade screenshot preview"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-purple-400" />
                      <div className="flex justify-center text-sm text-purple-400">
                        <span className="relative cursor-pointer rounded-md font-medium text-purple-300 hover:text-purple-200">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-purple-400">
                        PNG or JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div data-tour="trade-notes">
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
                disabled={isUploading}
                className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Uploading...' : 'Add Trade'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
