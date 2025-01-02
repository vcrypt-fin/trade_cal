import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SocialOptInModal } from '../components/SocialOptInModal';
import leaderboardService from '../services/leaderboardService';

// Define public routes
const PUBLIC_ROUTES = [
  '/login', 
  '/register', 
  '/github/callback', 
  '/stripe/callback', 
  '/demo', 
  '/watch-demo', 
  '/auth', 
  '/subscription',
  '/about',
  '/careers',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies'
];

interface SocialContextType {
  showSocialPrompt: boolean;
  setShowSocialPrompt: (show: boolean) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [showSocialPrompt, setShowSocialPrompt] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSocialStatus = async () => {
      try {
        // Only check social status on non-public routes
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          const hasSeenPrompt = await leaderboardService.checkSocialPromptStatus();
          if (!hasSeenPrompt) {
            setShowSocialPrompt(true);
          }
        }
      } catch (error) {
        console.error('Error checking social status:', error);
      } finally {
        setHasChecked(true);
      }
    };

    checkSocialStatus();
  }, [location.pathname]);

  const handleClose = () => {
    setShowSocialPrompt(false);
    leaderboardService.markSocialPromptAsSeen();
  };

  // Only show the modal on non-public routes
  const shouldShowModal = showSocialPrompt && !PUBLIC_ROUTES.includes(location.pathname);

  return (
    <SocialContext.Provider value={{ showSocialPrompt, setShowSocialPrompt }}>
      {hasChecked && children}
      <SocialOptInModal
        isOpen={shouldShowModal}
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