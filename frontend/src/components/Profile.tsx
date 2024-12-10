import React, { useState, useEffect } from 'react';
import { supabase } from '../context/SupabaseClient';
import { User } from '@supabase/supabase-js';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleResetPassword = async () => {
    try {
      setSending(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            {/* User Info Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            {/* Reset Password Section */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-medium mb-4">Password Reset</h2>
              <p className="text-gray-600 mb-4">
                Click below to receive a password reset link in your email.
              </p>
              <button
                onClick={handleResetPassword}
                disabled={sending}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sending ? 'Sending Email...' : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 