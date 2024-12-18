import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950/20" />
      <div className="container relative flex flex-col items-center justify-center space-y-8 py-32 text-center md:py-40">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-purple-200 to-purple-400">
            Trade Smarter with AI-Powered Insights
          </h1>
          <p className="mx-auto max-w-[700px] text-purple-200/80 md:text-xl">
            Transform your trading journey with advanced analytics, automated journaling, and AI-driven performance insights.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-purple-700 text-purple-300 hover:bg-purple-900/50">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  )
}

