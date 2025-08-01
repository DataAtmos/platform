"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { useSession } from "@/lib/auth-client"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const { theme } = useTheme()

  const isAuthPage = pathname?.includes("/signup") || pathname?.includes("/signin")
  const marketingRoutes = ["/", "/about"]
  const isMarketingPage = marketingRoutes.includes(pathname || "")

  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg"

  return (
    <header className="platform-header fixed top-0 left-0 right-0 z-50 w-full">
      <div className="platform-container flex h-12 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 platform-transition">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src={logoSrc} alt="Data Atmos" width={24} height={24} className="w-6 h-6" />
            </div>
          </Link>
        </div>

        <nav className="platform-nav flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              {isMarketingPage && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="platform-text-small text-platform-header-fg/80 whitespace-nowrap hidden md:block">
                    Welcome back, <span className="text-platform-header-fg font-medium">{user.name}</span>
                  </span>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="platform-btn platform-btn-outline border-platform-header-border text-platform-header-fg hover:bg-platform-header-fg hover:text-platform-header-bg platform-text-xs px-2 py-1 bg-transparent"
                  >
                    <Link href="/console">Console</Link>
                  </Button>
                </div>
              )}
              <UserDropdown user={user} />
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              {!isAuthPage && isMarketingPage && (
                <Button asChild size="sm" className="platform-btn platform-btn-primary mr-2 platform-text-xs px-2 py-1">
                  <Link href="/console">Open Console</Link>
                </Button>
              )}
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
