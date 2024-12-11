// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Notebook,
  BookMarked,
  BarChart2,
  Settings as SettingsIcon,
  LogOut,
  User,
  Key
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar } from "@nextui-org/react";

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/' },
  { icon: BookOpen, text: 'Daily Journal', path: '/journal' },
  { icon: TrendingUp, text: 'Trades', path: '/trades' },
  { icon: Notebook, text: 'Notebook', path: '/notebook' },
  { icon: BookMarked, text: 'Playbook', path: '/playbook' },
  { icon: BarChart2, text: 'Reports', path: '/reports' },
  { icon: SettingsIcon, text: 'Settings', path: '/settings' }
];

const cleanUsername = (user: SupabaseUser | null): string => {
  if (!user) return 'Loading...';
  
  // First try to get the username from metadata
  const username = user.user_metadata?.username || user.user_metadata?.name;
  
  if (username) {
    // Remove Discord discriminator (#1234) if present
    return username.split('#')[0];
  }
  
  // Fallback to email
  return user.email || 'Anonymous';
};

const getAvatarUrl = (user: SupabaseUser | null): string | null => {
  if (!user) return null;
  
  // Check various possible locations for avatar URL
  return user.user_metadata?.avatar_url || // OAuth providers usually store here
         user.user_metadata?.picture ||     // Some providers use 'picture'
         user.user_metadata?.profile_picture || // Custom uploads might be here
         null;
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');

  useEffect(() => {
    // Get initial user data
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem('authToken');
      localStorage.removeItem('auth_in_prog');
      
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!user?.email) throw new Error('No email found');

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setResetPasswordMessage('Check your email for the password reset link');
      setTimeout(() => setResetPasswordMessage(''), 5000); // Clear message after 5 seconds

    } catch (error) {
      console.error('Error resetting password:', error);
      setResetPasswordMessage('Failed to send reset password email');
      setTimeout(() => setResetPasswordMessage(''), 5000);
    }
  };

  return (
    <div className="w-64 bg-[#0B1A33] h-screen fixed left-0 text-white p-4">
      <div className="flex items-center mb-8 pl-0">
        <h1 className="text-2xl font-bold">Bluenotes</h1>
      </div>

      <Link
        to="/add-trade"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span>Add Trade
      </Link>

      <nav className="mb-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-white/10'
            } mb-1`}
          >
            <item.icon size={20} />
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="absolute bottom-20 left-4 right-4 border-t border-white/10 pt-4">
        <Link
          to="/profile"
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
            location.pathname === '/profile' ? 'bg-blue-600' : 'hover:bg-white/10'
          }`}
        >
          {getAvatarUrl(user) ? (
            <Avatar
              src={getAvatarUrl(user)!}
              size="sm"
              className="flex-shrink-0"
            />
          ) : (
            <User size={20} />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user?.email || 'Loading...'}</div>
            <div className="text-sm text-gray-400 truncate">
              {cleanUsername(user)}
            </div>
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/10 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
