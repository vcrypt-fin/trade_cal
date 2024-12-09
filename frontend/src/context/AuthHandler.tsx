import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

const AuthHandler: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken') && localStorage.getItem('auth_in_prog') == false.toString()) {
      navigate('/login');
    }
  }, [user]);

  return (
    <div>
   
    </div>
  );
};

export default AuthHandler;
