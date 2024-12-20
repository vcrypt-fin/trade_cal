import { Button } from "@/components/ui/button"
import { Calendar } from 'lucide-react'
import { MetricCard } from "./MetricCard"

export function DashboardDemo() {
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

