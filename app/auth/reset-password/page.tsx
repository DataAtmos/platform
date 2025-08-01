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
              <AlertCircle className="h-12 w-12 text-platform-danger-emphasis" />
            </div>
            <h1 className="platform-heading-lg mb-2">Invalid Reset Link</h1>
            <p className="platform-text-muted">This password reset link is invalid or has expired.</p>
          </div>

          <div className="platform-alert platform-alert-danger mb-6">
            <span className="platform-text-small">
              Invalid or missing reset token. Please request a new password reset link.
            </span>
          </div>

          <div className="text-center">
            <Link href="/auth/forgot-password" className="platform-link platform-text-small">
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
          <h1 className="platform-heading-lg mb-2">Reset your password</h1>
          <p className="platform-text-muted">Enter your new password below</p>
        </div>

        {error && (
          <div className="platform-alert platform-alert-danger mb-6">
            <span className="platform-text-small">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="platform-form-field">
            <label htmlFor="password" className="platform-form-label">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-platform-fg-muted" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="platform-input pl-8"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="platform-form-field">
            <label htmlFor="confirmPassword" className="platform-form-label">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-platform-fg-muted" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="platform-input pl-8"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || password !== confirmPassword}
            className="w-full platform-btn platform-btn-primary platform-btn-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                <span className="platform-text-small">Resetting...</span>
              </>
            ) : (
              <span className="platform-text-small">Reset Password</span>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/auth/signin" className="platform-link platform-text-small">
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
