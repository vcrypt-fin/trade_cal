import React, { useState } from 'react';
import { Plus, Folder, Save, BookTemplate } from 'lucide-react';
import Sidebar from './Sidebar';
import CustomModal from './CustomModal';
import ReactQuill from 'react-quill';
import { useTrades } from '../context/TradeContext';
import 'react-quill/dist/quill.snow.css';
import { useNotebook } from '../context/NotebookContext';
import { format } from 'date-fns';

interface LocalNote {
  id: string;
  title: string;
  content: string;
  folder_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  linked_trades?: string[];
}

interface NoteFolder {
  id: string;
  name: string;
}

const initialTemplates = [
  { name: 'Daily Game Plan', content: 'Market Overview\nTrading Plan\nRecap' },
  { name: 'Post-Trade Analysis', content: 'Entry and Exit Analysis\nLessons Learned' },
];

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d @ h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export default function Notebook() {
  const { notes, folders, isLoading, addNote, updateNote, deleteNote, addFolder } = useNotebook();
  const { trades } = useTrades();
  const [selectedFolder, setSelectedFolder] = useState<NoteFolder | null>(null);
  const [selectedNote, setSelectedNote] = useState<LocalNote | null>(null);
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
    return note.folder_id === selectedFolder.id;
  });

  const handleFolderSelect = (folder: NoteFolder) => {
    setSelectedFolder(folder);
    setSelectedNote(null);
    setDraftContent('');
  };

  const handleNoteSelect = (note: LocalNote) => {
    setSelectedNote(note);
    setDraftContent(note.content);
    setSelectedTrades(note.linked_trades || []);
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

  const handleDeleteNote = async () => {
    if (selectedNote) {
      try {
        await deleteNote(selectedNote.id);
        setSelectedNote(null);
        setDraftContent('');
      } catch (error) {
        console.error('Error deleting note:', error);
        // Add appropriate error handling/user feedback
      }
    }
  };

  const handleSaveNote = async () => {
    if (selectedNote) {
      try {
        await updateNote(selectedNote.id, {
          content: draftContent,
          tags: selectedNote.tags,
          linked_trades: selectedTrades
        });
      } catch (error) {
        console.error('Error saving note:', error);
        // Add appropriate error handling/user feedback
      }
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

  const handleModalConfirm = async (inputValue: string) => {
    try {
      if (modalType === 'folder') {
        await addFolder(inputValue);
      } else if (modalType === 'note' && selectedFolder) {
        const newNote = await addNote({
          title: inputValue,
          content: '',
          folder_id: selectedFolder.id,
          tags: [],
          linked_trades: []
        });
        setSelectedNote(newNote);
        setDraftContent('');
      } else if (modalType === 'template') {
        const newTemplate = { name: inputValue, content: draftContent };
        setTemplates(prev => [...prev, newTemplate]);
      }
    } catch (error) {
      console.error('Error handling modal confirm:', error);
      // Add appropriate error handling/user feedback
    }

    setIsModalOpen(false);
    setModalType(null);
  };

  const handleTradeLink = async (tradeId: string) => {
    if (selectedNote) {
      const updatedTrades = selectedTrades.includes(tradeId)
        ? selectedTrades.filter(id => id !== tradeId)
        : [...selectedTrades, tradeId];
      
      setSelectedTrades(updatedTrades);
      
      try {
        await updateNote(selectedNote.id, {
          linked_trades: updatedTrades
        });
      } catch (error) {
        console.error('Error updating note trades:', error);
      }
    }
  };

  const handleTagAdd = async () => {
    if (tagInput.trim() && selectedNote) {
      const updatedTags = [...selectedNote.tags, tagInput.trim()];
      try {
        await updateNote(selectedNote.id, {
          tags: updatedTags
        });
        setTagInput('');
      } catch (error) {
        console.error('Error updating note tags:', error);
      }
    }
  };

  const handleTagRemove = async (tagToRemove: string) => {
    if (selectedNote) {
      const updatedTags = selectedNote.tags.filter(tag => tag !== tagToRemove);
      try {
        await updateNote(selectedNote.id, {
          tags: updatedTags
        });
      } catch (error) {
        console.error('Error removing tag:', error);
      }
    }
  };

  const handleTemplateInsert = (templateContent: string) => {
    if (selectedNote) {
      setDraftContent(prev => `${prev}\n${templateContent}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

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
                  <p className="text-xs text-gray-500">
                    {formatDate(note.updated_at)}
                  </p>
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
                      Created: {formatDate(selectedNote.created_at)} | 
                      Last updated: {formatDate(selectedNote.updated_at)}
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