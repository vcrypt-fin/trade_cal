'use client'

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Check, ArrowLeft } from 'lucide-react'

const planPrices = {
  basic: { monthly: 1.99, yearly: 19.90 },
  pro: { monthly: 5.99, yearly: 59.90 },
  enterprise: { monthly: 199.00, yearly: 1990.00 }
}

export default function PaymentPage() {
  const location = useLocation()
  const [plan, setPlan] = useState<string | null>(null)
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [step, setStep] = useState('plan')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const planParam = searchParams.get('plan')
    const cycleParam = searchParams.get('cycle') as 'monthly' | 'yearly'
    
    if (planParam && Object.keys(planPrices).includes(planParam)) {
      setPlan(planParam)
      setStep('payment') // Automatically go to payment step
    }
    
    if (cycleParam && ['monthly', 'yearly'].includes(cycleParam)) {
      setCycle(cycleParam)
    }
  }, [location])

  const price = plan ? planPrices[plan as keyof typeof planPrices][cycle] : 0

  const handlePlanChange = (selectedPlan: string) => {
    setPlan(selectedPlan)
  }

  const handleCycleChange = (selectedCycle: 'monthly' | 'yearly') => {
    setCycle(selectedCycle)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <a href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </a>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</span> Subscription
        </h1>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium">
            <span className={step === 'plan' ? 'text-purple-400' : 'text-gray-400'}>Plan</span>
            <span className={step === 'payment' ? 'text-purple-400' : 'text-gray-400'}>Payment</span>
            <span className={step === 'confirmation' ? 'text-purple-400' : 'text-gray-400'}>Confirmation</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-purple-400 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: step === 'plan' ? '33%' : step === 'payment' ? '66%' : '100%' }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div>
            {step === 'plan' && (
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle>Choose Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={plan || ''} onValueChange={handlePlanChange}>
                    {Object.entries(planPrices).map(([planName, prices]) => (
                      <div key={planName} className="flex items-center space-x-2">
                        <RadioGroupItem value={planName} id={planName} />
                        <Label htmlFor={planName} className="flex justify-between w-full">
                          <span className="capitalize">{planName}</span>
                          <span>${prices[cycle].toFixed(2)} / {cycle}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={cycle === 'monthly' ? 'default' : 'outline'}
                      onClick={() => handleCycleChange('monthly')}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={cycle === 'yearly' ? 'default' : 'outline'}
                      onClick={() => handleCycleChange('yearly')}
                    >
                      Yearly
                    </Button>
                  </div>
                  <Button onClick={() => setStep('payment')} className="w-full" disabled={!plan}>
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" className="bg-[#2A2A2A] border-purple-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiration">Expiration Date</Label>
                      <Input id="expiration" placeholder="MM/YY" className="bg-[#2A2A2A] border-purple-600" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" className="bg-[#2A2A2A] border-purple-600" />
                    </div>
                  </div>
                  <Button onClick={() => setStep('confirmation')} className="w-full">
                    Complete Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'confirmation' && (
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle>Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center text-green-500">
                    <Check className="w-16 h-16" />
                  </div>
                  <p className="text-center text-lg">
                    Thank you for your purchase! Your subscription to TradeMind {plan} plan has been confirmed.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/">
                      Return to Home
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right side - Order summary */}
          <Card className="bg-[#1A1A1A] border-purple-700">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-semibold capitalize">{plan || 'Not selected'} ({cycle})</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-semibold">${price.toFixed(2)}</span>
              </div>
              {cycle === 'yearly' && plan && (
                <div className="flex justify-between text-green-500">
                  <span>Savings:</span>
                  <span className="font-semibold">
                    {Math.round((1 - (price / (planPrices[plan as keyof typeof planPrices].monthly * 12))) * 100)}% off
                  </span>
                </div>
              )}
              <hr className="border-purple-700" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${price.toFixed(2)}</span>
              </div>
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What's included:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access to TradeMind {plan || 'selected'} features</li>
                  <li>{cycle === 'yearly' ? 'Annual' : 'Monthly'} billing</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

