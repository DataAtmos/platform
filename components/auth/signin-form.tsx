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
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSignIn()
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              autoComplete="email"
              aria-describedby={errorMessage ? "email-error" : undefined}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              autoComplete="current-password"
              aria-describedby={errorMessage ? "password-error" : undefined}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer select-none text-foreground">
              Remember me
            </Label>
          </div>
          <Link href="/auth/forgot-password" className="text-primary hover:text-primary/80 text-sm font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full relative"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <GoogleSignInButton showLastUsed={lastAuthMethod === "google"} />
        <PasskeySignInButton showLastUsed={lastAuthMethod === "passkey"} />
      </div>
    </div>
  )
}
