import React, { useState, useRef, useEffect } from 'react'
import { Button, Card, CardBody } from "@nextui-org/react"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, ArrowRight, Maximize, Minimize, UserPlus, LinkIcon, LayoutDashboard, BookOpen, Bell, BarChart2, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@nextui-org/react'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up and Choose Your Plan",
    description: "Create your TradeMind account and select the subscription plan that best fits your trading needs.",
  },
  {
    icon: LinkIcon,
    title: "Connect Your Trading Accounts",
    description: "Link your existing trading accounts to import your historical data and enable real-time tracking.",
  },
  {
    icon: LayoutDashboard,
    title: "Explore Your AI-Powered Dashboard",
    description: "Dive into your personalized dashboard to view market insights, trading recommendations, and performance metrics.",
  },
  {
    icon: BookOpen,
    title: "Use the Trading Journal",
    description: "Log your trades, add notes, and track your performance over time to identify patterns and areas for improvement.",
  },
  {
    icon: Bell,
    title: "Set Up Custom Alerts",
    description: "Configure alerts for specific market conditions, price movements, or risk thresholds to stay informed.",
  },
  {
    icon: BarChart2,
    title: "Analyze Your Performance",
    description: "Utilize our advanced analytics tools to gain deep insights into your trading patterns and overall performance.",
  },
  {
    icon: Zap,
    title: "Refine Your Strategy",
    description: "Continuously improve your trading strategy based on AI-generated insights and your personal trading journal data.",
  }
]

export default function WatchDemoPage() {
  const navigate = useNavigate()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(100)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isVolumeHovered, setIsVolumeHovered] = useState(false)
  const playerRef = useRef<any>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = function() {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'TgHcTailbao',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          controls: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume)
            setDuration(event.target.getDuration())
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          }
        }
      })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.onYouTubeIframeAPIReady = function() {}
      }
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime()
          setCurrentTime(currentTime)
          setProgress((currentTime / duration) * 100)
        }
      }, 1000)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying, duration])

  const handleProgressChange = (value: number | number[]) => {
    const progressValue = Array.isArray(value) ? value[0] : value
    setProgress(progressValue)
    if (playerRef.current?.seekTo) {
      const seekTime = (progressValue / 100) * duration
      playerRef.current.seekTo(seekTime, true)
    }
  }

  const handleVolumeChange = (value: number | number[]) => {
    const volumeValue = Math.round(Array.isArray(value) ? value[0] : value)
    setVolume(volumeValue)
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(volumeValue)
    }
  }

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const controlsElement = videoContainerRef.current?.querySelector('.video-controls')
    if (event.target !== controlsElement && !controlsElement?.contains(event.target as Node)) {
      togglePlay()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0E2E] to-[#0A0A0A] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-purple-950/20 to-black opacity-70" />
        <div className="absolute inset-0 bg-[url('/trading-pattern.svg')] bg-repeat opacity-10" />
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-3/4 -right-1/4 w-1/2 h-1/2 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10">
        <header className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Link to="/demo" className="flex items-center gap-4">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">TradeMind</span>
            </Link>
            <Link to="/demo" className="text-purple-300 hover:text-white transition-colors">
              <ArrowLeft className="inline-block mr-2" />
              Back to Home
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-8 py-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Experience TradeMind in Action
          </motion.h1>

          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#1A0E2E] to-[#0A0A0A] border-purple-800/30 shadow-lg overflow-hidden">
              <CardBody className="p-6">
                <div 
                  ref={videoContainerRef}
                  className="aspect-video bg-black rounded-lg mb-6 relative overflow-hidden group cursor-pointer"
                  onClick={handleVideoClick}
                >
                  <div id="youtube-player" className="w-full h-full absolute inset-0" />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 video-controls">
                      {/* Progress Bar */}
                      <div className="w-full">
                        <Slider
                          aria-label="Progress"
                          defaultValue={[progress]}
                          maxValue={100}
                          minValue={0}
                          step={0.1}
                          onChange={handleProgressChange}
                          className="w-full [&>span]:bg-purple-500 [&>span]:h-1"
                        />
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="light" 
                            size="sm"
                            onClick={togglePlay} 
                            className="text-white hover:text-purple-400 transition-colors"
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          <div 
                            className="flex items-center space-x-2 group"
                            onMouseEnter={() => setIsVolumeHovered(true)}
                            onMouseLeave={() => setIsVolumeHovered(false)}
                          >
                            <Button 
                              variant="light" 
                              size="sm"
                              className="text-white hover:text-purple-400 transition-colors"
                            >
                              {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <AnimatePresence>
                              {isVolumeHovered && (
                                <motion.div
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: 100, opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <Slider
                                    aria-label="Volume"
                                    defaultValue={[volume]}
                                    maxValue={100}
                                    minValue={0}
                                    step={1}
                                    onChange={handleVolumeChange}
                                    className="w-24 [&>span]:bg-purple-500 [&>span]:h-1"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                        <Button 
                          variant="light" 
                          size="sm"
                          onClick={toggleFullscreen} 
                          className="text-white hover:text-purple-400 transition-colors"
                        >
                          {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                  How to Use TradeMind
                </h2>
                <p className="text-lg text-purple-200 mb-6 text-center leading-relaxed max-w-3xl mx-auto">
                  TradeMind is designed to elevate your trading experience with AI-powered insights and comprehensive tools. 
                  Follow these steps to get started and make the most of our platform:
                </p>
                
                {/* How to Use Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="relative pt-4 pl-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="absolute -left-2 -top-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg">
                        {index + 1}
                      </div>
                      <Card className="bg-gradient-to-br from-[#2A1A4A] to-[#1A0E2E] border-purple-800/30 h-full hover:shadow-lg hover:border-purple-700/50 transition-all duration-300">
                        <CardBody className="p-4 flex flex-col h-full">
                          <div className="w-12 h-12 bg-purple-800/50 rounded-full flex items-center justify-center mb-3">
                            {React.createElement(step.icon, { className: "w-6 h-6 text-purple-200" })}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-purple-200">{step.title}</h3>
                          <p className="text-sm text-purple-300 flex-grow">{step.description}</p>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  )
}