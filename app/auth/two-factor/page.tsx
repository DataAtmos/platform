"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlatformFormField, PlatformAlert } from "@/components/ui/platform-form-field";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, Key, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TwoFactorPage() {
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect authenticated users to console
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
      <div className="platform-auth-card platform-space-y-lg platform-fade-in">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-platform-accent-emphasis rounded-full flex items-center justify-center p-2">
            <svg width="24" height="24" viewBox="-250 350 100 100" fill="currentColor" className="text-platform-fg-on-emphasis">
              <path d="M-167.5,390.5c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2C-165.5,389.6-166.4,390.5-167.5,390.5z   M-177.5,428.5c-2.2,0-4-1.8-4-4s1.8-4,4-4c2.2,0,4,1.8,4,4S-175.3,428.5-177.5,428.5z M-177.5,410.5c-2.2,0-4-1.8-4-4s1.8-4,4-4  c2.2,0,4,1.8,4,4S-175.3,410.5-177.5,410.5z M-177.5,392.5c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4  C-173.5,390.7-175.3,392.5-177.5,392.5z M-177.5,374.5c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4  C-173.5,372.7-175.3,374.5-177.5,374.5z M-194.5,414.5c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7c3.9,0,7,3.1,7,7  C-187.5,411.4-190.6,414.5-194.5,414.5z M-194.5,394.5c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7c3.9,0,7,3.1,7,7  C-187.5,391.4-190.6,394.5-194.5,394.5z M-195.5,374.5c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4  C-191.5,372.7-193.3,374.5-195.5,374.5z M-195.5,362.5c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2  C-193.5,361.6-194.4,362.5-195.5,362.5z M-214.5,414.5c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7s7,3.1,7,7  C-207.5,411.4-210.6,414.5-214.5,414.5z M-214.5,394.5c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7s7,3.1,7,7  C-207.5,391.4-210.6,394.5-214.5,394.5z M-213.5,374.5c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4  C-209.5,372.7-211.3,374.5-213.5,374.5z M-213.5,362.5c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2  C-211.5,361.6-212.4,362.5-213.5,362.5z M-231.5,374.5c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4  C-227.5,372.7-229.3,374.5-231.5,374.5z M-231.5,384.5c2.2,0,4,1.8,4,4c0,2.2-1.8,4-4,4c-2.2,0-4-1.8-4-4  C-235.5,386.3-233.7,384.5-231.5,384.5z M-241.5,408.5c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2  C-239.5,407.6-240.4,408.5-241.5,408.5z M-241.5,390.5c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2  C-239.5,389.6-240.4,390.5-241.5,390.5z M-231.5,402.5c2.2,0,4,1.8,4,4s-1.8,4-4,4c-2.2,0-4-1.8-4-4S-233.7,402.5-231.5,402.5z   M-231.5,420.5c2.2,0,4,1.8,4,4s-1.8,4-4,4c-2.2,0-4-1.8-4-4S-233.7,420.5-231.5,420.5z M-213.5,420.5c2.2,0,4,1.8,4,4  c0,2.2-1.8,4-4,4c-2.2,0-4-1.8-4-4C-217.5,422.3-215.7,420.5-213.5,420.5z M-213.5,432.5c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2  c-1.1,0-2-0.9-2-2C-215.5,433.4-214.6,432.5-213.5,432.5z M-195.5,420.5c2.2,0,4,1.8,4,4c0,2.2-1.8,4-4,4c-2.2,0-4-1.8-4-4  C-199.5,422.3-197.7,420.5-195.5,420.5z M-195.5,432.5c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2c-1.1,0-2-0.9-2-2  C-197.5,433.4-196.6,432.5-195.5,432.5z M-167.5,404.5c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2c-1.1,0-2-0.9-2-2  C-169.5,405.4-168.6,404.5-167.5,404.5z" 
                fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </div>
          </div>
          <h1 className="platform-heading-xl">Two-factor authentication</h1>
          <p className="platform-text-muted">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <PlatformAlert variant="danger" className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </PlatformAlert>
          )}

          <PlatformFormField
            label="Authentication code"
            htmlFor="platform-totp"
            required
            helpText="6 digits from your authenticator app"
          >
            <Input
              id="platform-totp"
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
          </PlatformFormField>

          <Button 
            type="submit" 
            className="w-full platform-btn-primary" 
            size="lg"
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
        
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-platform-border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-platform-canvas-default px-3 text-platform-fg-muted font-medium">
                Trouble signing in?
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Link href="/auth/two-factor/backup-code">
              <Button variant="outline" className="w-full platform-btn-outline">
                <Key className="h-4 w-4 mr-2" />
                Use backup code
              </Button>
            </Link>
            
            <Link href="/auth/two-factor/otp">
              <Button variant="ghost" className="w-full">
                Use email verification instead
              </Button>
            </Link>
          </div>
          
          <div className="text-center pt-2">
            <Link href="/auth/signin" className="platform-link text-sm">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}