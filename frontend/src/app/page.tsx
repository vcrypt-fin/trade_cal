import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight, BarChart2, Book, PieChart, Calendar, DollarSign, Shield, FileText, BookOpen, TrendingUp, ChevronUp, ChevronDown, Zap, Users, Lock, Sparkles, X, Bell, Star, HelpCircle, Menu, Play, ArrowUpRight, Activity, PlusCircle, Filter } from 'lucide-react'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// Remove this line
// import { Showcase } from "@/components/showcase/Showcase"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Table, BarChart, Settings, PlayIcon, BookOpenIcon, Presentation, GraduationCap } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { motion } from "framer-motion"
import { TradingBackground } from '@/components/LandingPage/trading-background'
import { useNavigate } from 'react-router-dom'

const features = [
  { name: "Notebook", icon: Table },
  { name: "Reporting", icon: BarChart },
  { name: "Backtesting", icon: Settings },
  { name: "Replay", icon: PlayIcon },
  { name: "Playbook", icon: BookOpenIcon },
  { name: "Mentoring", icon: Presentation },
  { name: "Education", icon: GraduationCap },
]


function Showcase() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12" id="showcase">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          TradeMind in Action
        </motion.h2>
        
        <motion.div 
          className="relative aspect-video rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <iframe
            src="https://www.youtube.com/embed/ps--Onn3p_s"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        <p className="text-center text-gray-300 mt-6">
          Watch how TradeMind can revolutionize your trading experience
        </p>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const navigate = useNavigate()
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  return (
    <div className="min-h-screen relative">
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A] text-white">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</div>
              <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">BETA</span>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#home" className="hover:text-purple-400 transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                {/* <li><a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a></li> */}
                <li><a href="#faq" className="hover:text-purple-400 transition-colors">FAQs</a></li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate('/auth')}
              >
                Sign Up
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    <ul className="space-y-4">
                      <li><a href="#home" className="block py-2 hover:text-purple-400 transition-colors">Home</a></li>
                      <li><a href="#features" className="block py-2 hover:text-purple-400 transition-colors">Features</a></li>
                      <li><a href="#pricing" className="block py-2 hover:text-purple-400 transition-colors">Pricing</a></li>
                      {/* <li><a href="#testimonials" className="block py-2 hover:text-purple-400 transition-colors">Testimonials</a></li> */}
                      <li><a href="#faq" className="block py-2 hover:text-purple-400 transition-colors">FAQs</a></li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-16 relative overflow-hidden min-h-[400px] lg:min-h-[600px]" id="home">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Image positioned behind content */}
          <div className="absolute inset-0 lg:inset-auto lg:right-0 lg:top-0 mt-12 lg:mt-0 z-0">
            <img
              src="/landing-hero.png"
              alt="TradeMind Platform Interface"
              className="w-full h-auto lg:max-w-none lg:w-[800px] rounded-2xl opacity-90"
            />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center">
            <div className="flex-1 space-y-6 lg:max-w-[45%] pt-8 lg:pt-0">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Elevate Your Trading with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Harness the power of AI-driven insights, advanced analytics, and a comprehensive trading journal to make smarter decisions and boost your trading performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-6 rounded-full text-lg shadow-lg transition-all duration-300"
                  onClick={() => navigate('/watch-demo')}
                >
                  Watch Demo
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose TradeMind Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</span>?
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px]">
              {[
                { 
                  title: "Free to Start", 
                  description: "Begin your trading journey without any upfront costs. Experience the full power of TradeMind risk-free.",
                  icon: Zap,
                  color: "text-purple-400",
                  details: "Start with our Basic plan at no cost. Get access to essential features like trade journaling, basic analytics, and market insights. Upgrade anytime as your trading needs grow."
                },
                { 
                  title: "User Friendly", 
                  description: "Intuitive interface designed for traders of all levels. Get started quickly and easily navigate through powerful features.",
                  icon: Users,
                  color: "text-purple-400",
                  details: "Our platform is built with simplicity in mind. Clean, modern interface with drag-and-drop functionality, customizable dashboards, and step-by-step tutorials to help you get the most out of every feature."
                },
                { 
                  title: "Advanced AI", 
                  description: "Leverage cutting-edge algorithms for better trades. Get AI-powered insights and predictions to enhance your strategy.",
                  icon: Sparkles,
                  color: "text-purple-400",
                  details: "Our AI technology analyzes market patterns, predicts trends, and provides personalized recommendations. Machine learning algorithms adapt to your trading style and help identify profitable opportunities.",
                  comingSoon: true
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-gradient-to-b from-[#2A1A4A] to-[#1A0E2E] border-purple-700 text-white hover:border-purple-500 transition-all duration-300 overflow-hidden group w-full">
                  <CardContent className="p-6 relative">
                    {feature.comingSoon && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300 hover:no-underline py-0">
                          <span className="text-sm font-medium">Learn more</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 mt-2 text-sm">
                          {feature.details}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <Showcase />

        {/* Powerful Features Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/30 to-black rounded-3xl my-12" id="features">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Smarter Trading</span>
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            Elevate your trading game with our comprehensive suite of tools designed to give you the edge in any market condition.
          </p>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px]">
              {[
                { 
                  title: "Advanced Trading Journal",
                  description: "Log trades with precision, track your progress, and gain valuable insights into your trading patterns.",
                  icon: Book,
                  color: "text-purple-400",
                  details: "Our advanced journaling system allows you to record every aspect of your trades, including entry/exit points, emotions, market conditions, and custom metrics. Generate detailed reports and identify patterns in your trading behavior."
                },
                { 
                  title: "AI-Powered Insights",
                  description: "Harness the power of machine learning to get intelligent suggestions and market predictions.",
                  icon: Zap,
                  color: "text-pink-400",
                  details: "Our AI algorithms analyze your trading history and market data to provide personalized insights. Get recommendations for trade setups, risk management, and strategy optimization based on your trading style.",
                  comingSoon: true
                },
                { 
                  title: "Real-Time Analytics",
                  description: "Visualize your trading performance with comprehensive charts and metrics in real-time.",
                  icon: BarChart2,
                  color: "text-blue-400",
                  details: "Monitor your performance with live P&L tracking, equity curves, win rates, and advanced risk metrics. Customize your dashboard to focus on the metrics that matter most to your trading strategy."
                },
                { 
                  title: "Risk Management",
                  description: "Set and monitor risk parameters to protect your capital and optimize your trading strategy.",
                  icon: Shield,
                  color: "text-green-400",
                  details: "Define position sizes, stop losses, and risk limits automatically. Track your risk exposure across different markets and get alerts when approaching your predefined risk thresholds."
                },
                { 
                  title: "Strategy Playbook",
                  description: "Document and refine your trading strategies. Backtest and optimize for better performance.",
                  icon: BookOpen,
                  color: "text-yellow-400",
                  details: "Create detailed strategy templates, complete with entry/exit rules, risk parameters, and performance metrics. Backtest your strategies against historical data and optimize them for different market conditions."
                },
                { 
                  title: "Cloud Integration",
                  description: "Access your data from any device, anytime. Seamlessly integrate with your favorite brokers.",
                  icon: Lock,
                  color: "text-indigo-400",
                  details: "Your trading data is securely stored in the cloud and accessible across all your devices. Connect with major brokers for automated trade importing and real-time position tracking."
                },
                { 
                  title: "Market Sentiment Analysis",
                  description: "Stay ahead with advanced tools to gauge market emotions and trends using social media and news data.",
                  icon: TrendingUp,
                  color: "text-red-400",
                  details: "Track market sentiment across social media, news sources, and trading forums. Get real-time alerts on significant sentiment shifts that could affect your trading positions.",
                  comingSoon: true
                },
                { 
                  title: "Custom Alerts",
                  description: "Never miss an opportunity with customizable notifications for price movements and technical indicators.",
                  icon: Bell,
                  color: "text-orange-400",
                  details: "Set up personalized alerts for price levels, technical indicators, volume spikes, and more. Receive notifications via email, mobile push, or within the platform."
                },
                { 
                  title: "Trading Community",
                  description: "Connect with fellow traders, share insights, and access educational resources to continually improve your skills.",
                  icon: Users,
                  color: "text-teal-400",
                  details: "Join a community of like-minded traders, share strategies, and learn from experienced mentors. Access webinars, tutorials, and educational content to enhance your trading knowledge.",
                  comingSoon: true
                },
              ].map((feature, index) => (
                <Card key={index} className="bg-gradient-to-br from-purple-900 to-purple-950 border-purple-700 text-white hover:border-purple-500 transition-all duration-300 group overflow-hidden w-full">
                  <CardContent className="p-6 relative">
                    {feature.comingSoon && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value={`feature-${index}`} className="border-none">
                        <AccordionTrigger className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300 hover:no-underline py-0">
                          <span className="text-sm font-medium">Learn more</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 mt-2 text-sm">
                          {feature.details}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            {/* <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button> */}
          </div>
        </section>

        {/* Choose Your Plan Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12" id="pricing">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Plan</span>
          </h2>
          
          {/* Beta Version Banner */}
          <div className="max-w-3xl mx-auto mb-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2 text-center">
              <Sparkles className="h-10 w-10 text-purple-400 mt-[-4px]" />
              <div>
                <p className="text-lg text-purple-100 text-left">
                  <span className="font-semibold">Beta Version Available!</span> During our beta phase, all features are available at no cost. Pricing will be implemented after the beta period.
                </p>
                <p className="text-lg text-red-400 font-semibold mt-4 text-left">
                  Important: Use code <span className="font-bold text-purple-400">BETA</span> at signup to avoid being charged!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-[#1A1A1A] p-1 rounded-full">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setBillingCycle('monthly')}
                className="rounded-full"
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                onClick={() => setBillingCycle('yearly')}
                className="rounded-full"
              >
                Yearly
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Basic",
                subtitle: "Perfect for Beginners",
                monthlyPrice: "$1.99",
                yearlyPrice: "$19.90",
                originalMonthlyPrice: "$3.99",
                originalYearlyPrice: "$39.90",
                features: [
                  "Trade journaling",
                  "Basic performance analytics",
                  "Daily Journal",
                ],
                cta: "Get Started",
                popular: false,
                gradient: "from-purple-600 to-blue-500",
                comingSoon: false
              },
              {
                title: "Pro",
                subtitle: "For Serious Traders",
                monthlyPrice: "$5.99",
                yearlyPrice: "$59.90",
                originalMonthlyPrice: "$11.99",
                originalYearlyPrice: "$119.90",
                features: [
                  "Everything in Basic",
                  "AI-powered insights",
                  "Unlimited trades",
                ],
                cta: "Coming Soon",
                popular: false,
                gradient: "from-pink-500 to-purple-600",
                comingSoon: true
              },
              {
                title: "Enterprise",
                subtitle: "For Trading Firms",
                monthlyPrice: "$199.00",
                yearlyPrice: "$1990.00",
                originalMonthlyPrice: "$399.00",
                originalYearlyPrice: "$3990.00",
                features: [
                  "Everything in Pro",
                  "Multi-user support",
                  "Custom integrations",
                  "Dedicated account manager",
                  "Priority support",
                ],
                cta: "Coming Soon",
                popular: false,
                gradient: "from-purple-800 to-purple-500",
                comingSoon: true
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${plan.gradient} ${plan.popular ? 'shadow-lg shadow-purple-500/20' : ''} ${plan.comingSoon ? 'opacity-80' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
                    MOST POPULAR
                  </div>
                )}
                {plan.comingSoon && (
                  <>
                    <div className="absolute inset-0 backdrop-blur-[4px] bg-black/20 z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-purple-700 text-white text-base font-medium px-6 py-2 rounded-full shadow-lg border border-purple-400/30 transform ">
                        Coming Soon
                      </div>
                    </div>
                  </>
                )}
                <CardHeader className={`pb-0 pt-6 ${plan.comingSoon ? 'opacity-60' : ''}`}>
                  <CardTitle className="text-2xl mb-1 text-white">{plan.title}</CardTitle>
                  <p className="text-purple-100">{plan.subtitle}</p>
                </CardHeader>
                <CardContent className={`p-6 flex flex-col h-[500px] ${plan.comingSoon ? 'opacity-60' : ''}`}>
                  <div className="mb-6 text-center">
                    <div className="relative inline-block">
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-900/50 rounded-full px-3 py-0.5 mb-1">
                          <p className="text-lg text-gray-400 line-through font-medium">
                            {billingCycle === 'monthly' ? plan.originalMonthlyPrice : plan.originalYearlyPrice}
                          </p>
                        </div>
                        <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white animate-gradient">
                          {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        50% OFF
                      </span>
                    </div>
                    <style jsx>{`
                      @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                      }
                      .animate-gradient {
                        background-size: 200% auto;
                        animation: gradient 3s ease infinite;
                      }
                    `}</style>
                    <p className="text-sm text-purple-200 mt-4">
                      {billingCycle === 'monthly' ? 'per month' : 'per year'}
                    </p>
                    {billingCycle === 'yearly' && (
                      <div className="mt-2 bg-green-500/10 rounded-full py-1 px-3 inline-block">
                        <p className="text-sm text-green-400 font-bold">
                          Save {Math.round((1 - (parseFloat(plan.yearlyPrice.slice(1)) / (parseFloat(plan.monthlyPrice.slice(1)) * 12))) * 100)}% extra
                        </p>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-white">
                        <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button 
                      className={`w-full py-4 rounded-full text-lg transition-colors duration-300 ${
                        plan.comingSoon 
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-purple-100 text-purple-700'
                      }`}
                      disabled={plan.comingSoon}
                      onClick={() => !plan.comingSoon && navigate('/auth')}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section COMMENTED OUT BECAUSE WE DON'T HAVE ANY TESTIMONIALS YET*/}
        {/* <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/30 to-black rounded-3xl my-12" id="testimonials">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Traders</span> Say
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what successful traders are saying about TradeMind.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "TradeMind has transformed my trading journey. The AI-powered insights and real-time analytics have significantly improved my win rate. I've seen a 40% increase in my portfolio value since I started using this platform!",
                author: "Jane Doe",
                role: "Day Trader",
                image: "/placeholder.svg?height=100&width=100",
                rating: 5
              },
              {
                text: "As a forex trader, I need reliable data and quick insights. TradeMind delivers on both fronts. The custom alerts have saved me countless hours, and the community features have connected me with like-minded traders. It's an indispensable tool in my trading arsenal.",
                author: "John Smith",
                role: "Forex Trader",
                image: "/placeholder.svg?height=100&width=100",
                rating: 5
              },
              {
                text: "I was skeptical at first, but TradeMind has exceeded all my expectations. The user-friendly interface made it easy to get started, and the advanced features like the Strategy Playbook have taken my trading to the next level. It's a game-changer for both beginners and experienced traders!",
                author: "Sam Johnson",
                role: "Crypto Enthusiast",
                image: "/placeholder.svg?height=100&width=100",
                rating: 5
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-[#1A1A1A] border-purple-700 text-white hover:border-purple-500 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-purple-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="flex-grow mb-4 italic text-gray-300">"{testimonial.text}"</p>
                  <div className="mt-auto flex justify-end">
                    <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                      Read Full Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Read More Testimonials
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section> */}

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12" id="faq">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Questions</span>
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* General Questions */}
            <div className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">General Questions</h3>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  {
                    question: "What is TradeMind?",
                    answer: "TradeMind is a comprehensive trading platform that offers tools for trade journaling, market analysis, and performance tracking. It's designed to help both beginners and experienced traders make more informed decisions."
                  },
                  {
                    question: "Who is TradeMind for?",
                    answer: "TradeMind is for traders of all levels, from beginners to experienced professionals. Whether you're trading stocks, forex, cryptocurrencies, or other assets, ourplatform provides valuable tools to enhance your trading performance."
                  },
                  {
                    question: "Can I try TradeMind before subscribing?",
                    answer: "Yes! We offer a free Basic plan that allows you to explore the core features of TradeMind. This gives you the opportunity to see how TradeMind can enhance your trading experience before committing to a paid subscription."
                  },
                  {
                    question: "Whatmarkets does TradeMind support?",
                    answer: "TradeMind supports a wide range of markets, including stocks, forex, cryptocurrencies, commodities, and more. Our platform is designed to be flexible and accommodate various trading instruments and strategies."
                  },
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`general-${index}`} 
                    className="border border-purple-800/50 rounded-lg overflow-hidden bg-black/20"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-purple-500/10 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Security & Privacy */}
            <div className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Security & Privacy</h3>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  {
                    question: "How does TradeMind ensure the security of my data?",
                    answer: "We employ state-of-the-art security measures, including end-to-end encryption, two-factor authentication, and regular security audits. Our servers are protected by advanced firewalls and we follow industry best practices for data protection."
                  },
                  {
                    question: "Is my trading data shared with third parties?",
                    answer: "No, we do not share your personal trading data with third parties. Your information is kept strictly confidential and is only used to provide and improve our services to you."
                  },
                  {
                    question: "Can I delete my account and all associated data?",
                    answer: "Yes, you have full control over your data. You can request to delete your account and all associated data at any time through your account settings or by contacting our support team."
                  },
                  {
                    question: "How often is my data backed up?",
                    answer: "We perform daily backups of all user data to ensure that your information is safe and can be recovered in case of any unforeseen events. Our backup systems are also encrypted and stored securely."
                  },
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`security-${index}`} 
                    className="border border-purple-800/50 rounded-lg overflow-hidden bg-black/20"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-purple-500/10 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Features & Functionality */}
            <div className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Features & Functionality</h3>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  {
                    question: "What are the key features of TradeMind?",
                    answer: "TradeMind offers comprehensive trading tools including AI-powered insights, real-time analytics, advanced journaling, risk management, and strategy development features. Our platform is designed to help you make data-driven trading decisions."
                  },
                  {
                    question: "Can I customize the platform to my needs?",
                    answer: "Yes, TradeMind is highly customizable. You can set up custom alerts, create personalized dashboards, and configure the platform to match your trading style and preferences."
                  },
                  {
                    question: "Does TradeMind offer mobile access?",
                    answer: "Yes, TradeMind is accessible on all devices through our web platform and dedicated mobile apps, allowing you to stay connected to your trading activities wherever you are."
                  },
                  {
                    question: "What kind of analytics does TradeMind provide?",
                    answer: "We offer comprehensive analytics including performance metrics, risk analysis, pattern recognition, and AI-driven market insights to help you understand and improve your trading performance."
                  },
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`features-${index}`} 
                    className="border border-purple-800/50 rounded-lg overflow-hidden bg-black/20"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-purple-500/10 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Pricing & Subscriptions */}
            <div className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Pricing & Subscriptions</h3>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  {
                    question: "What subscription plans does TradeMind offer?",
                    answer: "We offer flexible plans including Basic, Pro, and Enterprise subscriptions. Each plan is designed to cater to different trading needs and volumes, with various feature sets and support levels."
                  },
                  {
                    question: "Can I upgrade or downgrade my plan?",
                    answer: "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle."
                  },
                  {
                    question: "Do you offer refunds?",
                    answer: "No, we do not offer refunds at this time. For example, if you purchase a monthly subscription for $5.99, this charge is non-refundable."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, PayPal. All transactions are processed securely through our trusted payment partners."
                  },
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`pricing-${index}`} 
                    className="border border-purple-800/50 rounded-lg overflow-hidden bg-black/20"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-purple-500/10 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-4">Can't find the answer you're looking for?</p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = 'mailto:contact@vcryptfinancial.com'}
            >
              Contact Support
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 my-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Trading?</h2>
            <p className="text-xl mb-8">Join thousands of traders who are already using TradeMind to improve their performance.</p>
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-purple-950/30 to-black border-t border-purple-800/50 mt-12">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</h3>
                <p className="text-gray-400">Empowering traders with cutting-edge tools and insights.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-purple-400 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
                  <li><a href="/careers" className="text-gray-400 hover:text-purple-400 transition-colors">Careers</a></li>
                  <li><a href="mailto:contact@vcryptfinancial.com" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/legal/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
                  <li><a href="/legal/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/legal/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-purple-800/50 text-center text-gray-400">
              © {new Date().getFullYear()} TradeMind. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}