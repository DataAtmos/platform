"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, AlertCircle } from "lucide-react"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"
import Link from "next/link"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  if (!token) {
    return (
      <div className="platform-auth-container">
        <div className="platform-auth-content platform-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Invalid Reset Link</h1>
            <p className="text-sm text-muted-foreground">This password reset link is invalid or has expired.</p>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 text-red-700 mb-6">
            <span className="text-sm">
              Invalid or missing reset token. Please request a new password reset link.
            </span>
          </div>

          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm">
              Request new reset link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const res = await client.resetPassword({
        newPassword: password,
        token: token,
      })

      if (res.error) {
        setError(res.error.message || "Failed to reset password")
      } else {
        router.push("/auth/signin?message=password-reset-success")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ThemeAwareLogo width={32} height={32} className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-8"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-8"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || password !== confirmPassword}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                <span className="text-sm">Resetting...</span>
              </>
            ) : (
              <span className="text-sm">Reset Password</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="platform-auth-container">
          <div className="platform-auth-content">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
