"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"
import Link from "next/link"
import GradientBackground from '@/components/animation/gradient-background'

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
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            <div className="flex items-center mb-8">
              <ThemeAwareLogo width={35} height={35} />
              <span className="ml-2 text-2xl font-bold text-foreground">Data Atmos</span>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This password reset link is invalid or has expired.
              </p>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-6">
                <span className="text-sm text-red-700 dark:text-red-300">
                  Invalid or missing reset token. Please request a new password reset link.
                </span>
              </div>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-primary hover:text-primary/80 text-sm">
                  Request new reset link
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block relative w-0 flex-1">
          <GradientBackground />
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
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center mb-8">
            <ThemeAwareLogo width={35} height={35} />
            <span className="ml-2 text-2xl font-bold text-foreground">Data Atmos</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enter your new password below</p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
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
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Resetting...</span>
                  </>
                ) : (
                  <span className="text-sm">Reset Password</span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signin" className="text-primary hover:text-primary/80 text-sm">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <GradientBackground />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-background">
          <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
