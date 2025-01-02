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

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    
    const loadData = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      
      try {
        // Fetch existing folders first
        const { data: existingFolders, error: fetchError } = await supabase
          .from('note_folders')
          .select('*')
          .eq('user_id', user.id);

        if (!isMounted) return;
        if (fetchError) throw fetchError;

        // Create a set of existing folder names for quick lookup
        const existingFolderNames = new Set((existingFolders || []).map(f => f.name));

        // Filter out default folders that already exist
        const foldersToCreate = DEFAULT_FOLDERS.filter(folder => 
          !existingFolderNames.has(folder.name)
        );

        // Only insert missing default folders
        if (foldersToCreate.length > 0) {
          const { error: insertError } = await supabase
            .from('note_folders')
            .insert(
              foldersToCreate.map(folder => ({
                name: folder.name,
                user_id: user.id
              }))
            );

          if (insertError) throw insertError;
        }

        // Fetch all data in parallel
        const [foldersResult, notesResult] = await Promise.all([
          supabase
            .from('note_folders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true }),
          supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
        ]);

        if (!isMounted) return;

        if (foldersResult.error) throw foldersResult.error;
        if (notesResult.error) throw notesResult.error;

        // Add virtual "All Notes" folder
        const allNotesFolder = {
          id: 'all',
          name: 'All Notes',
          created_at: new Date().toISOString()
        };

        setFolders([...(foldersResult.data || []), allNotesFolder]);
        setNotes(notesResult.data || []);
      } catch (error) {
        console.error('Error loading notebook data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only depend on user.id instead of the entire user object

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
    
    // Update notes state locally instead of fetching all notes
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updated_at: new Date().toISOString() }
          : note
      )
    );
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
    // Prevent deletion of virtual 'all' folder
    if (id === 'all') {
      console.warn('Cannot delete virtual "All Notes" folder');
      return;
    }

    try {
      // First delete all notes in the folder
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('folder_id', id)
        .eq('user_id', user?.id);

      if (notesError) throw notesError;

      // Then delete the folder
      const { error: folderError } = await supabase
        .from('note_folders')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (folderError) throw folderError;

      // Update both states locally
      setNotes(prev => prev.filter(note => note.folder_id !== id));
      setFolders(prev => prev.filter(folder => folder.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
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
