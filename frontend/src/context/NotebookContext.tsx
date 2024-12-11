import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { useAuth } from './AuthContext';

interface Note {
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
  created_at: string;
}

// Define default folders that should exist for every user
const DEFAULT_FOLDERS = [
  { name: 'Daily Journal' },
  { name: 'Sessions Recap' }
  // Removed 'All Notes' as it should be handled differently
];

interface NotebookContextType {
  notes: Note[];
  folders: NoteFolder[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addFolder: (name: string) => Promise<NoteFolder>;
  deleteFolder: (id: string) => Promise<void>;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const NotebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Initialize default folders for new users
  const initializeDefaultFolders = async () => {
    try {
      // First check if user already has folders
      const { data: existingFolders, error: fetchError } = await supabase
        .from('note_folders')
        .select('*')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      // Only insert default folders if user has NO folders
      if (existingFolders && existingFolders.length === 0) {
        const { error: insertError } = await supabase
          .from('note_folders')
          .insert(
            DEFAULT_FOLDERS.map(folder => ({
              name: folder.name,
              user_id: user?.id
            }))
          );

        if (insertError) throw insertError;
      }

      // Fetch folders again after potential insert
      const { data: finalFolders, error: finalFetchError } = await supabase
        .from('note_folders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (finalFetchError) throw finalFetchError;

      // Add virtual "All Notes" folder
      const allNotesFolder = {
        id: 'all',
        name: 'All Notes',
        created_at: new Date().toISOString()
      };

      setFolders([...(finalFolders || []), allNotesFolder]);

    } catch (error) {
      console.error('Error initializing default folders:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await initializeDefaultFolders();
          await fetchNotes();
        } catch (error) {
          console.error('Error loading notebook data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('note_folders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Add virtual "All Notes" folder at the end
      const allNotesFolder = {
        id: 'all',
        name: 'All Notes',
        created_at: new Date().toISOString()
      };
      
      setFolders([...(data || []), allNotesFolder]);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...note, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    setNotes(prev => [data, ...prev]);
    return data;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const { error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) throw error;
    await fetchNotes(); // Refresh notes after update
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) throw error;
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addFolder = async (name: string) => {
    const { data, error } = await supabase
      .from('note_folders')
      .insert([{ name, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    setFolders(prev => [...prev, data]);
    return data;
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase
      .from('note_folders')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) throw error;
    setFolders(prev => prev.filter(folder => folder.id !== id));
  };

  return (
    <NotebookContext.Provider value={{
      notes,
      folders,
      isLoading,
      addNote,
      updateNote,
      deleteNote,
      addFolder,
      deleteFolder,
    }}>
      {children}
    </NotebookContext.Provider>
  );
};

export const useNotebook = () => {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error('useNotebook must be used within a NotebookProvider');
  }
  return context;
};
