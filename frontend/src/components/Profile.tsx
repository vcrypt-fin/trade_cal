import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import { Loader2, Trophy, Users } from 'lucide-react';
import { SocialOptInModal } from './SocialOptInModal';
import leaderboardService from '../services/leaderboardService';

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string;
}

const FETCH_INTERVAL = 60000; // 1 minute in milliseconds

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearAllTrades } = useTrades();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialEnabled, setSocialEnabled] = useState(false);
  
  const lastFetchTime = useRef<number>(0);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSubscription = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < FETCH_INTERVAL && lastFetchTime.current !== 0) {
      return; // Skip if not enough time has passed
    }

    try {
      if (!user) {
        setLoading(false);
        return;
      }

      lastFetchTime.current = now;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setSubscription(null);
        } else {
          throw error;
        }
      } else {
        setSubscription(data);
      }
    } catch (err) {
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkSocialStatus = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < FETCH_INTERVAL && lastFetchTime.current !== 0) {
      return; // Skip if not enough time has passed
    }

    const isEnabled = await leaderboardService.checkSocialStatus();
    setSocialEnabled(isEnabled);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchSubscription();
    checkSocialStatus();

    // Setup interval for subsequent fetches
    const intervalId = setInterval(() => {
      fetchSubscription();
      checkSocialStatus();
    }, FETCH_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchSubscription, checkSocialStatus]);

  const handleSubscribe = () => {
    console.log('Navigating to subscription page');
    navigate('/subscription');
  };

  const handleCancelSubscription = async () => {
    try {
      if (!subscription?.stripe_customer_id) {
        console.error('No stripe_customer_id found');
        return;
      }
      
      const portalUrl = `https://billing.stripe.com/p/login/test_aEUcQ017E0bA0us4gg`;
      console.log('Redirecting to portal:', portalUrl);
      window.location.href = portalUrl;
    } catch (err) {
      console.error('Error opening subscription management:', err);
      toast.error('Failed to open subscription management');
    }
  };

  const handleClearData = async () => {
    if (!user) return;

    try {
      // Delete all trades for this user
      const { error: tradesError } = await supabase
        .from('trades')
        .delete()
        .eq('userId', user.id);

      if (tradesError) throw tradesError;

      // Delete all notes for this user
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('user_id', user.id);

      if (notesError) throw notesError;

      // Delete all playbooks for this user
      const { error: playbooksError } = await supabase
        .from('playbooks')
        .delete()
        .eq('userId', user.id);

      if (playbooksError) throw playbooksError;

      // Clear trades context
      clearAllTrades();
      
      // Clear localStorage except for Supabase session
      for (let key of Object.keys(localStorage)) {
        if (!key.startsWith('supabase.auth.token')) {
          localStorage.removeItem(key);
        }
      }

      setShowConfirmation(false);
      toast.success('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleResetPassword = async () => {
    try {
      if (!user?.email) {
        toast.error('No email found');
        return;
      }

      setIsResettingPassword(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast.success('Password reset link sent to your email');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsResettingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-purple-100">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-purple-100">Loading subscription details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] flex">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className={`flex-1 transition-all duration-300 pt-12 ${isCollapsed ? 'ml-[60px]' : 'ml-[280px]'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Subscription Section */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-100">Subscription Management</h2>
            
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-6 border border-red-800/30">
                {error}
              </div>
            )}

            {subscription ? (
              <div className="space-y-4">
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
                  <h3 className="text-lg font-semibold mb-2 text-purple-100">Current Plan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-300">Status</p>
                      <p className="font-medium text-purple-100">{subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-purple-300">Plan</p>
                      <p className="font-medium text-purple-100">{subscription.plan_id}</p>
                    </div>
                    <div>
                      <p className="text-purple-300">Current Period Ends</p>
                      <p className="font-medium text-purple-100">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-300">Auto-Renewal</p>
                      <p className="font-medium text-purple-100">
                        {subscription.cancel_at_period_end ? 'Off' : 'On'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCancelSubscription}
                    className="mt-4 px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-purple-300 mb-4">
                    You don't have an active subscription
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="border border-purple-800/30 rounded-lg p-6 bg-purple-900/20">
                      <h3 className="text-xl font-semibold mb-2 text-purple-100">Monthly Plan</h3>
                      <p className="text-3xl font-bold mb-4 text-purple-100">$9.99<span className="text-sm text-purple-300">/month</span></p>
                      <ul className="text-left mb-4 space-y-2 text-purple-200">
                        <li className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          Unlimited Trade Tracking
                        </li>
                        <li className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          Advanced Analytics
                        </li>
                        <li className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          Trading Journal
                        </li>
                      </ul>
                      <button
                        onClick={handleSubscribe}
                        className="w-full px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Features Section */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Social Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Trophy className="text-purple-500 mt-1" size={20} />
                <div>
                  <h3 className="text-gray-200 font-medium">Leaderboard & Social Trading</h3>
                  <p className="text-purple-300 text-sm mb-4">
                    {socialEnabled 
                      ? "Your trading stats are currently visible on the leaderboard. You can disable this at any time."
                      : "Enable social features to compete on the leaderboard and connect with other traders."}
                  </p>
                  <button
                    onClick={() => setShowSocialModal(true)}
                    className={`px-4 py-2 ${
                      socialEnabled 
                        ? 'bg-red-600/80 hover:bg-red-700/80' 
                        : 'bg-purple-600/80 hover:bg-purple-700/80'
                    } text-white rounded-lg transition-colors inline-flex items-center gap-2`}
                  >
                    <Users size={16} />
                    {'Manage Social Features'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Data Management</h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors mr-4"
                >
                  Clear All Data
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors inline-flex items-center"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
                <p className="mt-2 text-sm text-purple-300">
                  Manage your account data and security settings. Password reset link will be sent to your email.
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Support</h2>
            <div>
              <a
                href="mailto:eclinick@vcryptfinancial.com?subject=Bug%20Report&body=Please%20describe%20the%20issue%20you're%20experiencing:"
                className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors inline-block"
              >
                Report a Bug
              </a>
              <p className="mt-2 text-sm text-purple-300">
                Encountered a bug? Send us an email with the details.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#120322] rounded-lg border border-purple-800/30 p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-purple-100">Confirm Clear Data</h3>
              <p className="text-purple-200 mb-6">
                Are you sure you want to clear all data? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-purple-800/30 rounded-lg text-purple-200 hover:bg-purple-900/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#120322] rounded-lg border border-purple-800/30 p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-purple-100">Update Password</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 bg-purple-900/20 border border-purple-800/30 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-purple-100"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 bg-purple-900/20 border border-purple-800/30 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-purple-100"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 border border-purple-800/30 rounded-lg text-purple-200 hover:bg-purple-900/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors flex items-center"
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Social Opt-In Modal */}
        <SocialOptInModal
          isOpen={showSocialModal}
          onClose={() => {
            setShowSocialModal(false);
            checkSocialStatus(); // Refresh social status after modal closes
          }}
        />
      </div>
    </div>
  );
};

export default Profile; 