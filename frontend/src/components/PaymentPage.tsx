import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handlePayment = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const origin = window.location.origin === 'http://localhost:5173' 
        ? 'http://localhost:5173' 
        : import.meta.env.VITE_SITE_URL;

      const successUrl = encodeURIComponent(`${origin}/stripe/callback`);
      const cancelUrl = encodeURIComponent(`${origin}/profile`);
      
      const stripeUrl = new URL(import.meta.env.VITE_STRIPE_URL);
      stripeUrl.searchParams.append('client_reference_id', user.id);
      stripeUrl.searchParams.append('success_url', successUrl);
      stripeUrl.searchParams.append('cancel_url', cancelUrl);
      stripeUrl.searchParams.append('price', import.meta.env.VITE_STRIPE_PROD_ID);
      
      console.log('Redirecting to Stripe:', stripeUrl.toString());
      window.location.href = stripeUrl.toString();
    };

    handlePayment();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to payment...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 