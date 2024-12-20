'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export function DashboardVisualization() {
  const mainChartRef = useRef<HTMLCanvasElement>(null)
  const volumeChartRef = useRef<HTMLCanvasElement>(null)
  const [currentPrice, setCurrentPrice] = useState(42156.78)
  const [priceChange, setPriceChange] = useState(2.34)
  const [timeframe, setTimeframe] = useState('1D')

  // Metrics data
  const metrics = [
    { label: '24h Volume', value: '$2.1B', change: '+5.2%', isPositive: true },
    { label: 'Market Cap', value: '$823.4B', change: '+1.8%', isPositive: true },
    { label: 'Open Interest', value: '$4.2B', change: '-0.5%', isPositive: false },
  ]

  useEffect(() => {
    // Main price chart animation
    const mainCanvas = mainChartRef.current
    if (!mainCanvas) return
    const ctx = mainCanvas.getContext('2d')
    if (!ctx) return

    // Set up canvas dimensions with device pixel ratio
    const dpr = window.devicePixelRatio || 1
    const updateMainCanvasSize = () => {
      const rect = mainCanvas.getBoundingClientRect()
      mainCanvas.width = rect.width * dpr
      mainCanvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    updateMainCanvasSize()

    // Chart data
    let time = 0
    const prices: number[] = []
    const maxPoints = 200

    function generatePrice(t: number) {
      const basePrice = 42000
      const amplitude = 1000 // Reduced amplitude for more stability
      return (
        basePrice +
        Math.sin(t * 0.05) * amplitude * 0.5 +
        Math.sin(t * 0.1) * amplitude * 0.3 +
        Math.sin(t * 0.01) * amplitude * 0.2 +
        (Math.random() - 0.5) * amplitude * 0.4 // Centered random noise
      )
    }

    // Animation loop for main chart
    function animateMainChart() {
      ctx.clearRect(0, 0, mainCanvas.width / dpr, mainCanvas.height / dpr)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, mainCanvas.height / dpr)
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.2)')
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0)')
      
      // Generate new price
      const newPrice = generatePrice(time)
      prices.push(newPrice)
      if (prices.length > maxPoints) prices.shift()
      
      // Update current price display
      setCurrentPrice(newPrice)
      setPriceChange((newPrice - 42000) / 420)

      // Draw price line
      ctx.beginPath()
      const step = mainCanvas.width / dpr / (maxPoints - 1)
      
      prices.forEach((price, i) => {
        const minPrice = 41000
        const maxPrice = 43000
        const y = mainCanvas.height / dpr - (((price - minPrice) / (maxPrice - minPrice)) * (mainCanvas.height / dpr))
        const x = i * step
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      // Fill area under the line
      ctx.lineTo(mainCanvas.width / dpr, mainCanvas.height / dpr)
      ctx.lineTo(0, mainCanvas.height / dpr)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw the line
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)'
      ctx.lineWidth = 3
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(147, 51, 234, 0.5)'
      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = 'rgba(147, 51, 234, 0.5)'
      
      time += 0.05 // Slowed down slightly for more stability
      requestAnimationFrame(animateMainChart)
    }

    // Start animations
    animateMainChart()

    // Handle window resize
    const handleResize = () => {
      updateMainCanvasSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">BTC/USD</h2>
            <span className={`flex items-center gap-1 text-lg ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            ${currentPrice.toFixed(2)}
          </div>
        </div>
        <div className="flex gap-2">
          {['1H', '1D', '1W', '1M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="relative h-[250px] mb-4">
        <canvas
          ref={mainChartRef}
          className="w-full h-full"
        />
      </div>

      {/* Market Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { symbol: "SPX", name: "S&P 500", price: "4,783.45", change: "+1.2%" },
          { symbol: "NDX", name: "Nasdaq", price: "16,832.92", change: "+0.8%" },
          { symbol: "BTC", name: "Bitcoin", price: "$42,156.78", change: "-2.1%" },
          { symbol: "ETH", name: "Ethereum", price: "$2,235.14", change: "-0.85%" },
        ].map((item) => (
          <div key={item.symbol} className="bg-purple-900/20 p-3 rounded-lg">
            <div className="text-sm text-purple-300">{item.symbol}</div>
            <div className="text-xs text-purple-400">{item.name}</div>
            <div className="text-lg font-bold">{item.price}</div>
            <div className={`text-sm ${item.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
              {item.change}
            </div>
          </div>
        ))}
      </div>

      {/* Live Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <span className="text-xs text-green-400">LIVE</span>
      </div>
    </div>
  )
}

