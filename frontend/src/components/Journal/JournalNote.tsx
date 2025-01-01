import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useTrades } from '../../context/TradeContext';
import { useJournal } from '../../context/JournalContext';
import { supabase } from '../../context/SupabaseClient';
import 'react-quill/dist/quill.snow.css';
import { Trade } from '../../types/trade';
import { TEMPLATES } from '../../constants/journalTemplates';
import { X } from 'lucide-react';

interface JournalNoteProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
  date: string;
}

const JournalNote: React.FC<JournalNoteProps> = ({ content, onChange, onSave, onClose, date }) => {
  const { trades } = useTrades();
  const { updateEntry, getEntry } = useJournal();
  const [noteContent, setNoteContent] = useState(content);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(getEntry(date)?.tags || []);
  const [linkedTrades, setLinkedTrades] = useState<string[]>(getEntry(date)?.linkedTrades || []);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get public URLs for all trade images
    const tradesWithImages = trades.filter(trade => trade.date === date && trade.img);
    const urlMap: Record<string, string> = {};
    
    tradesWithImages.forEach(trade => {
      if (trade.img) {
        const { data } = supabase.storage
          .from('trade-images')
          .getPublicUrl(trade.img.split('trade-images/')[1]);
        urlMap[trade.id] = data.publicUrl;
      }
    });
    
    setImageUrls(urlMap);
  }, [trades, date]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ]
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTradeLink = (tradeId: string) => {
    setLinkedTrades(prev => 
      prev.includes(tradeId)
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  const handleTemplateInsert = (templateContent: string) => {
    const newContent = noteContent + '\n\n' + templateContent;
    setNoteContent(newContent);
    onChange(newContent);
  };

  const handleSave = () => {
    const entry = getEntry(date);
    if (entry) {
      updateEntry(entry.id, {
        content: noteContent,
        tags,
        linkedTrades
      });
    }
    onSave();
  };

  const handleContentChange = (newContent: string) => {
    setNoteContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-[#110420] via-[#0B0118] to-[#0B0118] rounded-lg w-full max-w-4xl h-[90vh] flex flex-col border border-purple-800/30">
        <div className="p-4 border-b border-purple-800/30 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-purple-100">Journal Note</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-200"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Templates Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-purple-200">Templates</h3>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((template: { name: string; content: string }, index: number) => (
                <button
                  key={index}
                  onClick={() => handleTemplateInsert(template.content)}
                  className="px-3 py-1 bg-purple-800/10 text-purple-300 rounded-md text-sm hover:bg-purple-800/20 transition-colors duration-300 border border-purple-800/20 backdrop-blur-sm"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-purple-200">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-800/10 text-purple-300 rounded-md text-sm border border-purple-800/20 backdrop-blur-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-1 bg-purple-800/10 text-purple-200 rounded-md border border-purple-800/20 placeholder-purple-400 focus:outline-none focus:border-purple-600 backdrop-blur-sm"
              />
              <button
                onClick={handleTagAdd}
                className="px-3 py-1 bg-purple-800/10 text-purple-300 rounded-md hover:bg-purple-800/20 transition-colors duration-300 border border-purple-800/20 backdrop-blur-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Trade Images Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-purple-200">Trade Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {trades
                .filter(trade => trade.date === date && trade.img)
                .map((trade) => (
                  <div
                    key={trade.id}
                    className="relative group cursor-pointer bg-purple-800/10 rounded-lg p-4 border border-purple-800/20"
                    onClick={() => setSelectedImageUrl(imageUrls[trade.id])}
                  >
                    <div className="mb-2 text-sm text-purple-300">
                      <div className="flex justify-between items-center mb-1">
                        <span>{trade.time}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span>{trade.symbol}</span>
                        <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ${trade.pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={imageUrls[trade.id]}
                        alt={`Trade at ${trade.time} - ${trade.symbol} ${trade.side}`}
                        className="w-full h-32 object-cover rounded-lg border border-purple-800/20"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">Click to expand</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {trades.filter(trade => trade.date === date && trade.img).length === 0 && (
              <div className="text-purple-400 text-sm text-center py-4 bg-purple-800/10 rounded-lg border border-purple-800/20">
                No trade images available for this day
              </div>
            )}
          </div>

          {/* Linked Trades Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-purple-200">Link Trades</h3>
            <div className="border border-purple-800/20 rounded-lg max-h-40 overflow-y-auto bg-purple-800/10 backdrop-blur-sm">
              {trades.filter(trade => trade.date === date).map((trade) => (
                <div
                  key={trade.id}
                  className={`flex items-center p-2 hover:bg-purple-800/20 cursor-pointer transition-colors duration-200 ${
                    linkedTrades.includes(trade.id) ? 'bg-purple-800/30' : ''
                  }`}
                  onClick={() => handleTradeLink(trade.id)}
                >
                  <input
                    type="checkbox"
                    checked={linkedTrades.includes(trade.id)}
                    onChange={() => {}}
                    className="mr-2 accent-purple-500"
                  />
                  <span className="text-sm text-purple-200">
                    {trade.time} - {trade.symbol} - {trade.side} - ${trade.pnl.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note Editor */}
          <ReactQuill
            theme="snow"
            value={noteContent}
            onChange={handleContentChange}
            modules={modules}
            className="h-[calc(100%-280px)] text-purple-200 [&_.ql-toolbar]:bg-purple-800/10 [&_.ql-toolbar]:border-purple-800/20 [&_.ql-toolbar]:backdrop-blur-sm [&_.ql-container]:bg-purple-800/10 [&_.ql-container]:border-purple-800/20 [&_.ql-container]:backdrop-blur-sm [&_.ql-editor]:text-purple-200"
          />
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

        <div className="p-4 border-t border-purple-800/30 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-purple-300 border border-purple-700 rounded-lg hover:bg-purple-800/20 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalNote;