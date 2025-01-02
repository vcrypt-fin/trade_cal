import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';
import { getBaseUrl } from '../utils/environment';
import { setCookie } from '../utils/cookies';

export const GitHubCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the hash parameters from the URL
                const hash = window.location.hash;
                const params = new URLSearchParams(hash.replace('#', ''));
                const accessToken = params.get('access_token');

                console.log('Processing auth callback...');
                
                // Get the current session
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Session error:', error);
                    navigate('/login');
                    return;
                }

                if (session?.user) {
                    console.log('Auth successful:', {
                        userId: session.user.id,
                        email: session.user.email,
                        provider: session.user.app_metadata.provider
                    });

                    // Store the access token if present
                    if (accessToken) {
                        setCookie('authToken', accessToken);
                    } else if (session.access_token) {
                        setCookie('authToken', session.access_token);
                    }

                    // Clear the auth in progress flag
                    // localStorage.setItem('auth_in_prog', 'false');

                    // Get base URL from utility function
                    const redirectUrl = getBaseUrl();

                    console.log('Redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                } else {
                    console.error('No session found');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
}; 