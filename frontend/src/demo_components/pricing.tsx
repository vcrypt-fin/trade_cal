import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight } from 'lucide-react'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  // Function to toggle billing cycle
  const toggleBilling = () => {
    setIsAnnual(!isAnnual)
  }

  // Function to calculate annual price with a discount (e.g., 2 months free)
  const calculatePrice = (monthlyPrice) => {
    return isAnnual ? (monthlyPrice * 10).toFixed(2) : monthlyPrice.toFixed(2)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-purple-900/20 to-purple-700/20" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-100">
          Choose Your Plan
        </h2>

        {/* Billing Switch */}
        <div className="flex justify-center items-center mb-12">
          <span className="text-purple-300 mr-2">Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              value="" 
              className="sr-only peer" 
              checked={isAnnual} 
              onChange={toggleBilling}
            />
            <div className="w-11 h-6 bg-purple-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-800"></div>
          </label>
          <span className="text-purple-300 ml-2">Annual</span>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`bg-purple-900/20 border border-purple-700/50 shadow-lg ${
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
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-purple-200">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="space-y-4 mt-auto bottom-0">
                  <Button
                    size="lg"
                    className="bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20 flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const plans = [
  {
    name: "Basic",
    description: "Perfect for beginners",
    price: 1.99, // Monthly price
    features: [
      "Trade journaling",
      "Basic performance analytics",
      "Daily Journal",
    ]
  },
  {
    name: "Pro",
    description: "For serious traders",
    price: 5.99, // Monthly price
    featured: true,
    features: [
      "Everything in Basic",
      "AI-powered insights",
      "Unlimited trades"
    ]
  },
  {
    name: "Enterprise",
    description: "For trading firms",
    price: 199, // Monthly price
    features: [
      "Everything in Pro",
      "Multi-user support",
      "Custom integrations",
      "Dedicated account manager",
      "Priority support"
    ]
  }
]
