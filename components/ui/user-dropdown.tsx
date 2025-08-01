"use client"

import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface UserDropdownProps {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 p-0 hover:bg-platform-header-fg/10">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-xs bg-platform-accent-emphasis text-platform-fg-on-emphasis font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-platform-canvas-default border border-platform-border-default"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-4 border-b border-platform-border-muted">
          <div className="space-y-1">
            <p className="platform-text-sm font-medium text-platform-fg-default">{user.name}</p>
            <p className="platform-text-xs text-platform-fg-muted">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <div className="p-1">
          <DropdownMenuItem asChild className="p-0">
            <a
              href="/profile"
              className="flex items-center px-3 py-2 platform-text-sm text-platform-fg-default hover:bg-platform-canvas-subtle cursor-pointer transition-colors"
            >
              <User className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-platform-border-muted mx-2" />
        <div className="p-1">
          <DropdownMenuItem
            className="px-3 py-2 platform-text-sm text-platform-danger-fg hover:bg-platform-danger-subtle hover:text-platform-danger-fg cursor-pointer transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
