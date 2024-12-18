import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const StripeCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const handleStripeCallback = async () => {
            console.log('Starting Stripe callback handler');
            console.log('Current URL:', window.location.href);
            console.log('User:', user);

            // If already processing or no user, return
            if (isProcessing || !user?.id) {
                console.log('Waiting for user data...');
                return;
            }

            setIsProcessing(true);

            try {
                // Get the session ID from the URL
                const sessionId = searchParams.get('session_id');
                if (!sessionId) {
                    throw new Error('No session ID found');
                }

                // Verify the session with Stripe
                const response = await fetch('/api/verify-stripe-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to verify session');
                }

                const { customerId, subscriptionId } = await response.json();

                // Update subscription in Supabase
                const subscriptionData = {
                    user_id: user.id,
                    status: 'active',
                    plan_id: 'monthly',
                    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    cancel_at_period_end: false
                };

                console.log('Attempting to update subscription in Supabase:', subscriptionData);

                // First check if a subscription already exists
                const { data: existingSubscription, error: fetchError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                console.log('Existing subscription:', existingSubscription);
                if (fetchError) console.log('Fetch error:', fetchError);

                let result;
                if (existingSubscription) {
                    // Update existing subscription
                    result = await supabase
                        .from('subscriptions')
                        .update(subscriptionData)
                        .eq('user_id', user.id)
                        .select();
                    console.log('Update result:', result);
                } else {
                    // Insert new subscription
                    result = await supabase
                        .from('subscriptions')
                        .insert([subscriptionData])
                        .select();
                    console.log('Insert result:', result);
                }

                if (result.error) {
                    console.error('Supabase operation error:', result.error);
                    throw result.error;
                }

                console.log('Subscription updated successfully:', result.data);
                toast.success('Subscription activated successfully!');
                navigate('/profile');
            } catch (error) {
                console.error('Error processing Stripe callback:', error);
                toast.error('Failed to process subscription. Please contact support.');
                navigate('/profile');
            } finally {
                setIsProcessing(false);
            }
        };

        handleStripeCallback();
    }, [navigate, user, isProcessing, searchParams]);

    // If no user yet, show loading
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600">Processing your subscription...</p>
            </div>
        </div>
    );
};

export default StripeCallback; 