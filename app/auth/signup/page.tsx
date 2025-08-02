import { redirect } from "next/navigation"
import { AuthService } from "@/lib/services/auth-service"
import { SignUpForm } from "@/components/auth/signup-form"
import { Suspense } from "react"
import { Loader } from "@/components/ui/loader"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"

async function SignUpContent({ searchParams }: { searchParams: { error?: string; message?: string } }) {
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
          <h1 className="text-2xl font-semibold mb-2">Join Data Atmos</h1>
          <p className="text-sm text-muted-foreground">Create your account to get started with the platform</p>
        </div>

        <SignUpForm
          error={error ? decodeURIComponent(error) : undefined}
          message={message ? decodeURIComponent(message) : undefined}
        />

        <div className="text-center pt-6 mt-6 border-t border-border">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function SignUpPage({
  searchParams,
}: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams

  return (
    <Suspense fallback={<Loader />}>
      <SignUpContent searchParams={params} />
    </Suspense>
  )
}
