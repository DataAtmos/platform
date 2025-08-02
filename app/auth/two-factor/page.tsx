"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatformFormField, PlatformAlert } from "@/components/ui/platform-form-field";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TwoFactorPage() {
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/console");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totpCode.length !== 6 || !/^\d+$/.test(totpCode)) {
      setError("TOTP code must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await client.twoFactor.verifyTotp({
        code: totpCode,
      });
      
      if (result.data?.token) {
        router.push("/console");
      } else {
        setError("Invalid TOTP code");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid TOTP code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Two-factor authentication</h1>
          <p className="text-sm text-muted-foreground">Enter your 6-digit code</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="totp" className="text-sm font-medium">
              Authentication code
            </label>
            <Input
              id="totp"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              placeholder="000000"
              autoComplete="one-time-code"
              className="text-center text-lg tracking-widest font-mono"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || totpCode.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        
        <div className="mt-8 space-y-3 text-center">
          <Link href="/auth/two-factor/backup-code" className="text-primary hover:underline text-sm">
            Use backup code
          </Link>
          
          <div>
            <Link href="/auth/two-factor/otp">
              <Button variant="ghost" className="w-full text-sm">
                Use email verification instead
              </Button>
            </Link>
          </div>
          
          <div className="pt-4">
            <Link href="/auth/signin" className="text-primary hover:underline text-sm">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}