import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const StripeCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const handleStripeCallback = async () => {
            console.log("Starting callback processing...");
            if (isProcessing || !user?.id) {
                console.log("No user or already processing");
                return;
            }

            setIsProcessing(true);

            try {
                const pendingSubscriptionStr = localStorage.getItem('pendingSubscription');
                if (!pendingSubscriptionStr) {
                    throw new Error('No pending subscription found');
                }

                const pendingSubscription = JSON.parse(pendingSubscriptionStr);
                console.log("Pending subscription:", pendingSubscription);

                // Create subscription data matching exactly the Supabase schema
                const subscriptionData = {
                    id: crypto.randomUUID(), // Generate a UUID for the subscription
                    user_id: user.id,
                    status: 'active',
                    plan_id: pendingSubscription.planName.toLowerCase(),
                    current_period_end: new Date(Date.now() + (pendingSubscription.interval === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000),
                    cancel_at_period_end: false,
                    stripe_customer_id: user.id,
                    created_at: new Date()
                };

                console.log("Attempting to insert subscription:", subscriptionData);

                // First, check if a subscription exists
                const { data: existingSub, error: fetchError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                let error;
                if (existingSub) {
                    // Update existing subscription
                    const { error: updateError } = await supabase
                        .from('subscriptions')
                        .update(subscriptionData)
                        .eq('user_id', user.id);
                    error = updateError;
                } else {
                    // Insert new subscription
                    const { error: insertError } = await supabase
                        .from('subscriptions')
                        .insert([subscriptionData]);
                    error = insertError;
                }

                if (error) {
                    console.error("Supabase error:", error);
                    throw error;
                }

                console.log("Subscription updated successfully");
                localStorage.removeItem('pendingSubscription');
                toast.success('Subscription activated successfully!');
                navigate('/');
            } catch (error) {
                console.error('Error processing subscription:', error);
                toast.error('Failed to process subscription. Please contact support.');
                navigate('/subscription');
            } finally {
                setIsProcessing(false);
            }
        };

        handleStripeCallback();
    }, [navigate, user, isProcessing]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
                <p className="mt-4 text-purple-300">Processing your subscription...</p>
            </div>
        </div>
    );
};

export default StripeCallback; 