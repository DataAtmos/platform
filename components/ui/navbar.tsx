"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { useSession } from "@/lib/auth-client"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = pathname?.includes("/signup") || pathname?.includes("/signin")
  const marketingRoutes = ["/", "/about"]
  const isMarketingPage = marketingRoutes.includes(pathname || "")

  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={logoSrc || "/placeholder.svg"} alt="Data Atmos" width={24} height={24} className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {isMarketingPage && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground hidden lg:block">
                        Welcome back, <span className="text-foreground font-medium">{user.name}</span>
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/console">Console</Link>
                      </Button>
                    </div>
                  )}
                  <UserDropdown user={user} />
                </>
              ) : (
                <>
                  {!isAuthPage && isMarketingPage && (
                    <Button asChild size="sm">
                      <Link href="/console">Open Console</Link>
                    </Button>
                  )}
                </>
              )}
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2 md:hidden">
              {user && <UserDropdown user={user} />}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="px-5 py-4">
              <nav className="flex flex-col gap-2">
                {user ? (
                  <>
                    {isMarketingPage && (
                      <Button asChild variant="outline" className="justify-start bg-transparent">
                        <Link href="/console" onClick={() => setMobileMenuOpen(false)}>
                          Console
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {!isAuthPage && isMarketingPage && (
                      <Button asChild className="justify-start">
                        <Link href="/console" onClick={() => setMobileMenuOpen(false)}>
                          Open Console
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
      <div className="w-full text-center text-[11px] py-1 px-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-800">
        Notice: Free MySQL server in use; performance might be slow.
      </div>
    </>
  )
}
