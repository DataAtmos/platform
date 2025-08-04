'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/providers/theme-provider'

export default function GradientBackground() {
  const { theme } = useTheme()
  const [offset, setOffset] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % 360)
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  // Default to light theme until mounted to prevent hydration mismatch
  const isDark = mounted && theme === 'dark'

  // Define theme-specific colors
  const colors = isDark ? {
    primary: 'rgba(99,160,255,0.4)',
    secondary: 'rgba(147,197,253,0.3)',
    accent: 'rgba(59,130,246,0.2)',
    overlay: 'rgba(255,255,255,0.03)',
    gridColor: 'rgba(255,255,255,0.08)',
    patternColor: 'rgba(255,255,255,0.05)',
    dotColor: 'rgba(255,255,255,0.06)'
  } : {
    primary: 'rgba(255,255,255,0.8)',
    secondary: 'rgba(99,160,255,0.5)',
    accent: 'rgba(50,50,100,0.2)',
    overlay: 'rgba(255,255,255,0.1)',
    gridColor: 'rgba(255,255,255,0.15)',
    patternColor: 'rgba(255,255,255,0.1)',
    dotColor: 'rgba(255,255,255,0.1)'
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main animated gradient */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `
            linear-gradient(${offset}deg, ${colors.primary}, ${colors.secondary}),
            linear-gradient(${offset + 120}deg, ${colors.secondary}, ${colors.accent}),
            linear-gradient(${offset + 240}deg, ${colors.accent}, ${colors.primary})
          `,
          backgroundBlendMode: isDark ? 'screen' : 'overlay',
          filter: isDark ? 'contrast(120%) brightness(130%)' : 'contrast(150%) brightness(110%)',
        }}
      />
      
      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, ${colors.dotColor} 5%, transparent 5%),
            radial-gradient(circle at 25% 25%, ${colors.dotColor} 2%, transparent 2%),
            radial-gradient(circle at 75% 75%, ${colors.dotColor} 3%, transparent 3%)
          `,
          backgroundSize: '50px 50px, 30px 30px, 40px 40px',
          backgroundBlendMode: isDark ? 'overlay' : 'screen',
          filter: isDark ? 'contrast(150%)' : 'contrast(200%)',
        }}
      />
      
      {/* Texture overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="roughFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="5" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23roughFilter)"/%3E%3C/svg%3E")',
          opacity: isDark ? 0.08 : 0.15,
          mixBlendMode: isDark ? 'soft-light' : 'multiply',
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${colors.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${colors.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
        }}
      />
      
      {/* Diagonal pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${colors.patternColor} 25%, transparent 25%, transparent 75%, ${colors.patternColor} 75%, ${colors.patternColor}),
            linear-gradient(-45deg, ${colors.patternColor} 25%, transparent 25%, transparent 75%, ${colors.patternColor} 75%, ${colors.patternColor})
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
        }}
      />
      
      {/* Additional glow effect for dark theme */}
      {isDark && (
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 30%, rgba(99,160,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, rgba(147,197,253,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)
            `,
            backgroundBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}