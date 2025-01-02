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
  ChevronLeft
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar } from "@nextui-org/react";
import { cn } from '../utils/cn';
import { deleteCookie } from '../utils/cookies';

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/', tourId: 'dashboard' },
  { icon: BookOpen, text: 'Daily Journal', path: '/journal', tourId: 'daily-journal' },
  { icon: TrendingUp, text: 'Trades', path: '/trades', tourId: 'trades' },
  { icon: Notebook, text: 'Notebook', path: '/notebook', tourId: 'notebook' },
  { icon: BookMarked, text: 'Playbook', path: '/playbook', tourId: 'playbook' },
  { icon: BarChart2, text: 'Reports', path: '/reports', tourId: 'reports' }
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

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
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
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error.message);
        return;
    }
    deleteCookie('authToken');
    // localStorage.removeItem('authToken');
    localStorage.removeItem('auth_in_prog');
    navigate('/demo');
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
    <div className={cn(
      'flex flex-col text-white transition-all duration-300 fixed top-0 bottom-0 left-0 z-20',
      'bg-gradient-to-b from-[#0D0019] via-[#1E002F] via-[#230037] via-[#2A0043] to-[#450050]',
      isCollapsed ? 'w-[60px]' : 'w-[280px]',
      isCollapsed && 'border-r border-purple-800/30'
    )}>
      <div className="flex h-30 items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TradeMind Logo" className="h-8" />
          {!isCollapsed && (
            <h1 className="text-2xl font-extrabold tracking-wider text-white-600 text-shadow-logo">
              TRADEMIND
            </h1>
          )}
        </div>
        <button
          onClick={onToggle}
          className="rounded-lg p-1 hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', 
            isCollapsed && 'rotate-180'
          )} />
        </button>
      </div>

      {!isCollapsed && (
        <Link
          to="/add-trade"
          className="mx-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2"
          data-tour="add-trade"
        >
          <span className="text-lg">+</span>Add Trade
        </Link>
      )}

      <nav className="flex-1 px-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1',
              location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10',
              isCollapsed && 'justify-center'
            )}
            data-tour={item.tourId}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Profile Section */}
        <Link
          to="/profile"
          className={cn(
            'flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer',
            location.pathname === '/profile' ? 'bg-white/20' : 'hover:bg-white/10',
            isCollapsed && 'justify-center'
          )}
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
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user?.email || 'Loading...'}</div>
              <div className="text-sm text-gray-400 truncate">
                {cleanUsername(user)}
              </div>
            </div>
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 rounded-lg cursor-pointer hover:bg-white/10 text-red-400 hover:text-red-300 mb-2 mt-2',
            isCollapsed ? 'justify-center pl-5' : 'mx-2 p-3'
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}
