import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BarChart2, BookOpen, PieChart, Calendar, Layers, Target, TrendingUp, FileText } from 'lucide-react'

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">BUYDATE</div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="/" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-purple-400">Tutorial</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">How to Use BUYDATE</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Getting Started</h2>
            <p className="mb-4">Welcome to BUYDATE! Follow these steps to get started with your trading journey:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Sign up for an account on the BUYDATE platform.</li>
              <li>Complete your profile with your trading preferences and risk tolerance.</li>
              <li>Explore the dashboard to familiarize yourself with the layout.</li>
            </ol>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#1A1A1A] border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-400" />
                  Trading Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">The Trading Journal is where you'll log all your trades. Here's how to use it:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click on the "New Trade" button.</li>
                  <li>Enter the trade details: asset, entry price, exit price, quantity, etc.</li>
                  <li>Add notes about your strategy and market conditions.</li>
                  <li>Save the trade to add it to your journal.</li>
                </ol>
                <div className="mt-4 p-4 bg-[#2A1A4A] rounded-lg">
                  <p className="font-semibold mb-2">Example:</p>
                  <p>Asset: BTC/USD</p>
                  <p>Entry: $35,000</p>
                  <p>Exit: $37,500</p>
                  <p>Quantity: 0.5 BTC</p>
                  <p>Notes: Bullish trend confirmed, support level held.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-6 w-6 text-purple-400" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Use the Performance Analytics tool to gain insights into your trading:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>View your win rate and profit factor.</li>
                  <li>Analyze your performance by asset, time frame, or strategy.</li>
                  <li>Identify your strengths and areas for improvement.</li>
                </ul>
                <div className="mt-4 p-4 bg-[#2A1A4A] rounded-lg">
                  <p className="font-semibold mb-2">Example Metrics:</p>
                  <p>Win Rate: 65%</p>
                  <p>Profit Factor: 1.8</p>
                  <p>Best Performing Asset: ETH/USD</p>
                  <p>Most Profitable Strategy: Breakout trades</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 h-6 w-6 text-purple-400" />
                  Strategy Playbook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">The Strategy Playbook helps you document and refine your trading strategies:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create a new strategy entry.</li>
                  <li>Define entry and exit criteria.</li>
                  <li>Set risk management rules.</li>
                  <li>Track the performance of each strategy over time.</li>
                </ol>
                <div className="mt-4 p-4 bg-[#2A1A4A] rounded-lg">
                  <p className="font-semibold mb-2">Example Strategy:</p>
                  <p>Name: Moving Average Crossover</p>
                  <p>Entry: When 10-day MA crosses above 50-day MA</p>
                  <p>Exit: When 10-day MA crosses below 50-day MA</p>
                  <p>Risk: 1% of account per trade</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-6 w-6 text-purple-400" />
                  Daily Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Use the Daily Journal to record your market analysis and trading plan:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Review key economic events and news.</li>
                  <li>Analyze market trends and potential trade setups.</li>
                  <li>Set goals and intentions for your trading day.</li>
                </ul>
                <div className="mt-4 p-4 bg-[#2A1A4A] rounded-lg">
                  <p className="font-semibold mb-2">Example Entry:</p>
                  <p>Date: 2023-06-15</p>
                  <p>Market Outlook: Bullish on tech stocks due to positive earnings reports</p>
                  <p>Key Levels: S&P 500 resistance at 4,200, support at 4,150</p>
                  <p>Trading Plan: Look for breakout opportunities in AAPL and MSFT</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Advanced Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-6 w-6 text-purple-400" />
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Set and monitor your risk parameters for each trade and overall portfolio.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-purple-400" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Leverage machine learning algorithms to gain predictive insights on market trends.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1A1A1A] border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-6 w-6 text-purple-400" />
                    Portfolio Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visualize and optimize your portfolio allocation across different assets and strategies.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Start Trading?</h2>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg">
            Go to Dashboard
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>

      <footer className="bg-[#0A0A0A] border-t border-purple-900 mt-20 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          © {new Date().getFullYear()} BUYDATE. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

