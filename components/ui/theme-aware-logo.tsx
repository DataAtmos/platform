"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
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

  if (!mounted) {
    return <Image src="/logo.svg" alt="Data Atmos" width={width} height={height} className={className} />
  }

  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg"

  return (
    <Image src={logoSrc || "/placeholder.svg"} alt="Data Atmos" width={width} height={height} className={className} />
  )
}
