import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize Supabase client
  const server_url = "https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1"

  const handleOAuthLogin = async (provider: string) => {
    localStorage.setItem('auth_in_prog', true.toString());
    try {
      const response = await axios.post(`${server_url}/auth`, { type: provider });
      if (response.status === 200) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to login');
        localStorage.setItem('auth_in_prog', false.toString());
      }
    } catch (error) {
      setError('Failed to login');
      localStorage.setItem('auth_in_prog', false.toString());
    }
  };

   const handleSubmit = async (event: React.FormEvent) => {
   //  Handle normla login
   };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

      </form>

      <button onClick={() => handleOAuthLogin('apple')} disabled={loading}>
        {loading ? 'Logging in with Apple...' : 'Login with Apple'}
      </button>
      <button onClick={() => handleOAuthLogin('google')} disabled={loading}>
        {loading ? 'Logging in with Google...' : 'Login with Google'}
      </button>
      <button onClick={() => handleOAuthLogin('github')} disabled={loading}>
        {loading ? 'Logging in with GitHub...' : 'Login with GitHub'}
      </button>


      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;