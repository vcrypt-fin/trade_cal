import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

const AuthHandler: React.FC = () => {
  const supabaseUrl: string | undefined = import.meta.env.VITE_REACT_APP_SB_URL;
  const supabaseKey: string | undefined = import.meta.env.VITE_REACT_APP_SB_KEY;
  let supabase: any = null;

  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }

  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase?.auth.session();
    setUser(session?.user || null);

    const authStateChange = supabase?.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    const subscription = authStateChange?.data;

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]); 

  useEffect(() => {
  
    if (!user && localStorage.getItem('auth_in_prog') == false.toString()) {
      navigate('/login');
    }
  }, [user, history]);

  const signIn = async () => {
    const { user, error } = await supabase.auth.signIn({ provider: 'github' });
    if (error) console.error('Error signing in:', error.message);
    else setUser(user);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    else setUser(null);
  };

  return (
    <div>
   
    </div>
  );
};

export default AuthHandler;
