import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  hasCompletedTutorial: boolean;
  setHasCompletedTutorial: (completed: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if user has completed tutorial in their metadata
          const { data, error } = await supabase
            .from('user_preferences')
            .select('has_completed_tutorial')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setHasCompletedTutorial(data.has_completed_tutorial);
            // Show tutorial if user hasn't completed it
            setShowTutorial(!data.has_completed_tutorial);
          } else {
            // If no preferences exist, create them and show tutorial
            await supabase
              .from('user_preferences')
              .insert([
                { 
                  user_id: user.id,
                  has_completed_tutorial: false
                }
              ]);
            setShowTutorial(true);
          }
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };

    checkTutorialStatus();
  }, []);

  const value = {
    showTutorial,
    setShowTutorial,
    hasCompletedTutorial,
    setHasCompletedTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
} 