import React, { useState } from 'react';
import { Plus, Folder, Save, BookTemplate } from 'lucide-react';
import Sidebar from './Sidebar';
import CustomModal from './CustomModal';
import ReactQuill from 'react-quill';
import { useTrades } from '../context/TradeContext';
import 'react-quill/dist/quill.snow.css';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  linkedTrades?: string[];
  folderId: string;
}

interface NoteFolder {
  id: string;
  name: string;
}

const initialFolders: NoteFolder[] = [
  { id: 'daily', name: 'Daily Journal' },
  { id: 'recap', name: 'Sessions Recap' },
  { id: 'all', name: 'All Notes' },
];

const initialTemplates = [
  { name: 'Daily Game Plan', content: 'Market Overview\nTrading Plan\nRecap' },
  { name: 'Post-Trade Analysis', content: 'Entry and Exit Analysis\nLessons Learned' },
];

export default function Notebook() {
  const { trades } = useTrades();
  const [folders, setFolders] = useState<NoteFolder[]>(initialFolders);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<NoteFolder | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'folder' | 'note' | 'template' | null>(null);
  const [templates, setTemplates] = useState(initialTemplates);
  const [tagInput, setTagInput] = useState('');
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

  const filteredNotes = notes.filter(note => {
    if (!selectedFolder) return false;
    if (selectedFolder.id === 'all') {
      return true;
    }
    return note.folderId === selectedFolder.id;
  });

  const handleFolderSelect = (folder: NoteFolder) => {
    setSelectedFolder(folder);
    setSelectedNote(null);
    setDraftContent('');
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setDraftContent(note.content);
    setSelectedTrades(note.linkedTrades || []);
  };

  const handleAddFolder = () => {
    setModalType('folder');
    setIsModalOpen(true);
  };

  const handleAddNote = () => {
    if (!selectedFolder || selectedFolder.id === 'all') {
      alert('Please select a specific folder to add a note.');
      return;
    }
    setModalType('note');
    setIsModalOpen(true);
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      setNotes(prev => prev.filter(note => note.id !== selectedNote.id));
      setSelectedNote(null);
      setDraftContent('');
    }
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        content: draftContent,
        updatedAt: new Date().toLocaleDateString()
      };
      setSelectedNote(updatedNote);
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
    }
  };

  const handleSaveTemplate = () => {
    if (!draftContent) {
      alert('No content to save as template');
      return;
    }
    setModalType('template');
    setIsModalOpen(true);
  };

  const handleModalConfirm = (inputValue: string) => {
    if (modalType === 'folder') {
      const newFolder: NoteFolder = {
        id: inputValue.toLowerCase().replace(/\s+/g, '-'),
        name: inputValue,
      };
      setFolders(prev => [...prev, newFolder]);
    } else if (modalType === 'note' && selectedFolder) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: inputValue,
        content: '',
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
        tags: [],
        linkedTrades: [],
        folderId: selectedFolder.id
      };

      setNotes(prev => [...prev, newNote]);
      setSelectedNote(newNote);
      setDraftContent('');
    } else if (modalType === 'template') {
      const newTemplate = { name: inputValue, content: draftContent };
      setTemplates(prev => [...prev, newTemplate]);
    }

    setIsModalOpen(false);
    setModalType(null);
  };

  const handleTradeLink = (tradeId: string) => {
    if (selectedNote) {
      const updatedTrades = selectedTrades.includes(tradeId)
        ? selectedTrades.filter(id => id !== tradeId)
        : [...selectedTrades, tradeId];
      
      setSelectedTrades(updatedTrades);
      
      const updatedNote = {
        ...selectedNote,
        linkedTrades: updatedTrades
      };
      
      setSelectedNote(updatedNote);
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && selectedNote) {
      const updatedNote = {
        ...selectedNote,
        tags: [...selectedNote.tags, tagInput.trim()]
      };
      setSelectedNote(updatedNote);
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        tags: selectedNote.tags.filter(tag => tag !== tagToRemove)
      };
      setSelectedNote(updatedNote);
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
    }
  };

  const handleTemplateInsert = (templateContent: string) => {
    if (selectedNote) {
      setDraftContent(prev => `${prev}\n${templateContent}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex gap-6">
          {/* Folders Panel */}
          <div className="w-1/5 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Folders</h2>
              <button
                className="text-blue-600 hover:text-blue-700"
                onClick={handleAddFolder}
              >
                <Plus size={18} />
              </button>
            </div>
            <ul>
              {folders.map((folder) => (
                <li
                  key={folder.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 mb-3 ${
                    selectedFolder?.id === folder.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleFolderSelect(folder)}
                >
                  <Folder size={16} className="inline-block mr-2 text-gray-600" />
                  {folder.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Notes List Panel */}
          <div className="w-1/5 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notes</h2>
              <button
                className="text-blue-600 hover:text-blue-700"
                onClick={handleAddNote}
              >
                <Plus size={18} />
              </button>
            </div>
            <ul>
              {filteredNotes.map((note) => (
                <li
                  key={note.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 mb-3 ${
                    selectedNote?.id === note.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleNoteSelect(note)}
                >
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-xs text-gray-500">{note.updatedAt}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Note Editor Panel */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            {selectedNote ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                    <p className="text-sm text-gray-500">
                      Created: {selectedNote.createdAt} | Last updated: {selectedNote.updatedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      <Save size={16} />
                      Save Note
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    >
                      <BookTemplate size={16} />
                      Save Template
                    </button>
                    <button
                      onClick={handleDeleteNote}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <ReactQuill
                  value={draftContent}
                  onChange={setDraftContent}
                  className="h-64 mb-4"
                />

                {/* Tags Section */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedNote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs cursor-pointer"
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
                      onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                      placeholder="Add a tag"
                      className="border px-2 py-1 text-sm rounded-md"
                    />
                    <button
                      onClick={handleTagAdd}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Templates Section */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Templates</h3>
                  <div className="flex gap-2">
                    {templates.map((template, index) => (
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

                {/* Linked Trades Section */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Link to Trades</h3>
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {trades.map((trade) => (
                      <div
                        key={trade.id}
                        className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
                          selectedTrades.includes(trade.id) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleTradeLink(trade.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTrades.includes(trade.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {trade.date} - {trade.symbol} - {trade.side} - ${trade.pnl.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a note to view or edit</p>
            )}
          </div>
        </div>

        <CustomModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          title={
            modalType === 'folder'
              ? 'Add New Folder'
              : modalType === 'note'
              ? 'Add New Note'
              : 'Save as Template'
          }
          onConfirm={handleModalConfirm}
        />
      </div>
    </div>
  );
}