import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// https://your-site.com/github/callback?code=AUTHORIZATION_CODE
export const GitHubCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        console.log("GitHubCallback", hashParams);
        const token = hashParams.get('access_token');

        if (token) {
            localStorage.setItem('authToken', token);
            navigate('/');
        }
    }, []);

    return null;
};