import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, BookOpen, Calendar, LineChart, PieChart, Table, Brain, Target } from 'lucide-react'

export function Features() {
  return (
    <section className="container space-y-12 py-24" id="features">
      <div className="mx-auto text-center md:max-w-[58rem]">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-purple-200 to-purple-400">
          Built for Professional Traders
        </h2>
        <p className="mt-4 text-purple-200/70 md:text-xl">
          Advanced tools and AI-powered analytics to help you make better trading decisions
        </p>
      </div>
      <div className="mx-auto grid gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-[#0A0A0A] border-purple-900/20 hover:scale-105 transition-transform duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-100">
                <feature.icon className="h-6 w-6 text-purple-500" />
                <span className="font-semibold">{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200/70">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

const features = [
  {
    title: "Trade Journal",
    description: "Log trades with precision, including entry/exit points, position sizes, and detailed notes",
    icon: Table,
  },
  {
    title: "Performance Analytics",
    description: "Track win rate, profit factor, and other key metrics with interactive charts",
    icon: BarChart3,
  },
  {
    title: "Daily Journal",
    description: "Record market analysis, emotions, and trading thoughts for better self-reflection",
    icon: Calendar,
  },
  {
    title: "Strategy Playbook",
    description: "Document and track performance of different trading strategies",
    icon: BookOpen,
  },
  {
    title: "P&L Tracking",
    description: "Monitor your profits and losses across multiple timeframes",
    icon: LineChart,
  },
  {
    title: "Advanced Reports",
    description: "Generate detailed reports on your trading performance and risk management",
    icon: PieChart,
  },
  {
    title: "AI Insights",
    description: "Get AI-powered suggestions to improve your trading strategy",
    icon: Brain,
  },
  {
    title: "Risk Management",
    description: "Set and track risk parameters with automated position sizing",
    icon: Target,
  },
]
