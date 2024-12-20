'use client'

import { useEffect, useRef } from 'react'

export function ChartVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const glowCanvas = glowRef.current
    if (!canvas || !glowCanvas) return

    const ctx = canvas.getContext('2d')
    const glowCtx = glowCanvas.getContext('2d')
    if (!ctx || !glowCtx) return

    // Set up canvas dimensions with device pixel ratio
    const dpr = window.devicePixelRatio || 1
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      glowCanvas.width = rect.width * dpr
      glowCanvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      glowCtx.scale(dpr, dpr)
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Animation parameters
    let time = 0
    const mainLinePoints: number[] = []
    const secondaryLinePoints: number[] = []
    const barHeights: number[] = []
    const maxPoints = 100
    const dataPoints: { x: number; y: number; value: string }[] = []

    // Generate initial data
    for (let i = 0; i < maxPoints; i++) {
      mainLinePoints.push(0)
      secondaryLinePoints.push(0)
      barHeights.push(0)
    }

    function generateValue(t: number, offset: number = 0) {
      return (
        Math.sin(t * 0.02 + offset) * 50 +
        Math.sin(t * 0.05 + offset) * 30 +
        Math.sin(t * 0.03 + offset) * 20
      )
    }

    // Draw functions
    function drawGrid(context: CanvasRenderingContext2D) {
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      context.strokeStyle = 'rgba(102, 51, 153, 0.1)'
      context.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < width; x += 50) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < height; y += 50) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
    }

    function drawBars(context: CanvasRenderingContext2D, alpha: number = 1) {
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const barWidth = width / maxPoints
      
      barHeights.forEach((height, i) => {
        const x = i * barWidth
        const gradient = context.createLinearGradient(x, height + height/2, x, height)
        gradient.addColorStop(0, `rgba(147, 51, 234, ${0.1 * alpha})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.05 * alpha})`)
        
        context.fillStyle = gradient
        context.fillRect(x, height/2 + height, barWidth - 1, height)
      })
    }

    function drawLine(context: CanvasRenderingContext2D, points: number[], color: string, alpha: number = 1) {
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const step = width / (points.length - 1)

      context.beginPath()
      points.forEach((point, i) => {
        const x = i * step
        const y = (height / 2) + point
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      })
      
      context.strokeStyle = color.replace(')', `, ${alpha})`)
      context.lineWidth = 3
      context.stroke()

      // Draw glow effect
      context.lineWidth = 6
      context.strokeStyle = color.replace(')', ', 0.2)')
      context.stroke()
    }

    function drawDataPoints(context: CanvasRenderingContext2D) {
      dataPoints.forEach(point => {
        // Draw circle
        context.beginPath()
        context.arc(point.x, point.y, 4, 0, Math.PI * 2)
        context.fillStyle = '#4CAF50'
        context.fill()

        // Draw value
        context.font = '12px monospace'
        context.fillStyle = '#4CAF50'
        context.fillText(point.value, point.x + 10, point.y - 10)
      })
    }

    function animate() {
      // Clear canvases
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
      glowCtx.clearRect(0, 0, glowCanvas.width / dpr, glowCanvas.height / dpr)

      // Draw grid
      drawGrid(ctx)

      // Update data
      const newMainValue = generateValue(time)
      const newSecondaryValue = generateValue(time, Math.PI / 4)
      
      mainLinePoints.push(newMainValue)
      secondaryLinePoints.push(newSecondaryValue)
      barHeights.push(Math.abs(newMainValue))
      
      if (mainLinePoints.length > maxPoints) mainLinePoints.shift()
      if (secondaryLinePoints.length > maxPoints) secondaryLinePoints.shift()
      if (barHeights.length > maxPoints) barHeights.shift()

      // Update data points (every 20 frames)
      if (time % 20 === 0) {
        const width = canvas.width / dpr
        const height = canvas.height / dpr
        const x = width * 0.8 + Math.random() * (width * 0.2)
        const y = height/2 + newMainValue
        const value = (18000 + Math.random() * 1000).toFixed(2)
        dataPoints.push({ x, y, value })
        if (dataPoints.length > 5) dataPoints.shift()
      }

      // Draw on glow canvas first (for blur effect)
      drawBars(glowCtx, 0.5)
      drawLine(glowCtx, secondaryLinePoints, 'rgba(236, 72, 153', 0.5)
      drawLine(glowCtx, mainLinePoints, 'rgba(147, 51, 234', 0.5)

      // Apply blur to glow canvas
      glowCtx.filter = 'blur(8px)'
      
      // Draw on main canvas
      ctx.drawImage(glowCanvas, 0, 0)
      drawBars(ctx)
      drawLine(ctx, secondaryLinePoints, 'rgba(236, 72, 153, 1)')
      drawLine(ctx, mainLinePoints, 'rgba(147, 51, 234, 1)')
      drawDataPoints(ctx)

      time += 1
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={glowRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(8px)' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute top-4 left-4 bg-purple-500/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/20">
        <div className="text-purple-300 text-sm">BTC/USD</div>
        <div className="text-2xl font-bold text-purple-100">$18,923.67</div>
      </div>
    </div>
  )
}

