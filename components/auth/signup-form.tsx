"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { signUp } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle, User, Mail, Lock } from "lucide-react"

interface SignUpFormProps {
  error?: string
  message?: string
}

export function SignUpForm({ error, message }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(error || "")
  const [successMessage, setSuccessMessage] = useState(message || "")
  const router = useRouter()

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields")
      return
    }

    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    await signUp.email({
      name,
      email,
      password,
      callbackURL: "/console",
      fetchOptions: {
        onRequest: () => {
          setLoading(true)
        },
        onResponse: () => {
          setLoading(false)
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message || "Registration failed")
        },
        onSuccess: () => {
          setSuccessMessage("Account created successfully! Please check your email for verification.")
          router.push("/auth/verify-email?message=verification-sent")
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
          handleSignUp()
        }}
        className="space-y-4"
      >
        <div className="platform-form-field">
          <label htmlFor="platform-name" className="platform-form-label">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-platform-fg-muted" />
            <Input
              id="platform-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="platform-input pl-8"
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="platform-input pl-8"
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !name || !email || !password}
          className="w-full platform-btn platform-btn-primary platform-btn-md"
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="platform-separator">
        <span className="platform-separator-text">or continue with</span>
      </div>

      <GoogleSignInButton />

      <div className="text-center">
        <p className="platform-text-small text-platform-fg-muted">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="platform-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="platform-link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
