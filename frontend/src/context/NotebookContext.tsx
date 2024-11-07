// // src/context/NotebookContext.tsx

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { Trade } from './TradeContext'; // Ensure TradeContext is properly exported

// interface Note {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   tags: string[];
//   linkedTrades?: string[];
//   folderId: string;
// }

// interface NoteFolder {
//   id: string;
//   name: string;
// }

// interface NotebookContextType {
//   folders: NoteFolder[];
//   notes: Note[];
//   addFolder: (folder: NoteFolder) => Promise<void>;
//   addNote: (note: Note) => Promise<void>;
//   updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
//   deleteNote: (id: string) => Promise<void>;
//   getFolderById: (id: string) => NoteFolder | undefined;
//   getNoteById: (id: string) => Note | undefined;
// }

// const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

// export function useNotebook() {
//   const context = useContext(NotebookContext);
//   if (!context) {
//     throw new Error('useNotebook must be used within a NotebookProvider');
//   }
//   return context;
// }

// export function NotebookProvider({ children }: { children: React.ReactNode }) {
//   const [folders, setFolders] = useState<NoteFolder[]>([]);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const SERVER_URL = `${window.location.origin}/api`; // Adjust as needed

//   // Utility function to retrieve token from cookies
//   const getTokenFromCookies = (): string | null => {
//     const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
//     if (match) return match[2];
//     return null;
//   };

//   // Fetch folders and notes from backend on mount
//   useEffect(() => {
//     const fetchNotebookData = async () => {
//       try {
//         const [foldersRes, notesRes] = await Promise.all([
//           axios.get<NoteFolder[]>(`${SERVER_URL}/folders`, {
//             headers: {
//               Authorization: `Bearer ${getTokenFromCookies()}`,
//             },
//           }),
//           axios.get<Note[]>(`${SERVER_URL}/notes`, {
//             headers: {
//               Authorization: `Bearer ${getTokenFromCookies()}`,
//             },
//           }),
//         ]);
//         setFolders(foldersRes.data);
//         setNotes(notesRes.data);
//         localStorage.setItem('noteFolders', JSON.stringify(foldersRes.data));
//         localStorage.setItem('notes', JSON.stringify(notesRes.data));
//       } catch (error) {
//         console.error('Error fetching notebook data:', error);
//         // Optionally, notify the user
//       }
//     };

//     fetchNotebookData();
//   }, [SERVER_URL]);

//   // Synchronize folders and notes to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('noteFolders', JSON.stringify(folders));
//   }, [folders]);

//   useEffect(() => {
//     localStorage.setItem('notes', JSON.stringify(notes));
//   }, [notes]);

//   // Add a new folder
//   const addFolder = async (folder: NoteFolder) => {
//     try {
//       const response = await axios.post<NoteFolder>(`${SERVER_URL}/folders`, folder, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${getTokenFromCookies()}`,
//         },
//       });
//       setFolders((prev) => [...prev, response.data]);
//     } catch (error) {
//       console.error('Error adding folder:', error);
//       // Optionally, notify the user
//     }
//   };

//   // Add a new note
//   const addNote = async (note: Note) => {
//     try {
//       const response = await axios.post<Note>(`${SERVER_URL}/notes`, note, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${getTokenFromCookies()}`,
//         },
//       });
//       setNotes((prev) => [...prev, response.data]);
//     } catch (error) {
//       console.error('Error adding note:', error);
//       // Optionally, notify the user
//     }
//   };

//   // Update an existing note
//   const updateNote = async (id: string, updates: Partial<Note>) => {
//     try {
//       const response = await axios.patch<Note>(`${SERVER_URL}/notes/${id}`, updates, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${getTokenFromCookies()}`,
//         },
//       });
//       setNotes((prev) =>
//         prev.map((note) => (note.id === id ? { ...note, ...response.data } : note))
//       );
//     } catch (error) {
//       console.error('Error updating note:', error);
//       // Optionally, notify the user
//     }
//   };

//   // Delete a note
//   const deleteNote = async (id: string) => {
//     try {
//       await axios.delete(`${SERVER_URL}/notes/${id}`, {
//         headers: {
//           Authorization: `Bearer ${getTokenFromCookies()}`,
//         },
//       });
//       setNotes((prev) => prev.filter((note) => note.id !== id));
//     } catch (error) {
//       console.error('Error deleting note:', error);
//       // Optionally, notify the user
//     }
//   };

//   // Get folder by ID
//   const getFolderById = (id: string) => {
//     return folders.find((folder) => folder.id === id);
//   };

//   // Get note by ID
//   const getNoteById = (id: string) => {
//     return notes.find((note) => note.id === id);
//   };

//   return (
//     <NotebookContext.Provider
//       value={{
//         folders,
//         notes,
//         addFolder,
//         addNote,
//         updateNote,
//         deleteNote,
//         getFolderById,
//         getNoteById,
//       }}
//     >
//       {children}
//     </NotebookContext.Provider>
//   );
// }
