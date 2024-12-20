import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, Calendar, Table, Filter, PlusCircle, BookOpen, Play, Presentation, GraduationCap, Settings, ChevronUp, ChevronDown } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { motion } from "framer-motion"

export function Showcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-950" id="showcase">
      <div className="container mx-auto px-4">
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
          className="relative px-4 md:px-12"
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
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple-900/50 hover:bg-purple-800 text-white" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-900/50 hover:bg-purple-800 text-white" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}

const features = [
  { name: "Notebook", icon: Table },
  { name: "Reporting", icon: BarChart },
  { name: "Backtesting", icon: Settings },
  { name: "Replay", icon: Play },
  { name: "Playbook", icon: BookOpen },
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
    <Card className="bg-gradient-to-br from-purple-950 to-black border-purple-800/30 p-6 shadow-lg hover:shadow-purple-800/20 transition-all duration-300">
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

