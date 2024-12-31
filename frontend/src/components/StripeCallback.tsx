import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const StripeCallback = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleStripeCallback = async () => {
            console.log("Starting callback processing...");
            // Debug all URL parameters
            console.log("All URL parameters:", Object.fromEntries(searchParams.entries()));
            
            if (isProcessing || !user?.id) {
                console.log("No user or already processing", { isProcessing, userId: user?.id });
                return;
            }

            setIsProcessing(true);

            try {
                // Try to get subscription data from localStorage first
                let pendingSubscription;
                const pendingSubscriptionStr = localStorage.getItem('pendingSubscription');
                
                if (pendingSubscriptionStr) {
                    pendingSubscription = JSON.parse(pendingSubscriptionStr);
                    console.log("Found pending subscription in localStorage:", pendingSubscription);
                } else {
                    // If not in localStorage, try to get from URL params
                    const planName = searchParams.get('plan');
                    const interval = searchParams.get('interval');
                    
                    // Log all available parameters
                    console.log("Looking for plan and interval in URL params:", {
                        allParams: Object.fromEntries(searchParams.entries()),
                        planName,
                        interval
                    });
                    
                    if (!planName || !interval) {
                        console.error("No subscription data found in URL params");
                        throw new Error('No subscription data found');
                    }

                    pendingSubscription = {
                        planName,
                        interval
                    };
                    console.log("Using subscription data from URL:", pendingSubscription);
                }

                // Create subscription data matching exactly the Supabase schema
                const subscriptionData = {
                    id: crypto.randomUUID(),
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

                // Verify the subscription was actually created/updated
                const { data: verifySubscription, error: verifyError } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (verifyError || !verifySubscription) {
                    console.error("Failed to verify subscription:", verifyError);
                    throw new Error('Failed to verify subscription creation');
                }

                console.log("Subscription verified:", verifySubscription);
                localStorage.removeItem('pendingSubscription');
                localStorage.setItem('auth_in_prog', 'false');
                
                // Force a small delay to ensure database consistency
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                toast.success('Subscription activated successfully!');
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error processing subscription:', error);
                toast.error('Failed to process subscription. Please contact support.');
                // Don't redirect on error, let user stay on callback page
                setIsProcessing(false);
            }
        };

        handleStripeCallback();
    }, [navigate, user, isProcessing, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
                <p className="mt-4 text-purple-300">Processing your subscription...</p>
                {isProcessing && (
                    <p className="mt-2 text-sm text-purple-400">Please wait while we activate your subscription...</p>
                )}
            </div>
        </div>
    );
};

export default StripeCallback; 