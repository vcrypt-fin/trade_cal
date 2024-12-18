import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from 'lucide-react'

export function Pricing() {
  return (
    <section className="py-20 bg-black" id="pricing">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-100">
          Choose Your Plan
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`bg-purple-900/20 border-purple-700/50 ${plan.featured ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-100">{plan.name}</CardTitle>
                <CardDescription className="text-purple-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-100 mb-4">
                  ${plan.price}<span className="text-lg font-normal text-purple-300">/month</span>
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
              <CardFooter>
                <Button className={`w-full ${plan.featured ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-800 hover:bg-purple-700'}`}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
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
      "Unlimited trades"
    ]
  },
  // {
    // name: "Enterprise",
    // description: "For trading firms",
    // price: 199,
    // features: [
      // "Everything in Pro",
      // "Multi-user support",
      // "Custom integrations",
      // "Dedicated account manager",
      // "Priority support"
    // ]
  // }
]

99

