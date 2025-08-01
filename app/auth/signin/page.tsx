import { redirect } from "next/navigation"
import { AuthService } from "@/lib/services/auth-service"
import { SignInForm } from "@/components/auth/signin-form"
import { Suspense } from "react"
import { Loader } from "@/components/ui/loader"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"

async function SignInContent({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const session = await AuthService.getSession()
  if (session) {
    redirect("/console")
  }

  const { error, message } = searchParams

  return (
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ThemeAwareLogo width={32} height={32} className="w-8 h-8" />
          </div>
          <h1 className="platform-heading-lg mb-2">Sign in to Data Atmos</h1>
          <p className="platform-text-muted">Welcome back! Please sign in to your account</p>
        </div>

        <SignInForm
          error={error ? decodeURIComponent(error) : undefined}
          message={message ? decodeURIComponent(message) : undefined}
        />

        <div className="text-center pt-6 mt-6 border-t border-platform-border-muted">
          <p className="platform-text-small">
            New to Data Atmos?{" "}
            <a href="/auth/signup" className="platform-link font-medium">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function SignInPage({
  searchParams,
}: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams

  return (
    <Suspense fallback={<Loader />}>
      <SignInContent searchParams={params} />
    </Suspense>
  )
}
