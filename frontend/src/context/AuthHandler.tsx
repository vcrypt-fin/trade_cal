import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './SupabaseClient';

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

// Create context for auth token
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthTokenContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A] text-white py-20">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
      <p className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Verifying subscription...
      </p>
      <p className="text-lg text-purple-300">
        Please wait while we verify your subscription.
      </p>
    </div>
  </div>
);

export const AuthTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthTokenContext.Provider value={{ token, setToken }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

const AuthHandler: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState<boolean>(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthTokenContext);

  const clearAuth = () => {
    setToken(null);
    setIsAuthenticated(false);
    setHasActiveSubscription(null);
  };

  const checkSubscription = async (userId: string) => {
    // If we already know the subscription status, just return it
    if (hasActiveSubscription !== null) {
      return hasActiveSubscription;
    }

    try {
      setIsCheckingSubscription(true);
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        // .single()
        // .throwOnError();
        .maybeSingle(); // won't throw a 406 if zero rows

      console.log('Subscription check result:', { subscription, error });

      if (error) {
        // If there's an actual error (e.g. RLS, etc.), log it
        console.error('Error checking subscription:', error);
        return false;
      }

      // subscription === null means no row found
      const isActive = subscription && subscription.status === 'active';
      setHasActiveSubscription(isActive);
      return isActive;
    } catch (err) {
      console.error('Error checking subscription:', err);
      return false;
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  // Effect to handle cleanup when leaving subscription page
  useEffect(() => {
    const wasOnSubscriptionPage = location.pathname === '/subscription';
    
    return () => {
      // If you no longer want to forcibly sign out users upon leaving /subscription,
      // either remove this or adjust the logic carefully:
      if (
        wasOnSubscriptionPage &&
        !isAuthenticated &&
        !PUBLIC_ROUTES.includes(location.pathname)
      ) {
        clearAuth();
        supabase.auth.signOut();
      }
    };
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Don't check auth if we're on a public route
        if (PUBLIC_ROUTES.includes(location.pathname)) {
          setIsLoading(false);
          return;
        }

        // Handle OAuth redirect with hash fragment
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Detected OAuth redirect with hash fragment');
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            console.error('Failed to get session from hash:', error);
            clearAuth();
            navigate('/demo');
            return;
          }

          setToken(session.access_token);
          setIsAuthenticated(true);
          
          // Clear the hash without triggering a reload
          window.history.replaceState(null, '', window.location.pathname);
          
          // Check subscription after successful OAuth
          const hasSubscription = await checkSubscription(session.user.id);
          if (!hasSubscription) {
            console.log('No active subscription found after OAuth, redirecting to subscription page');
            navigate('/subscription');
          } else {
            console.log('Active subscription found after OAuth, redirecting to dashboard');
            navigate('/');
          }
          return;
        }

        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('Auth error or no session:', error);
          clearAuth();
          navigate('/demo');
          return;
        }

        // Verify the token is still valid
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
          console.log('Session expired');
          clearAuth();
          navigate('/demo');
          return;
        }

        // Always set isAuthenticated = true if there's a valid session
        setToken(session.access_token);
        setIsAuthenticated(true);

        // Now check subscription
        const hasSubscription = await checkSubscription(session.user.id);
        if (!hasSubscription) {
          console.log('No active subscription found, redirecting to subscription page');
          navigate('/subscription');
          return;
        }

      } catch (err) {
        console.error('Auth check failed:', err);
        clearAuth();
        navigate('/demo');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (session) {
        setToken(session.access_token);
        setIsAuthenticated(true);

        // Only check subscription if we’re actively authenticating
        if (localStorage.getItem('auth_in_prog') === 'true') {
          setIsCheckingSubscription(true);
          const hasSubscription = await checkSubscription(session.user.id);
          console.log('Subscription check completed:', hasSubscription);

          // Clear the auth in progress flag
          localStorage.setItem('auth_in_prog', 'false');

          if (!hasSubscription) {
            console.log('No active subscription found, redirecting to subscription page');
            navigate('/subscription');
          } else {
            console.log('Active subscription found, redirecting to dashboard');
            navigate('/');
          }
        }
      } else {
        // If there's no session, fully clear out and route to a public page
        clearAuth();
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/demo');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Show loading screen when checking auth or subscription status for protected routes
  if (
    (isLoading || isCheckingSubscription) &&
    !PUBLIC_ROUTES.includes(location.pathname)
  ) {
    return <LoadingScreen />;
  }

  return null;
};

export default AuthHandler;
