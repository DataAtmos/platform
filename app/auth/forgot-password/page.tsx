"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/auth-client"
import { Loader2, CheckCircle2, Mail, ArrowLeft } from "lucide-react"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await client.requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      })
      setIsSubmitted(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="platform-auth-container">
        <div className="platform-auth-content platform-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground">We&apos;ve sent a password reset link to your email.</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 text-green-700 mb-6">
            <p className="text-sm">If you don&apos;t see the email, check your spam folder.</p>
          </div>

          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full mb-4"
          >
            <ArrowLeft className="h-3 w-3 mr-2" />
            <span className="text-sm">Back to reset password</span>
          </Button>

          <div className="text-center">
            <Link href="/auth/signin" className="text-primary hover:underline text-sm">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ThemeAwareLogo width={32} height={32} className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address *
            </label>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              <span className="text-sm">Send Reset Link</span>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/auth/signin" className="text-primary hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
