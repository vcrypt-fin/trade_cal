import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const server_url = "https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1";

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    event.preventDefault();
    // Handle normal login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold">Login</h1>
          {error && (
            <div className="w-full px-4 py-2 mb-4 text-sm text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
        </CardHeader>
        <Divider/>
        <CardBody className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              isRequired
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              isRequired
            />
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleOAuthLogin('google')}
              variant="bordered"
              startContent={<img src="/google-icon.svg" className="w-5 h-5" alt="Google" />}
              className="w-full"
              isLoading={loading}
            >
              Google
            </Button>
            
            <Button
              onClick={() => handleOAuthLogin('github')}
              variant="bordered"
              startContent={<img src="/github-icon.svg" className="w-5 h-5" alt="GitHub" />}
              className="w-full"
              isLoading={loading}
            >
              GitHub
            </Button>
            
            <Button
              onClick={() => handleOAuthLogin('apple')}
              variant="bordered"
              startContent={<img src="/apple-icon.svg" className="w-5 h-5" alt="Apple" />}
              className="w-full"
              isLoading={loading}
            >
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;