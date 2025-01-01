import React, { useState } from 'react';
import { Plus, Folder, Save, BookTemplate } from 'lucide-react';
import Sidebar from './Sidebar';
import CustomModal from './CustomModal';
import ReactQuill from 'react-quill';
import { useTrades } from '../context/TradeContext';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-dark.css';
import { useNotebook } from '../context/NotebookContext';
import { format } from 'date-fns';
import { cn } from '../utils/cn';
import { File, ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';

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

// Add custom Quill modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'code-block'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

// Add custom Quill formats
const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'code-block'
];

export default function Notebook() {
  const { notes, folders, isLoading, addNote, updateNote, deleteNote, addFolder, deleteFolder } = useNotebook();
  const { trades } = useTrades();
  const [selectedFolder, setSelectedFolder] = useState<NoteFolder | null>(null);
  const [selectedNote, setSelectedNote] = useState<LocalNote | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'folder' | 'note' | 'template' | null>(null);
  const [templates, setTemplates] = useState(initialTemplates);
  const [tagInput, setTagInput] = useState('');
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

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
        setSelectedNote({
          ...selectedNote,
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
        setSelectedNote({
          ...selectedNote,
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

  const handleDeleteFolder = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder and all its notes? This action cannot be undone.')) {
      try {
        await deleteFolder(folderId);
        if (selectedFolder?.id === folderId) {
          setSelectedFolder(null);
          setSelectedNote(null);
          setDraftContent('');
        }
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  if (isLoading) {
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
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div>
            <h1 className="text-2xl font-semibold text-purple-100">Notebook</h1>
          </div>

          <div className="flex gap-6">
            {/* Folders Panel */}
            <div className="w-80 bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-purple-100">Folders</h2>
                <button
                  onClick={handleAddFolder}
                  className="p-1 hover:bg-purple-800/20 rounded-lg transition-colors duration-300"
                  data-tour="add-folder"
                >
                  <Plus size={20} className="text-purple-400" />
                </button>
              </div>

              <div className="space-y-2" data-tour="folders-list">
                {folders.map(folder => (
                  <div key={folder.id} className="space-y-1">
                    <div 
                      className={cn(
                        "flex items-center group p-2 rounded-lg cursor-pointer",
                        selectedFolder?.id === folder.id ? "bg-purple-800/20" : "hover:bg-purple-800/10"
                      )}
                    >
                      <div
                        className="flex items-center flex-1"
                        onClick={() => handleFolderSelect(folder)}
                      >
                        <Folder size={16} className="text-purple-400 mr-2" />
                        <span className="text-purple-100 flex-1">{folder.name}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                          className="p-1 hover:bg-purple-800/20 rounded-lg"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    {selectedFolder?.id === folder.id && (
                      <div className="ml-6 space-y-1">
                        {notes
                          .filter(note => note.folder_id === folder.id)
                          .map(note => (
                            <div
                              key={note.id}
                              className={cn(
                                "flex items-center group py-1 px-2 rounded-lg cursor-pointer",
                                selectedNote?.id === note.id ? "bg-purple-800/20" : "hover:bg-purple-800/10"
                              )}
                              onClick={() => handleNoteSelect(note)}
                            >
                              <File size={14} className="text-purple-400 mr-2" />
                              <div className="flex-1">
                                <div className="text-purple-100">{note.title}</div>
                                <div className="text-xs text-purple-400">
                                  {formatDate(note.updated_at)}
                                </div>
                              </div>
                            </div>
                          ))}
                        <button
                          onClick={handleAddNote}
                          className="flex items-center text-purple-400 hover:text-purple-300 py-1 px-2"
                          data-tour="add-note"
                        >
                          <Plus size={14} className="mr-1" />
                          <span className="text-sm">Add Note</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Note Content Panel */}
            <div className="flex-1 bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              {selectedNote ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-purple-100">{selectedNote.title}</h2>
                      <p className="text-sm text-purple-400">
                        Last updated: {formatDate(selectedNote.updated_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNote}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        className="flex items-center gap-1 px-3 py-1 bg-[#2A1A4A] text-purple-100 rounded-md text-sm hover:bg-purple-800/20"
                      >
                        <BookTemplate size={16} />
                        Template
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    <ReactQuill
                      value={draftContent}
                      onChange={setDraftContent}
                      modules={quillModules}
                      formats={quillFormats}
                      theme="snow"
                      className="custom-quill"
                      placeholder="Start writing your note..."
                    />
                  </div>

                  {/* Tags Section */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-purple-100 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-800/20 text-purple-100 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-purple-800/30"
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
                        className="bg-[#2A1A4A] text-purple-100 px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleTagAdd}
                        className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Templates Section */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-purple-100 mb-2">Templates</h3>
                    <div className="flex gap-2">
                      {templates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleTemplateInsert(template.content)}
                          className="px-3 py-1 bg-[#2A1A4A] text-purple-100 rounded-md text-sm hover:bg-purple-800/20"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Linked Trades Section */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-purple-100 mb-2">Link to Trades</h3>
                    <div className="border border-purple-800/30 rounded-lg max-h-40 overflow-y-auto">
                      {trades.map((trade) => (
                        <div
                          key={trade.id}
                          className={cn(
                            "flex items-center p-2 cursor-pointer",
                            selectedTrades.includes(trade.id) ? "bg-purple-800/20" : "hover:bg-purple-800/10"
                          )}
                          onClick={() => handleTradeLink(trade.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTrades.includes(trade.id)}
                            onChange={() => {}}
                            className="mr-2 bg-[#2A1A4A] border-purple-800/30 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-purple-100">
                            {trade.date} - {trade.symbol} - ${trade.pnl.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-purple-400">
                  Select a note to view or edit
                </div>
              )}
            </div>
          </div>
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
  );
}