import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

function VerifyEmailContent({ searchParams }: { searchParams: { message?: string; error?: string } }) {
  const { message, error } = searchParams;

  return (
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a verification link
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 mb-6">
            <span className="text-sm">{decodeURIComponent(error)}</span>
          </div>
        )}

        {message === "verification-sent" && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 mb-6">
            <span className="text-sm">
              A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.
            </span>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>
          
          <div className="space-y-2">
            <a
              href="/auth/signin"
              className="block text-primary hover:underline text-sm"
            >
              Back to Sign In
            </a>
            <a
              href="/auth/signup"
              className="block text-primary hover:underline text-sm"
            >
              Try signing up again
            </a>
          </div>
        </div>
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