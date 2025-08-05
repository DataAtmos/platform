"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/providers/theme-provider"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { useSession } from "@/lib/auth-client"

export function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const { theme } = useTheme()
  const logoSrc = theme === "dark" ? "/logo-white.svg" : "/logo.svg"

  const isAuthPage = pathname?.includes("/signup") || pathname?.includes("/signin")
  const marketingRoutes = ["/", "/about"]
  const isMarketingPage = marketingRoutes.includes(pathname || "")

  return (
    <header 
      className="sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-200"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(13, 17, 23, 0.85)'
          : 'rgba(246, 248, 250, 0.85)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(48, 54, 61, 0.5)' : 'rgba(208, 215, 222, 0.5)'}`
      }}
    >
      <div className="flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center group"
        >
          <div className="relative">
            <Image
              src={logoSrc}
              alt="Data Atmos"
              width={24}
              height={24}
              className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-200 group-hover:scale-110"
            />
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: theme === 'dark' 
                  ? 'radial-gradient(circle, rgba(219, 109, 40, 0.2) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(225, 111, 36, 0.15) 0%, transparent 70%)',
                filter: 'blur(8px)'
              }}
            />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isMarketingPage && (
                <div className="flex items-center gap-3">
                  <span 
                    className="text-sm hidden lg:block"
                    style={{
                      color: theme === 'dark' ? '#8b949e' : '#57606a'
                    }}
                  >
                    Welcome back, <span 
                      className="font-medium"
                      style={{
                        color: theme === 'dark' ? '#f0f6fc' : '#24292f'
                      }}
                    >{user.name}</span>
                  </span>
                  <Button 
                    asChild 
                    size="sm" 
                    variant="ghost"
                    className="hover:bg-orange-500/10 hover:text-primary transition-colors duration-200"
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(48, 54, 61, 0.8)' : 'rgba(208, 215, 222, 0.8)'
                    }}
                  >
                    <Link href="/console">Console</Link>
                  </Button>
                </div>
              )}
              <UserDropdown user={user} />
            </>
          ) : (
            <>
              {!isAuthPage && isMarketingPage && (
                <Button 
                  asChild 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Link href="/console">Open Console</Link>
                </Button>
              )}
            </>
          )}
          <div className="h-6 w-px bg-border/50 hidden sm:block" />
          <ThemeSwitcher className="scale-75 sm:scale-90 transition-transform duration-200 hover:scale-100" />
        </div>
      </div>
    </header>
  )
}