import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from './SupabaseClient';
import LoadingScreen from '../components/LoadingScreen';
import { setCookie, deleteCookie } from '../utils/cookies';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  showLoadingScreen: boolean;
  setShowLoadingScreen: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  showLoadingScreen: false,
  setShowLoadingScreen: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setCookie('authToken', session.access_token);
      } else {
        deleteCookie('authToken');
      }
      setError(error);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !user) {
        setShowLoadingScreen(true);
      }
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setCookie('authToken', session.access_token);
      } else {
        deleteCookie('authToken');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, showLoadingScreen, setShowLoadingScreen }}>
      {showLoadingScreen && <LoadingScreen />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 