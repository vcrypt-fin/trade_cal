import { useState } from 'react'
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

const features = [
  { name: "Notebook", icon: Table },
  { name: "Reporting", icon: BarChart },
  { name: "Backtesting", icon: Settings },
  { name: "Replay", icon: PlayIcon },
  { name: "Playbook", icon: BookOpenIcon },
  { name: "Mentoring", icon: Presentation },
  { name: "Education", icon: GraduationCap },
]

function ShowcaseCard({
  title,
  description,
  content
}: {
  title: string
  description: string
  content: React.ReactNode
}) {
  return (
    <Card className="bg-gradient-to-br from-purple-950/50 to-black border-purple-800/30 p-6 shadow-lg hover:shadow-purple-800/20 transition-all duration-300">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">{title}</h3>
      <p className="text-purple-200 mb-6">{description}</p>
      {content}
    </Card>
  )
}

function DashboardDemo() {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-950/50 to-black rounded-lg border border-purple-800/30 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Net P&L" value="$6,068.00" trend="up" />
        <MetricCard title="Win Rate" value="66.7%" trend="up" />
        <MetricCard title="Profit Factor" value="506.67" trend="up" />
        <MetricCard title="Current Streak" value="1" trend="neutral" />
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-purple-100">December 2024</h4>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-purple-300 border-purple-700 hover:bg-purple-800/20 hover:text-white transition-colors duration-300">
            <Calendar className="h-4 w-4 mr-2" />
            Date range
          </Button>
          <Button variant="outline" size="sm" className="text-purple-300 border-purple-700 hover:bg-purple-800/20 hover:text-white transition-colors duration-300">
            Demo Data
          </Button>
        </div>
      </div>
      <div className="bg-purple-950/30 p-4 rounded-lg">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-purple-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {Array(31).fill(null).map((_, i) => (
            <div key={i} className={`aspect-square rounded-lg p-2 ${i === 9 ? 'bg-green-800/30' : 'bg-purple-900/30'} hover:bg-purple-800/50 transition-colors duration-300`}>
              <div className="h-full flex flex-col">
                <div className="text-xs text-purple-400 mb-1">{i + 1}</div>
                {i === 9 && (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-green-400 font-medium">$6,068</div>
                    <div className="text-purple-300/90 text-xs">3 trades</div>
                    <div className="text-purple-300/90 text-xs">66.7% win</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DailyJournalDemo() {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-950/50 to-black rounded-lg border border-purple-800/30 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-purple-100">2024-12-10</h4>
        <Button variant="outline" size="sm" className="text-purple-300 border-purple-700 hover:bg-purple-800/20 hover:text-white transition-colors duration-300">
          View Note
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Trades" value="3" trend="neutral" />
          <MetricCard title="Winners" value="2" trend="up" />
          <MetricCard title="Gross P&L" value="$6080.00" trend="up" />
          <MetricCard title="Commissions" value="$0.00" trend="neutral" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-purple-400 border-b border-purple-800/50">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Symbol</th>
                <th className="pb-2 pr-4">Side</th>
                <th className="pb-2 pr-4">Quantity</th>
                <th className="pb-2 pr-4">Entry</th>
                <th className="pb-2 pr-4">Exit</th>
                <th className="pb-2">P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm text-purple-200 border-b border-purple-800/30">
                <td className="py-2 pr-4">12:05:00</td>
                <td className="py-2 pr-4">MNQ</td>
                <td className="py-2 pr-4 text-green-400">LONG</td>
                <td className="py-2 pr-4">2</td>
                <td className="py-2 pr-4">5</td>
                <td className="py-2 pr-4">2</td>
                <td className="py-2 text-red-400">-$12.00</td>
              </tr>
              <tr className="text-sm text-purple-200 border-b border-purple-800/30">
                <td className="py-2 pr-4">11:56:00</td>
                <td className="py-2 pr-4">MNQ</td>
                <td className="py-2 pr-4 text-green-400">LONG</td>
                <td className="py-2 pr-4">20</td>
                <td className="py-2 pr-4">4</td>
                <td className="py-2 pr-4">6</td>
                <td className="py-2 text-green-400">$80.00</td>
              </tr>
              <tr className="text-sm text-purple-200">
                <td className="py-2 pr-4">11:00:00</td>
                <td className="py-2 pr-4">MNQ</td>
                <td className="py-2 pr-4 text-green-400">LONG</td>
                <td className="py-2 pr-4">1000</td>
                <td className="py-2 pr-4">200000</td>
                <td className="py-2 pr-4">5</td>
                <td className="py-2 text-green-400">$6,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TradeLogDemo() {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-950/50 to-black rounded-lg border border-purple-800/30 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
          <MetricCard title="Net P&L" value="$6,068.00" trend="up" />
          <MetricCard title="Win Rate" value="66.7%" trend="up" />
          <MetricCard title="Profit Factor" value="506.67" trend="up" />
          <MetricCard title="Current Streak" value="1" trend="neutral" />
        </div>
        <Button className="bg-purple-700 text-white hover:bg-purple-600 transition-colors duration-300">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" className="text-purple-300 border-purple-700 hover:bg-purple-800/20 hover:text-white transition-colors duration-300">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-purple-400 border-b border-purple-800/50">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Time</th>
              <th className="pb-2 pr-4">Symbol</th>
              <th className="pb-2 pr-4">Side</th>
              <th className="pb-2 pr-4">Quantity</th>
              <th className="pb-2 pr-4">Entry Price</th>
              <th className="pb-2 pr-4">Exit Price</th>
              <th className="pb-2 pr-4">P&L</th>
              <th className="pb-2 pr-4">Strategy</th>
              <th className="pb-2 pr-4">Notes</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm text-purple-200 border-b border-purple-800/30">
              <td className="py-2 pr-4">2024-12-10</td>
              <td className="py-2 pr-4">12:05:00</td>
              <td className="py-2 pr-4">MNQ</td>
              <td className="py-2 pr-4 text-green-400">LONG</td>
              <td className="py-2 pr-4">2</td>
              <td className="py-2 pr-4">5.00</td>
              <td className="py-2 pr-4">2.00</td>
              <td className="py-2 pr-4 text-red-400">-$12.00</td>
              <td className="py-2 pr-4">ef824d32-082a-4937-bac8-e5bafbc8050b</td>
              <td className="py-2 pr-4">N/A</td>
              <td className="py-2">
                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-100">
                  Edit
                </Button>
              </td>
            </tr>
            <tr className="text-sm text-purple-200 border-b border-purple-800/30">
              <td className="py-2 pr-4">2024-12-10</td>
              <td className="py-2 pr-4">11:56:00</td>
              <td className="py-2 pr-4">MNQ</td>
              <td className="py-2 pr-4 text-green-400">LONG</td>
              <td className="py-2 pr-4">20</td>
              <td className="py-2 pr-4">4.00</td>
              <td className="py-2 pr-4">6.00</td>
              <td className="py-2 pr-4 text-green-400">$80.00</td>
              <td className="py-2 pr-4">00fdb243-9cdd-4270-a0f8-8f16dd296cb6</td>
              <td className="py-2 pr-4">Test</td>
              <td className="py-2">
                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-100">
                  Edit
                </Button>
              </td>
            </tr>
            <tr className="text-sm text-purple-200">
              <td className="py-2 pr-4">2024-12-10</td>
              <td className="py-2 pr-4">11:00:00</td>
              <td className="py-2 pr-4">MNQ</td>
              <td className="py-2 pr-4 text-green-400">LONG</td>
              <td className="py-2 pr-4">1000</td>
              <td className="py-2 pr-4">200000.00</td>
              <td className="py-2 pr-4">5.00</td>
              <td className="py-2 pr-4 text-green-400">$6,000.00</td>
              <td className="py-2 pr-4">ef824d32-082a-4937-bac8-e5bafbc8050b</td>
              <td className="py-2 pr-4">Massive balls</td>
              <td className="py-2">
                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-100">
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-gradient-to-br from-purple-950 to-black p-4 rounded-lg border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300">
      <div className="text-sm text-purple-400 mb-1">{title}</div>
      <div className="text-xl font-bold text-white flex items-center justify-between">
        {value}
        {trend === 'up' && <ChevronUp className="h-5 w-5 text-green-400" />}
        {trend === 'down' && <ChevronDown className="h-5 w-5 text-red-400" />}
        {trend === 'neutral' && <div className="h-5 w-5 rounded-full bg-yellow-500/30" />}
      </div>
    </div>
  )
}

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
        
        <div className="mb-12">
          <motion.div 
            className="flex justify-center space-x-4 overflow-x-auto pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-2 min-w-[100px] text-purple-300 hover:text-white hover:bg-purple-900/30 transition-all duration-300"
              >
                <feature.icon className="h-8 w-8" />
                <span className="text-xs font-medium">{feature.name}</span>
              </Button>
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <ShowcaseCard
                  title="Dashboard Overview"
                  description="Get a comprehensive view of your trading performance"
                  content={<DashboardDemo />}
                />
              </CarouselItem>
              <CarouselItem>
                <ShowcaseCard
                  title="Daily Journal"
                  description="Record and review your daily trading activities"
                  content={<DailyJournalDemo />}
                />
              </CarouselItem>
              <CarouselItem>
                <ShowcaseCard
                  title="Trade Log"
                  description="Detailed log of all your trades with advanced filtering"
                  content={<TradeLogDemo />}
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-purple-900/50 hover:bg-purple-800 text-white" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-purple-900/50 hover:bg-purple-800 text-white" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black text-white transition-colors duration-500 ease-in-out">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="/tutorial" className="hover:text-purple-400 transition-colors">Tutorial</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">FAQs</a></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              // onClick={() => router.push('/auth')}
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
                    <li><a href="#" className="block py-2 hover:text-purple-400 transition-colors">Home</a></li>
                    <li><a href="/tutorial" className="block py-2 hover:text-purple-400 transition-colors">Tutorial</a></li>
                    <li><a href="#" className="block py-2 hover:text-purple-400 transition-colors">Features</a></li>
                    <li><a href="#" className="block py-2 hover:text-purple-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="block py-2 hover:text-purple-400 transition-colors">FAQs</a></li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Elevate Your Trading with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Harness the power of AI-driven insights, advanced analytics, and a comprehensive trading journal to make smarter decisions and boost your trading performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300">
                Watch Demo
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[500px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 opacity-50"></div>
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-bold text-white">TradeMind Dashboard</div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 flex flex-col justify-between">
                    <div className="text-sm text-gray-400">Portfolio Value</div>
                    <div className="text-2xl font-bold text-green-400">$124,567.89</div>
                    <div className="text-sm text-green-400 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +2.34%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 flex flex-col justify-between">
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-2xl font-bold text-purple-400">68%</div>
                    <div className="text-sm text-purple-400 flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +5% this month
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 flex flex-col justify-between">
                    <div className="text-sm text-gray-400">Open Positions</div>
                    <div className="text-2xl font-bold text-blue-400">7</div>
                    <div className="text-sm text-blue-400 flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      3 profitable
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 flex flex-col justify-between">
                    <div className="text-sm text-gray-400">AI Insights</div>
                    <div className="text-lg font-bold text-pink-400">3 new signals</div>
                    <div className="text-sm text-pink-400 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      View now
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Recent Performance</div>
                  <div className="flex items-end space-x-1 h-20">
                    {[40, 60, 30, 70, 50, 80, 35, 65, 45, 75, 55, 85].map((height, index) => (
                      <div
                        key={index}
                        className="w-1/12 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose TradeMind Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">TradeMind</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: "Free to Start", 
              description: "Begin your trading journey without any upfront costs. Experience the full power of TradeMind risk-free.",
              icon: Zap,
              color: "text-purple-400"
            },
            { 
              title: "User Friendly", 
              description: "Intuitive interface designed for traders of all levels. Get started quickly and easily navigate through powerful features.",
              icon: Users,
              color: "text-purple-400"
            },
            { 
              title: "Real-Time Data", 
              description: "Stay informed with the latest market updates and news. Make decisions based on up-to-the-minute information.",
              icon: TrendingUp,
              color: "text-purple-400"
            },
            { 
              title: "Advanced AI", 
              description: "Leverage cutting-edge algorithms for better trades. Get AI-powered insights and predictions to enhance your strategy.",
              icon: Sparkles,
              color: "text-purple-400"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gradient-to-b from-[#2A1A4A] to-[#1A0E2E] border-purple-700 text-white hover:border-purple-500 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                <div className="mt-4 flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <Showcase />

      {/* Powerful Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/30 to-black rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
          Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Smarter Trading</span>
        </h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Elevate your trading game with our comprehensive suite of tools designed to give you the edge in any market condition.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Advanced Trading Journal",
              description: "Log trades with precision, track your progress, and gain valuable insights into your trading patterns. Our AI-powered analysis helps you identify strengths and areas for improvement.",
              icon: Book,
              color: "text-purple-400"
            },
            { 
              title: "AI-Powered Insights",
              description: "Harness the power of machine learning to get intelligent suggestions and market predictions. Our AI analyzes vast amounts of data to provide you with actionable trading ideas.",
              icon: Zap,
              color: "text-purple-400"
            },
            { 
              title: "Real-Time Performance Analytics",
              description: "Visualize your trading performance with comprehensive charts and metrics. Make data-driven decisions with our real-time dashboard showing your win rate, profit factor, and more.",
              icon: BarChart2,
              color: "text-purple-400"
            },
            { 
              title: "Advanced Risk Management",
              description: "Set and monitor risk parameters to protect your capital and optimize your trading strategy. Our tools help you maintain discipline and stick to your risk management rules.",
              icon: Shield,
              color: "text-purple-400"
            },
            { 
              title: "Strategy Playbook",
              description: "Document and refine your trading strategies. Backtest and optimize for better performance using our advanced simulation tools. Keep your edge sharp in any market condition.",
              icon: BookOpen,
              color: "text-purple-400"
            },
            { 
              title: "Secure Cloud Integration",
              description: "Your data is encrypted and safely stored in the cloud, accessible from any device, anytime. Seamlessly integrate with your favorite brokers and data providers for a unified trading experience.",
              icon: Lock,
              color: "text-purple-400"
            },
            { 
              title: "Market Sentiment Analysis",
              description: "Stay ahead of the curve with our advanced sentiment analysis tools. Gauge market emotions and trends using social media data, news sentiment, and more.",
              icon: TrendingUp,
              color: "text-purple-400"
            },
            { 
              title: "Custom Alerts & Notifications",
              description: "Never miss a trading opportunity with our customizable alert system. Set up notifications for price movements, technical indicators, or any custom conditions you define.",
              icon: Bell,
              color: "text-purple-400"
            },
            { 
              title: "Trading Community & Education",
              description: "Connect with fellow traders, share insights, and learn from the best. Access a wealth of educational resources, webinars, and trading courses to continually improve your skills.",
              icon: Users,
              color: "text-purple-400"
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-[#1A1A1A] border-purple-700 text-white hover:border-purple-500 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-6 relative">
                <feature.icon className={`h-12 w-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Explore All Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Choose Your Plan Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Plan</span>
        </h2>
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
              features: [
                "Trade journaling",
                "Basic performance analytics",
                "Daily Journal",
              ],
              cta: "Get Started",
              popular: false,
              gradient: "from-purple-600 to-blue-500"
            },
            {
              title: "Pro",
              subtitle: "For Serious Traders",
              monthlyPrice: "$5.99",
              yearlyPrice: "$59.90",
              features: [
                "Everything in Basic",
                "AI-powered insights",
                "Unlimited trades",
              ],
              cta: "Get Started",
              popular: true,
              gradient: "from-pink-500 to-purple-600"
            },
            {
              title: "Enterprise",
              subtitle: "For Trading Firms",
              monthlyPrice: "$199.00",
              yearlyPrice: "$1990.00",
              features: [
                "Everything in Pro",
                "Multi-user support",
                "Custom integrations",
                "Dedicated account manager",
                "Priority support",
              ],
              cta: "Get Started",
              popular: false,
              gradient: "from-purple-800 to-purple-500"
            }
          ].map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${plan.gradient} ${plan.popular ? 'shadow-lg shadow-purple-500/20' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className="pb-0 pt-6">
                <CardTitle className="text-2xl mb-1 text-white">{plan.title}</CardTitle>
                <p className="text-purple-100">{plan.subtitle}</p>
              </CardHeader>
              <CardContent className="p-6 flex flex-col h-[500px]">
                <div className="mb-6 text-center">
                  <p className="text-5xl font-bold text-white">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </p>
                  <p className="text-sm text-purple-200">
                    {billingCycle === 'monthly' ? 'per month' : 'per year'}
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-400 mt-2">
                      Save {Math.round((1 - (parseFloat(plan.yearlyPrice.slice(1)) / (parseFloat(plan.monthlyPrice.slice(1)) * 12))) * 100)}%
                    </p>
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
                    className="w-full py-4 rounded-full text-lg bg-white hover:bg-purple-100 text-purple-700 transition-colors duration-300"
                    // onClick={() => router.push(`/payment?plan=${plan.title.toLowerCase()}&cycle=${billingCycle}`)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/30 to-black rounded-3xl my-12">
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
      </section>

      {/* FAQs Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-950/20 to-black rounded-3xl my-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Questions</span>
        </h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-[#1A1A1A] border-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-purple-400" />
                General Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { 
                    question: "What is TradeMind?",
                    answer: "TradeMind is a comprehensive trading platform that offers tools for trade journaling, market analysis, and performance tracking. It's designed to help both beginners and experienced traders make more informed decisions and improve their trading strategies."
                  },
                  { 
                    question: "Who is TradeMind for?",
                    answer: "TradeMind is for traders of all levels, from beginners to experienced professionals. Whether you're trading stocks, forex, cryptocurrencies, or other assets, our platform provides valuable tools and insights to enhance your trading performance."
                  },
                  { 
                    question: "Can I try TradeMind before subscribing?",
                    answer: "Yes! We offer a free Basic plan that allows you to explore the core features of TradeMind. This gives you the opportunity to see how TradeMind can enhance your trading experience before committing to a paid subscription."
                  },
                  {
                    question: "What markets does TradeMind support?",
                    answer: "TradeMind supports a wide range of markets, including stocks, forex, cryptocurrencies, commodities, and more. Our platform is designed to be flexible and accommodate various trading instruments and strategies."
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`general-${index}`} className="border-b border-purple-700">
                    <AccordionTrigger className="hover:text-purple-400">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-400" />
                Security &Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { 
                    question: "How does TradeMind ensure the security of my data?",
                    answer: "We employ state-of-the-art security measures, including end-to-end encryption, two-factor authentication, and regular security audits to ensure the safety and privacy of your trading data. Our servers are protected by advanced firewalls and we follow industry best practices for data protection."
                  },
                  { 
                    question: "Is my trading data shared with third parties?",
                    answer: "No, we do not share your personal trading data with third parties. Your information is kept strictly confidential and is only used to provide and improve our services to you. We may share aggregated, anonymized data for analytical purposes, but this never includes personally identifiable information."
                  },
                  { 
                    question: "Can I delete my account and all associated data?",
                    answer: "Yes, you have full control over your data. You can request to delete your account and all associated data at any time through your account settings or by contacting our support team. We will process your request in accordance with applicable data protection laws."
                  },
                  {
                    question: "How often is my data backed up?",
                    answer: "We perform daily backups of all user data to ensure that your information is safe and can be recovered in case of any unforeseen events. Our backup systems are also encrypted and stored securely."
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`security-${index}`} className="border-b border-purple-700">
                    <AccordionTrigger className="hover:text-purple-400">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-purple-400" />
                Pricing & Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { 
                    question: "What payment methods do you accept?",
                    answer: "We accept a variety of payment methods including major credit cards (Visa, MasterCard, American Express), PayPal, and select cryptocurrencies. You can choose your preferred payment method during the checkout process."
                  },
                  { 
                    question: "Can I upgrade or downgrade my plan?",
                    answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll have immediate access to the new features. If you downgrade, the changes will take effect at the start of your next billing cycle. Any unused portion of your current plan will be prorated and credited to your account."
                  },
                  { 
                    question: "Do you offer refunds?",
                    answer: "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, you can request a full refund within 14 days of your initial purchase. For further details, please refer to our refund policy or contact our support team."
                  },
                  {
                    question: "Are there any hidden fees?",
                    answer: "No, there are no hidden fees. The price you see for each plan is the price you pay. We believe in transparent pricing and will always communicate any changes to our pricing structure well in advance."
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`pricing-${index}`} className="border-b border-purple-700">
                    <AccordionTrigger className="hover:text-purple-400">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-400" />
                Support & Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { 
                    question: "What kind of support do you offer?",
                    answer: "We offer multiple levels of support. Basic plan users have access to our community forums and knowledge base. Pro plan subscribers receive priority email support. Enterprise clients get dedicated account management. Our support team is knowledgeable about both the platform and trading in general."
                  },
                  { 
                    question: "Is there a community of traders I can connect with?",
                    answer: "Yes! TradeMind has a vibrant community of traders. You can connect with fellow traders through our community forums, participate in discussions, share insights, and learn from others' experiences. We also host regular webinars and online events for our community."
                  },
                  { 
                    question: "Do you offer educational resources?",
                    answer: "We provide a wealth of educational resources including tutorials, webinars, articles, and video courses. These cover various aspects of trading, from basic concepts to advanced strategies. Our goal is to help you continually improve your trading skills."
                  },
                  {
                    question: "How quickly can I expect a response from support?",
                    answer: "Our response times vary depending on your plan and the complexity of the issue. Basic plan users typically receive responses within 24-48 hours. Pro plan users can expect responses within 12-24 hours. For urgent issues, we strive to provide initial responses as quickly as possible."
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`support-${index}`} className="border-b border-purple-700">
                    <AccordionTrigger className="hover:text-purple-400">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">Can't find the answer you're looking for?</p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
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
            // onClick={() => router.push('/payment?plan=basic&cycle=monthly')}
          >
            Start Your Free Trial
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
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-purple-800/50 text-center text-gray-400">
            © {new Date().getFullYear()} TradeMind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

