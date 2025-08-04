"use client"

import Image from "next/image"
import { useTheme } from "@/lib/providers/theme-provider"
import { useEffect, useState } from "react"

interface ThemeAwareLogoProps {
  width: number
  height: number
  className?: string
}

export function ThemeAwareLogo({ width, height, className }: ThemeAwareLogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default to light theme logo until mounted to prevent hydration mismatch
  const logoSrc = mounted && theme === "dark" ? "/logo-white.svg" : "/logo.svg"

  return (
    <Image 
      src={logoSrc} 
      alt="Data Atmos" 
      width={width} 
      height={height} 
      className={className} 
    />
  )
}
