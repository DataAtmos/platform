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
          handleSignUp()
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !name || !email || !password}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Create Account"
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

      <GoogleSignInButton />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
