import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      if (!user) {
        console.log('No user found, skipping subscription fetch');
        setLoading(false);
        return;
      }

      console.log('Fetching subscription for user:', user.id);

      // Add proper headers for Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        if (error.code === 'PGRST116') {
          // No subscription found
          setSubscription(null);
        } else {
          throw error;
        }
      } else {
        console.log('Fetched subscription:', data);
        setSubscription(data);
      }
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('Profile component mounted/updated');
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = () => {
    console.log('Navigating to payment page');
    navigate('/payment');
  };

  const handleCancelSubscription = async () => {
    try {
      if (!subscription?.stripe_customer_id) {
        console.error('No stripe_customer_id found');
        return;
      }
      
      // Use Stripe's test portal URL
      const portalUrl = `https://billing.stripe.com/p/login/test_aEUcQ017E0bA0us4gg`;
      console.log('Redirecting to portal:', portalUrl);
      window.location.href = portalUrl;
    } catch (err) {
      console.error('Error opening subscription management:', err);
      toast.error('Failed to open subscription management');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading state while user authentication is pending
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading subscription details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {subscription ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">{subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Plan</p>
                      <p className="font-medium">{subscription.plan_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Period Ends</p>
                      <p className="font-medium">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Auto-Renewal</p>
                      <p className="font-medium">
                        {subscription.cancel_at_period_end ? 'Off' : 'On'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCancelSubscription}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have an active subscription
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-2">Monthly Plan</h3>
                      <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm text-gray-600">/month</span></p>
                      <ul className="text-left mb-4 space-y-2">
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
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 