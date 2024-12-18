import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Stats() {
  return (
    <section className="container py-12 md:py-24 bg-purple-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-100">Proven Results</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">66.7%</div>
            <p className="text-xs text-purple-300">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">506.67</div>
            <p className="text-xs text-purple-300">
              +23% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Average Winner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">$3,040.00</div>
            <p className="text-xs text-purple-300">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">$6,068.00</div>
            <p className="text-xs text-purple-300">
              +42.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

