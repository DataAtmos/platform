"use client"

import { Button } from "@/components/ui/button"
import { client, useSession } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Fingerprint } from "lucide-react"
import { saveLastAuthMethod } from "@/lib/last-auth-method"
import { LastUsedBadge } from "@/components/ui/last-used-badge"

interface PasskeySignInButtonProps {
  showLastUsed?: boolean
}

export function PasskeySignInButton({ showLastUsed = false }: PasskeySignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refetch } = useSession()

  const handlePasskeySignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      await client.signIn.passkey({
        fetchOptions: {
          onSuccess: async () => {
            saveLastAuthMethod("passkey")
            await refetch()
            router.push("/console")
          },
          onError: (ctx) => {
            console.error("Passkey sign-in error:", ctx.error)
            setError(ctx.error.message || "Passkey authentication failed")
            setLoading(false)
          },
        },
      })
    } catch (error) {
      console.error("Passkey sign-in error:", error)
      setError("Passkey authentication failed")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handlePasskeySignIn}
        disabled={loading}
        className="w-full relative platform-btn platform-btn-outline platform-btn-md bg-transparent"
      >
        {loading ? (
          <>
            <Loader2 size={12} className="animate-spin mr-2" />
            <span className="platform-text-small">Authenticating...</span>
          </>
        ) : (
          <>
            <Fingerprint className="w-4 h-4 mr-2" />
            <span className="platform-text-small">Sign in with Passkey</span>
            <LastUsedBadge show={showLastUsed} className="absolute -top-1 -right-1" />
          </>
        )}
      </Button>
      {error && (
        <div className="platform-alert platform-alert-danger">
          <span className="platform-text-small">{error}</span>
        </div>
      )}
    </div>
  )
}
