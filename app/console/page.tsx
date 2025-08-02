import { AuthWrapper } from "@/components/auth/auth-wrapper";

function ConsoleContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">
            You don&apos;t have necessary permissions to access this page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConsolePage() {
  return (
    <AuthWrapper>
      <ConsoleContent />
    </AuthWrapper>
  );
}