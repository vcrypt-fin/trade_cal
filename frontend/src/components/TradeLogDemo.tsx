import { Button } from "@/components/ui/button"
import { Filter, PlusCircle } from 'lucide-react'
import { MetricCard } from "./MetricCard"

export function TradeLogDemo() {
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

