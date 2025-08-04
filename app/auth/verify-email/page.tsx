import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo";
import Link from "next/link";
import GradientBackground from '@/components/animation/gradient-background';
import { ArrowLeft, Mail } from "lucide-react";

function VerifyEmailContent({ searchParams }: { searchParams: { message?: string; error?: string } }) {
  const { message, error } = searchParams;

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center mb-8">
            <ThemeAwareLogo width={35} height={35} />
            <span className="ml-2 text-2xl font-bold text-gray-900">Data Atmos</span>
          </div>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-600 mb-6">
              We&apos;ve sent you a verification link
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <span className="text-sm text-red-700">{decodeURIComponent(error)}</span>
            </div>
          )}

          {message === "verification-sent" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <span className="text-sm text-green-700">
                A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.
              </span>
            </div>
          )}

          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-600 text-center">
              Didn&apos;t receive the email? Check your spam folder or try signing up again.
            </p>
            
            <div className="space-y-3 text-center">
              <Link
                href="/auth/signin"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                Back to Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                Try signing up again
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <GradientBackground />
      </div>
    </div>
  );
}

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmailContent searchParams={params} />
    </Suspense>
  );
}