import React, { createContext, useContext, useEffect, useState } from 'react';
import { SocialOptInModal } from '../components/SocialOptInModal';
import leaderboardService from '../services/leaderboardService';

interface SocialContextType {
  showSocialPrompt: boolean;
  setShowSocialPrompt: (show: boolean) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSocialPrompt, setShowSocialPrompt] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSocialStatus = async () => {
      try {
        const hasSeenPrompt = await leaderboardService.checkSocialPromptStatus();
        if (!hasSeenPrompt) {
          setShowSocialPrompt(true);
        }
      } catch (error) {
        console.error('Error checking social status:', error);
      } finally {
        setHasChecked(true);
      }
    };

    checkSocialStatus();
  }, []);

  const handleClose = () => {
    setShowSocialPrompt(false);
    leaderboardService.markSocialPromptAsSeen();
  };

  return (
    <SocialContext.Provider value={{ showSocialPrompt, setShowSocialPrompt }}>
      {hasChecked && children}
      <SocialOptInModal
        isOpen={showSocialPrompt}
        onClose={handleClose}
      />
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}; 