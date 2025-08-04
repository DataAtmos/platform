import { redirect } from "next/navigation"
import { AuthService } from "@/lib/services/auth-service"
import { SignUpForm } from "@/components/auth/signup-form"
import { Suspense } from "react"
import { Loader } from "@/components/ui/loader"
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo"
import GradientBackground from '@/components/animation/gradient-background'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function SignUpContent({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const session = await AuthService.getSession()
  if (session) {
    redirect("/console")
  }

  const { error, message } = searchParams

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
            <h2 className="text-3xl font-extrabold text-foreground">Create an account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Or{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <SignUpForm
              error={error ? decodeURIComponent(error) : undefined}
              message={message ? decodeURIComponent(message) : undefined}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
          {' '}&bull;{' '}
          <Link href="/terms-of-use" className="hover:text-foreground">Terms of Use</Link>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <GradientBackground />
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
