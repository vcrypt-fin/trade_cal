import { ChevronUp, ChevronDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  trend: 'up' | 'down' | 'neutral'
}

export function MetricCard({ title, value, trend }: MetricCardProps) {
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

