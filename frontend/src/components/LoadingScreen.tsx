import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoadingScreen: React.FC = () => {
  const { setShowLoadingScreen } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [setShowLoadingScreen]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <img 
        src="/trademind.gif" 
        alt="Loading..." 
        className="max-w-3xl w-full"
      />
    </div>
  );
};

export default LoadingScreen; 