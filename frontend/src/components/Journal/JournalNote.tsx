import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useTrades } from '../../context/TradeContext';
import { useJournal } from '../../context/JournalContext';
import 'react-quill/dist/quill.snow.css';
import { Trade } from '../../types/trade';
import { TEMPLATES } from '../../constants/journalTemplates';

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