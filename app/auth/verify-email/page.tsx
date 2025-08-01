import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

function VerifyEmailContent({ searchParams }: { searchParams: { message?: string; error?: string } }) {
  const { message, error } = searchParams;

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground mt-2">
            We&apos;ve sent you a verification link
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            {decodeURIComponent(error)}
          </Alert>
        )}

        {message === "verification-sent" && (
          <Alert>
            A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>
          
          <div className="space-y-2">
            <a
              href="/auth/signin"
              className="block text-sm text-primary hover:underline"
            >
              Back to Sign In
            </a>
            <a
              href="/auth/signup"
              className="block text-sm text-primary hover:underline"
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