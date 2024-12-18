import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './SupabaseClient';

const PUBLIC_ROUTES = ['/login', '/register', '/github/callback', '/stripe/callback'];

const AuthHandler: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Don't redirect if auth is in progress
        if (localStorage.getItem('auth_in_prog') === 'true') {
          setIsLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.error('Auth error or no session:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('authToken'); // Clear any stale token
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
          return;
        }

        // Verify the token is still valid
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
          console.log('Session expired');
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session) {
        setIsAuthenticated(true);
        localStorage.setItem('authToken', session.access_token);
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (isLoading) {
    return null;
  }

  return null;
};

export default AuthHandler;
