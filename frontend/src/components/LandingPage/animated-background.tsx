'use client'

import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 opacity-50" />
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <g className="opacity-20">
          <motion.path
            d="M0 400 Q200 350, 400 400 T800 350"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M0 450 Q200 400, 400 450 T800 400"
            fill="none"
            stroke="url(#grad2)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
        </g>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-10 left-10 text-purple-300 opacity-20 animate-float">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 text-pink-300 opacity-20 animate-float animation-delay-2000">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      </div>
    </div>
  )
}
