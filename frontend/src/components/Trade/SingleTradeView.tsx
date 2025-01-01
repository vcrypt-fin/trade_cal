import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import { supabase } from '../../context/SupabaseClient';
import Sidebar from '../Sidebar';
import { X, ArrowLeft, Edit2, Save, Upload, Trash2, Plus } from 'lucide-react';
import { Trade } from '../../types/trade';
import StatWidget from '../widgets/StatWidget';
import { Widget, StatWidgetType } from '../../types/widget';
import AddWidgetModal from '../widgets/AddWidgetModal';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

export default function SingleTradeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trades, editTrade } = useTrades();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [editedTrade, setEditedTrade] = useState<Trade | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem(`trade_widgets_${id}`);
    return savedWidgets ? JSON.parse(savedWidgets) : [
      { id: 'trade-pnl', type: 'net_pnl', title: 'P&L', position: 0, visible: true },
      { id: 'trade-rr', type: 'average_rr', title: 'Risk/Reward', position: 1, visible: true },
      { id: 'trade-points', type: 'win_loss_ratio', title: 'Points', position: 2, visible: true },
      { id: 'trade-forecasted-rr', type: 'profit_factor', title: 'Forecasted R:R', position: 3, visible: true }
    ];
  });
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  // Save widgets to localStorage when they change
  useEffect(() => {
    if (id) {
      localStorage.setItem(`trade_widgets_${id}`, JSON.stringify(widgets));
    }
  }, [widgets, id]);

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleDragStart = (e: React.DragEvent, widget: Widget) => {
    e.dataTransfer.setData('widgetId', widget.id);
  };

  const handleDragEnd = () => {
    // Reset any drag state if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWidget: Widget) => {
    e.preventDefault();
    const draggedWidgetId = e.dataTransfer.getData('widgetId');
    const updatedWidgets = [...widgets];
    const draggedIndex = updatedWidgets.findIndex(w => w.id === draggedWidgetId);
    const targetIndex = updatedWidgets.findIndex(w => w.id === targetWidget.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedWidget] = updatedWidgets.splice(draggedIndex, 1);
      updatedWidgets.splice(targetIndex, 0, draggedWidget);
      
      // Update positions
      updatedWidgets.forEach((widget, index) => {
        widget.position = index;
      });

      setWidgets(updatedWidgets);
    }
  };

  const getWidgetData = (widget: Widget) => {
    if (!trade) return { value: 0, type: 'number' as const, info: '' };

    switch (widget.type) {
      case 'net_pnl':
        return {
          value: trade.pnl,
          type: 'currency' as const,
          info: 'Profit/Loss for this trade'
        };
      case 'average_rr':
        return {
          value: trade.actual_rr?.toFixed(2) || '0',
          type: 'number' as const,
          info: 'Actual Risk/Reward ratio achieved'
        };
      case 'win_loss_ratio':
        return {
          value: (trade.exitPrice - trade.entryPrice) * (trade.side === 'LONG' ? 1 : -1),
          type: 'number' as const,
          info: 'Points gained or lost in this trade'
        };
      case 'profit_factor':
        return {
          value: trade.forecasted_rr?.toFixed(2) || '0',
          type: 'number' as const,
          info: 'Forecasted Risk/Reward ratio for this trade'
        };
      case 'total_trades':
        return {
          value: trade.quantity,
          type: 'number' as const,
          info: 'Number of contracts/shares traded'
        };
      case 'gross_profit':
        const riskAmount = trade.original_sl 
          ? Math.abs(trade.entryPrice - trade.original_sl) * trade.quantity * (trade.contractMultiplier || 1)
          : 0;
        return {
          value: riskAmount,
          type: 'currency' as const,
          info: 'Amount risked in this trade'
        };
      case 'gross_loss':
        const rewardAmount = trade.takeProfit 
          ? Math.abs(trade.takeProfit - trade.entryPrice) * trade.quantity * (trade.contractMultiplier || 1)
          : 0;
        return {
          value: rewardAmount,
          type: 'currency' as const,
          info: 'Potential reward in this trade'
        };
      case 'largest_win':
        const percentageReturn = trade.pnl !== 0 && trade.entryPrice !== 0
          ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice * 100) * (trade.side === 'LONG' ? 1 : -1)
          : 0;
        return {
          value: percentageReturn,
          type: 'percent' as const,
          info: 'Percentage return on this trade'
        };
      case 'largest_loss':
        const slippage = trade.takeProfit 
          ? Math.abs((trade.exitPrice - trade.takeProfit) / trade.takeProfit * 100)
          : 0;
        return {
          value: slippage,
          type: 'percent' as const,
          info: 'Slippage from target (if exited beyond target)'
        };
      case 'current_streak':
        const timeInTrade = trade.time 
          ? Math.round((new Date(`${trade.date} ${trade.time}`).getTime() - new Date(`${trade.date} ${trade.time}`).getTime()) / (1000 * 60))
          : 0;
        return {
          value: timeInTrade,
          type: 'number' as const,
          info: 'Time in trade (minutes)'
        };
      case 'win_rate':
        const priceVolatility = trade.original_sl && trade.takeProfit
          ? ((trade.takeProfit - trade.original_sl) / trade.entryPrice * 100)
          : 0;
        return {
          value: priceVolatility,
          type: 'percent' as const,
          info: 'Price volatility range for this trade'
        };
      case 'average_win':
        const avgFillPrice = (trade.entryPrice + trade.exitPrice) / 2;
        return {
          value: avgFillPrice,
          type: 'currency' as const,
          info: 'Average fill price for this trade'
        };
      case 'average_loss':
        const commission = trade.brokerage || 0;
        return {
          value: commission,
          type: 'currency' as const,
          info: 'Commission/fees for this trade'
        };
      default:
        return {
          value: 0,
          type: 'number' as const,
          info: ''
        };
    }
  };

  const trade = trades.find(t => t.id === id);

  useEffect(() => {
    if (trade?.img) {
      const { data } = supabase.storage
        .from('trade-images')
        .getPublicUrl(trade.img.split('trade-images/')[1]);
      setImageUrl(data.publicUrl);
    }
  }, [trade]);

  useEffect(() => {
    if (trade && !editedTrade) {
      setEditedTrade({ ...trade });
    }
  }, [trade]);

  if (!trade) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118] p-8">
        <div className="text-center text-purple-200">Trade not found</div>
      </div>
    );
  }

  const handleEdit = () => {
    if (trade) {
      setEditedTrade({ ...trade });
      setIsEditing(true);
    }
  };

  const calculatePnL = (trade: Trade) => {
    const direction = trade.side === 'LONG' ? 1 : -1;
    const pointDifference = trade.exitPrice - trade.entryPrice;
    return pointDifference * trade.quantity * (trade.contractMultiplier || 1) * direction;
  };

  const calculateForcastedRR = (trade: Trade) => {
    if (!trade.original_sl || !trade.takeProfit) return undefined;
    const risk = Math.abs(trade.entryPrice - trade.original_sl);
    const reward = Math.abs(trade.takeProfit - trade.entryPrice);
    return risk !== 0 ? reward / risk : undefined;
  };

  const calculateActualRR = (trade: Trade) => {
    if (!trade.original_sl || !trade.exitPrice) return undefined;
    const risk = Math.abs(trade.entryPrice - trade.original_sl);
    const reward = Math.abs(trade.exitPrice - trade.entryPrice);
    return risk !== 0 ? reward / risk : undefined;
  };

  const handleImageUpload = async (file: File) => {
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

      return `trade-images/${filePath}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleDeleteImage = async () => {
    if (!trade.img) return;

    try {
      const imagePath = trade.img.split('trade-images/')[1];
      const { error } = await supabase.storage
        .from('trade-images')
        .remove([imagePath]);

      if (error) throw error;

      // Update trade with null image
      const updatedTrade = { ...trade, img: null };
      await editTrade(updatedTrade);
      setImageUrl(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleSave = async () => {
    if (!editedTrade || !trade) return;

    try {
      let updatedImagePath = trade.img;

      // Handle image update if there's a new image
      if (newImage) {
        // Delete old image if it exists
        if (trade.img) {
          const oldImagePath = trade.img.split('trade-images/')[1];
          await supabase.storage
            .from('trade-images')
            .remove([oldImagePath]);
        }
        // Upload new image
        updatedImagePath = await handleImageUpload(newImage);
      }

      // Convert string values to numbers where needed
      const updatedTrade: Trade = {
        ...trade,
        ...editedTrade,
        entryPrice: parseFloat(editedTrade.entryPrice.toString()),
        exitPrice: parseFloat(editedTrade.exitPrice.toString()),
        original_sl: editedTrade.original_sl ? parseFloat(editedTrade.original_sl.toString()) : undefined,
        takeProfit: editedTrade.takeProfit ? parseFloat(editedTrade.takeProfit.toString()) : undefined,
        quantity: parseInt(editedTrade.quantity.toString()),
        contractMultiplier: editedTrade.contractMultiplier || 1,
        userId: trade.userId,
        img: updatedImagePath
      };

      // Calculate derived values
      updatedTrade.pnl = calculatePnL(updatedTrade);
      updatedTrade.forecasted_rr = calculateForcastedRR(updatedTrade);
      updatedTrade.actual_rr = calculateActualRR(updatedTrade);

      await editTrade(updatedTrade);
      
      setEditedTrade(updatedTrade);
      setIsEditing(false);
      setNewImage(null);
    } catch (error) {
      console.error('Error updating trade:', error);
      alert('Failed to update trade. Please check all fields.');
    }
  };

  const handleCancel = () => {
    if (trade) {
      setEditedTrade({ ...trade });
      setIsEditing(false);
      setNewImage(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTrade(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleAddWidget = (type: StatWidgetType, title: string) => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      position: widgets.length,
      visible: true
    };
    setWidgets([...widgets, newWidget]);
    setIsWidgetModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/trades')}
              className="flex items-center text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Trades
            </button>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Edit2 className="mr-2" size={16} />
                Edit Trade
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-purple-600 text-purple-300 rounded-lg hover:bg-purple-800/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Save className="mr-2" size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-100">Trade Statistics</h2>
            {/* {widgets.length < 4 && (
            //   <button
            //     onClick={() => setIsWidgetModalOpen(true)}
            //     className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            //   >
            //     <Plus size={16} className="mr-1" />
            //     Add Widget
            //   </button>
            )} */}
          </div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {widgets
              .sort((a, b) => a.position - b.position)
              .filter(widget => widget.visible)
              .slice(0, 4)
              .map(widget => (
                <StatWidget
                  key={widget.id}
                  widget={widget}
                  data={getWidgetData(widget)}
                  onRemove={handleRemoveWidget}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            {widgets.filter(w => w.visible).length < 4 && (
              <button
                onClick={() => setIsWidgetModalOpen(true)}
                className="h-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
              >
                <Plus size={24} />
              </button>
            )}
          </div>

          {/* Widget Selection Modal */}
          <AddWidgetModal
            isOpen={isWidgetModalOpen}
            onClose={() => setIsWidgetModalOpen(false)}
            onAddWidget={handleAddWidget}
            activeWidgets={widgets}
            isSingleTradeView={true}
          />

          {/* Trade Details */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-purple-100 mb-4">Trade Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Date & Time</label>
                    {isEditing && editedTrade ? (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          name="date"
                          value={editedTrade.date}
                          onChange={handleChange}
                          className="flex-1 p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                        />
                        <input
                          type="time"
                          name="time"
                          value={editedTrade.time}
                          onChange={handleChange}
                          step="1"
                          className="flex-1 p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                        />
                      </div>
                    ) : (
                      <p className="text-purple-100">{trade.date} {trade.time}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Symbol & Side</label>
                    {isEditing && editedTrade ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="symbol"
                          value={editedTrade.symbol}
                          onChange={handleChange}
                          className="flex-1 p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                        />
                        <select
                          name="side"
                          value={editedTrade.side}
                          onChange={handleChange}
                          className="flex-1 p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                        >
                          <option value="LONG">Long</option>
                          <option value="SHORT">Short</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-purple-100">{trade.symbol}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Entry & Exit</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-purple-400">Entry:</span>
                        {isEditing && editedTrade ? (
                          <input
                            type="number"
                            name="entryPrice"
                            value={editedTrade.entryPrice}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                          />
                        ) : (
                          <p className="text-purple-100">{formatCurrency(trade.entryPrice)}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-purple-400">Exit:</span>
                        {isEditing && editedTrade ? (
                          <input
                            type="number"
                            name="exitPrice"
                            value={editedTrade.exitPrice}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                          />
                        ) : (
                          <p className="text-purple-100">{formatCurrency(trade.exitPrice)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-purple-100 mb-4">Risk Management</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Stop Loss</label>
                    {isEditing && editedTrade ? (
                      <input
                        type="number"
                        name="original_sl"
                        value={editedTrade.original_sl || ''}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                      />
                    ) : (
                      <p className="text-purple-100">{trade.original_sl ? formatCurrency(trade.original_sl) : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Take Profit</label>
                    {isEditing && editedTrade ? (
                      <input
                        type="number"
                        name="takeProfit"
                        value={editedTrade.takeProfit || ''}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
                      />
                    ) : (
                      <p className="text-purple-100">{trade.takeProfit ? formatCurrency(trade.takeProfit) : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Risk/Reward Ratios</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-purple-400">Forecasted:</span>
                        <p className="text-purple-100">{trade.forecasted_rr?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-purple-400">Actual:</span>
                        <p className="text-purple-100">{trade.actual_rr?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Image */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-100">Trade Image</h2>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Upload size={16} className="mr-1" />
                    {imageUrl ? 'Replace' : 'Upload'}
                  </button>
                  {imageUrl && (
                    <button
                      onClick={handleDeleteImage}
                      className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            {(imageUrl || newImage) && (
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedImageUrl(newImage ? URL.createObjectURL(newImage) : imageUrl)}
              >
                <img
                  src={newImage ? URL.createObjectURL(newImage) : imageUrl!}
                  alt="Trade screenshot"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            )}
            {!imageUrl && !newImage && (
              <div className="text-center p-8 border-2 border-dashed border-purple-800/30 rounded-lg">
                <p className="text-purple-400">No image uploaded</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-purple-100 mb-4">Notes</h2>
            {isEditing && editedTrade ? (
              <textarea
                name="notes"
                value={editedTrade.notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 bg-[#2A1A4A] border border-purple-800/30 rounded-lg text-purple-100"
              />
            ) : (
              <p className="text-purple-100 whitespace-pre-wrap">{trade.notes || ''}</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImageUrl && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] bg-[#120322] p-4 rounded-lg">
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="absolute top-2 right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImageUrl}
              alt="Trade screenshot"
              className="max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
} 