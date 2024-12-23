import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { supabase } from '../../context/SupabaseClient'

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const navigate = useNavigate()

  // Function to toggle billing cycle
  const toggleBilling = () => {
    setIsAnnual(!isAnnual)
  }

  // Function to calculate annual price with a discount
  const calculatePrice = (monthlyPrice: number) => {
    return isAnnual ? (monthlyPrice * 10).toFixed(2) : monthlyPrice.toFixed(2)
  }

  const handleSubscribe = async (planName: string, price: number) => {
    try {
      setLoading(true)
      setSelectedPlan(planName)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please log in to subscribe')
        navigate('/auth')
        return
      }

      // Stripe checkout URLs based on plan and billing cycle
      const baseStripeUrl = 'https://buy.stripe.com/test_cN26rG2bEcWvgGkaEG'
      const successUrl = `${window.location.origin}/stripe/callback`
      const cancelUrl = `${window.location.origin}/subscription`

      // Construct the full URL with success and cancel parameters
      const checkoutUrl = `${baseStripeUrl}?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`

      if (!checkoutUrl) {
        throw new Error('Invalid plan selected')
      }

      // Store subscription details in localStorage for post-payment processing
      localStorage.setItem('pendingSubscription', JSON.stringify({
        userId: user.id,
        planName: planName,
        interval: isAnnual ? 'year' : 'month',
        price: price
      }))

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription process')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Choose Your Plan
          </h1>
          <p className="text-lg text-purple-300">
            Select the perfect plan for your trading journey. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Switch */}
        <div className="flex justify-center items-center mb-12">
          <span className="text-purple-300 mr-2">Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isAnnual} 
              onChange={toggleBilling}
            />
            <div className="w-11 h-6 bg-purple-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-800"></div>
          </label>
          <span className="text-purple-300 ml-2">Annual</span>
          {isAnnual && (
            <span className="ml-2 text-sm text-green-400">Save 20%</span>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-purple-900/20 border border-purple-700/50 shadow-lg transform transition-all duration-300 hover:scale-105 ${
                plan.featured ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-100">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-purple-300">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-100 mb-4">
                  ${calculatePrice(plan.price)}
                  <span className="text-lg font-normal text-purple-300">
                    {isAnnual ? '/year' : '/month'}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-purple-200">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
                  onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.price)}
                  disabled={loading && selectedPlan === plan.name.toLowerCase()}
                >
                  {loading && selectedPlan === plan.name.toLowerCase() ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-purple-300">
          <p className="mb-4">
            All plans include a 14-day money-back guarantee
          </p>
          <Button
            variant="link"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => navigate('/demo')}
          >
            Return to Demo
          </Button>
        </div>
      </div>
    </div>
  )
}

const plans = [
  {
    name: "Basic",
    description: "Perfect for beginners",
    price: 1.99,
    features: [
      "Trade journaling",
      "Basic performance analytics",
      "Daily Journal",
      "Email support",
      "Basic charts and analysis"
    ]
  },
  {
    name: "Pro",
    description: "For serious traders",
    price: 5.99,
    featured: true,
    features: [
      "Everything in Basic",
      "AI-powered insights",
      "Unlimited trades",
      "Priority support",
      "Advanced analytics",
      "Custom alerts",
      "Strategy backtesting"
    ]
  },
  {
    name: "Enterprise",
    description: "For trading firms",
    price: 199.00,
    features: [
      "Everything in Pro",
      "Multi-user support",
      "Custom integrations",
      "Dedicated account manager",
      "Priority support",
      "Custom features",
      "API access",
      "Team collaboration tools"
    ]
  }
] 