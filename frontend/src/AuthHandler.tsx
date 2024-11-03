import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';

const AuthChecker: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const checkAuthToken = async () => {
      // Check if the auth token is in cookies
      let token = Cookies.get('auth_token');

      if (!token) {
        // If not authenticated, redirect to Auth0 login
        if (!isAuthenticated) {
          await loginWithRedirect();
        } else {
          // Get the token silently from Auth0 if authenticated
          token = await getAccessTokenSilently();

          // Store the token in cookies
          Cookies.set('auth_token', token, { secure: true, sameSite: 'strict' });
        }
      }
    };

    checkAuthToken();
  }, [isAuthenticated, loginWithRedirect, getAccessTokenSilently]);

  return <div>{isAuthenticated ? 'User authenticated' : 'Redirecting to Auth0...'}</div>;
};

export default AuthChecker;
