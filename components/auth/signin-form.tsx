"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { PasskeySignInButton } from "@/components/auth/passkey-signin-button"
import { signIn } from "@/lib/auth-client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { getLastAuthMethod, saveLastAuthMethod, type AuthMethod } from "@/lib/last-auth-method"
import { LastUsedBadge } from "@/components/ui/last-used-badge"

interface SignInFormProps {
  error?: string
  message?: string
}

export function SignInForm({ error, message }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState(error || "")
  const [successMessage, setSuccessMessage] = useState(message || "")
  const [lastAuthMethod, setLastAuthMethod] = useState<AuthMethod | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLastAuthMethod(getLastAuthMethod())
  }, [])

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    await signIn.email({
      email,
      password,
      callbackURL: "/console",
      rememberMe,
      fetchOptions: {
        onRequest: () => {
          setLoading(true)
        },
        onResponse: () => {
          setLoading(false)
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message || "Authentication failed")
        },
        onSuccess: () => {
          saveLastAuthMethod("email")
          router.push("/console")
        },
      },
    })
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="platform-alert platform-alert-danger flex items-center gap-2">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span className="platform-text-small">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="platform-alert platform-alert-success flex items-center gap-2">
          <CheckCircle className="h-3 w-3 flex-shrink-0" />
          <span className="platform-text-small">{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSignIn()
        }}
        className="space-y-4"
      >
        <div className="platform-form-field">
          <label htmlFor="platform-email" className="platform-form-label">
            Email address *
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-platform-fg-muted" />
            <Input
              id="platform-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="platform-input pl-8"
              autoComplete="email"
              aria-describedby={errorMessage ? "email-error" : undefined}
            />
          </div>
        </div>

        <div className="platform-form-field">
          <label htmlFor="platform-password" className="platform-form-label">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-platform-fg-muted" />
            <Input
              id="platform-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="platform-input pl-8"
              autoComplete="current-password"
              aria-describedby={errorMessage ? "password-error" : undefined}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="platform-remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="platform-remember" className="platform-text-small cursor-pointer select-none">
              Remember me
            </Label>
          </div>
          <Link href="/auth/forgot-password" className="platform-link platform-text-small font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full relative platform-btn platform-btn-primary platform-btn-md"
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to Data Atmos
              <LastUsedBadge show={lastAuthMethod === "email"} className="absolute -top-1 -right-1" />
            </>
          )}
        </Button>
      </form>

      <div className="platform-separator">
        <span className="platform-separator-text">or continue with</span>
      </div>

      <div className="space-y-3">
        <GoogleSignInButton showLastUsed={lastAuthMethod === "google"} />
        <PasskeySignInButton showLastUsed={lastAuthMethod === "passkey"} />
      </div>
    </div>
  )
}
