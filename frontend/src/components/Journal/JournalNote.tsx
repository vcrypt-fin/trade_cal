import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useTrades } from '../../context/TradeContext';
import { useJournal } from '../../context/JournalContext';
import 'react-quill/dist/quill.snow.css';

interface JournalNoteProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
  date: string;
}

const TEMPLATES = [
  {
    name: 'Daily Review',
    content: `# Daily Trading Review

Market Analysis:
- Overall market conditions:
- Key levels:
- Important news:

Trading Performance:
- What went well:
- What could be improved:
- Key lessons:

Plan for Tomorrow:
- Focus areas:
- Potential setups:
- Risk management adjustments:`
  },
  {
    name: 'Trade Analysis',
    content: `# Trade Analysis

Setup:
- Pattern identified:
- Entry trigger:
- Risk/reward ratio:

Execution:
- Entry timing:
- Stop placement:
- Exit strategy:

Post-Trade Review:
- What worked:
- What could be improved:
- Lessons learned:`
  },
  {
    name: 'Weekly Review',
    content: `# Weekly Trading Review

Performance Summary:
- Total P&L:
- Win rate:
- Best/worst trades:

Market Analysis:
- Major trends:
- Key levels:
- Sector performance:

Strategy Review:
- Most effective setups:
- Areas for improvement:
- Adjustments needed:

Next Week's Plan:
- Focus areas:
- Risk management:
- Goals:`
  }
];

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Journal Note</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Templates Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Templates</h3>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateInsert(template.content)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-200"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
                placeholder="Add a tag"
                className="flex-1 px-3 py-1 border rounded-md text-sm"
              />
              <button
                onClick={handleTagAdd}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Linked Trades Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Link Trades</h3>
            <div className="border rounded-lg max-h-40 overflow-y-auto">
              {trades.filter(trade => trade.date === date).map((trade) => (
                <div
                  key={trade.id}
                  className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
                    linkedTrades.includes(trade.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleTradeLink(trade.id)}
                >
                  <input
                    type="checkbox"
                    checked={linkedTrades.includes(trade.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-sm">
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
            className="h-[calc(100%-280px)]"
          />
        </div>
        
        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalNote;