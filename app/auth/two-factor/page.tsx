"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, Loader2, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo";
import GradientBackground from '@/components/animation/gradient-background';

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
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Two-factor authentication</h2>
            <p className="text-sm text-gray-600 mb-6">Enter your 6-digit code</p>
          </div>
          
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="totp" className="block text-sm font-medium text-gray-700">
                  Authentication code
                </label>
                <div className="mt-1">
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
                    className="text-center text-lg tracking-widest font-mono appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" 
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
          </div>
          
          <div className="mt-8 space-y-4 pt-6 border-t border-gray-300">
            <div className="space-y-3 text-center">
              <Link href="/auth/two-factor/backup-code" className="text-blue-600 hover:text-blue-500 text-sm">
                Use backup code
              </Link>
              
              <div>
                <Link href="/auth/two-factor/otp">
                  <Button variant="ghost" className="w-full text-sm">
                    Use email verification instead
                  </Button>
                </Link>
              </div>
              
              <div className="pt-2">
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 text-sm">
                  ← Back to sign in
                </Link>
              </div>
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