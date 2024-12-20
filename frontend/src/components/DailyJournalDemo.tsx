import { Button } from "@/components/ui/button"
import { MetricCard } from "./MetricCard"

export function DailyJournalDemo() {
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

