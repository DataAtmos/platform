"use client"

import { LogOut, User, HelpCircle } from "lucide-react"
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
        <Button variant="ghost" className="relative h-8 w-8 p-0 hover:bg-accent focus-ring transition-all duration-200">
          <Avatar className="profile-avatar h-7 w-7">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-github w-72 p-2" align="end" forceMount sideOffset={8}>
        <DropdownMenuLabel className="p-3 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="profile-avatar h-10 w-10">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <div className="py-1">
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/profile" className="flex items-center px-3 py-2 text-sm transition-colors hover:bg-accent">
              <User className="mr-3 h-4 w-4" />
              <span>Profile Settings</span>
            </a>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="py-1">
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-accent">
            <HelpCircle className="mr-3 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="py-1">
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
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
