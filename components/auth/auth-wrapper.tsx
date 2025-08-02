"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PageLoader } from "@/components/ui/loader"

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthWrapper({ 
  children, 
  fallback, 
  redirectTo = "/auth/signin" 
}: AuthWrapperProps) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push(redirectTo)
    }
  }, [session, isPending, router, redirectTo])

  if (isPending) {
    return fallback || <PageLoader />
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode
    redirectTo?: string
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthWrapper {...options}>
        <Component {...props} />
      </AuthWrapper>
    )
  }
}