import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';

export const GitHubCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (session) {
                    localStorage.setItem('authToken', session.access_token);
                    localStorage.setItem('auth_in_prog', 'false');
                    navigate('/');
                }
            } catch (error) {
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate]);

    return null;
};