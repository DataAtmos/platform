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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src={logoSrc}
            alt="Data Atmos"
            width={24}
            height={24}
            className="h-6 w-6 sm:h-7 sm:w-7"
          />
        </Link>

        <div className="flex items-center gap-3">
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
          <ThemeSwitcher className="scale-75 sm:scale-100" />
        </div>
      </div>
    </header>
  )
}