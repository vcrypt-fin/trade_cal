'use client'

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, TrendingUp, BarChart2, CandlestickChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../context/SupabaseClient';
import { Provider } from '@supabase/supabase-js';
import { toast, Toaster } from 'react-hot-toast'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const checkSubscription = async (userId: string) => {
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking subscription:', error);
        return false;
      }

      return subscription && subscription.status === 'active';
    } catch (err) {
      console.error('Error checking subscription:', err);
      return false;
    }
  };

  const getCallbackUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}`;
  };

  const handleOAuthLogin = async (provider: Provider) => {
    try {
      setLoading(true);
      localStorage.setItem('auth_in_prog', 'true');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: getCallbackUrl(),
        },
      });

      if (error) {
        console.error("Auth error:", error);
        setError(error.message);
        localStorage.setItem('auth_in_prog', 'false');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to get authentication URL');
        localStorage.setItem('auth_in_prog', 'false');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred');
      localStorage.setItem('auth_in_prog', 'false');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');

      if (!isLogin) {
        // Sign up logic
        if (!name || !email || !password || !confirmPassword) {
          setError('Please fill in all fields');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          setError(error.message);
          return;
        }

        if (data?.user) {
          toast.success('Account created successfully! Please check your email for verification.');
          // After successful signup, redirect to subscription page
          navigate('/subscription');
        }
      } else {
        // Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Login error:', error);
          setError(error.message);
          return;
        }

        if (data?.session) {
          // Remove manual token storage
          // Check subscription status
          const hasSubscription = await checkSubscription(data.session.user.id);
          
          if (!hasSubscription) {
            // If no active subscription, redirect to subscription page
            navigate('/subscription');
          } else {
            // If has active subscription, redirect to dashboard
            navigate('/');
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Improved background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 opacity-50" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

        {/* Animated chart lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g className="opacity-20">
            <motion.path
              d="M0 400 Q200 350, 400 400 T800 350"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M0 450 Q200 400, 400 450 T800 400"
              fill="none"
              stroke="url(#grad2)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </g>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-purple-300 opacity-20 animate-float">
          <TrendingUp size={100} />
        </div>
        <div className="absolute bottom-10 right-10 text-pink-300 opacity-20 animate-float animation-delay-2000">
          <BarChart2 size={100} />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          >
            <CandlestickChart size={400} />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-xl rounded-lg shadow-xl p-8 border border-purple-500/30">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-300 hover:text-white hover:bg-purple-900"
              onClick={() => navigate('/demo')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              TradeMind
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-center text-purple-100">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-purple-300 text-center mb-8">
            {isLogin
              ? "Ready to trade? Let's get started!"
              : 'Join the trading revolution today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-200">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="bg-gray-700 bg-opacity-70 border-purple-600 text-purple-100 placeholder-purple-400 focus:border-pink-500 focus:ring-pink-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-gray-700 bg-opacity-70 border-purple-600 text-purple-100 placeholder-purple-400 focus:border-pink-500 focus:ring-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-gray-700 bg-opacity-70 border-purple-600 text-purple-100 placeholder-purple-400 focus:border-pink-500 focus:ring-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-700 bg-opacity-70 border-purple-600 text-purple-100 placeholder-purple-400 focus:border-pink-500 focus:ring-pink-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-purple-300 select-none"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  variant="link"
                  className="text-pink-400 hover:text-pink-300 p-0 text-sm"
                >
                  Forgot Password?
                </Button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded transition-colors duration-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Sign Up')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 bg-opacity-80 text-purple-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="bg-gray-700 bg-opacity-50 border-purple-600 text-purple-200 hover:bg-purple-800"
                onClick={() => handleOAuthLogin('discord')}
                disabled={loading}
              >
                <img src="/discord-icon.svg" alt="Discord" className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 bg-opacity-50 border-purple-600 text-purple-200 hover:bg-purple-800"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="bg-gray-700 bg-opacity-50 border-purple-600 text-purple-200 hover:bg-purple-800"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
              >
                <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center text-sm text-purple-300">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                type="button"
                variant="link"
                className="text-pink-400 hover:text-pink-300 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                  setName('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </Button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </motion.div>
      <Toaster position="top-center" />
    </div>
  )
}

