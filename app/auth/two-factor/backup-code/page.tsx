"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client } from "@/lib/auth-client";
import { 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  ArrowLeft,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo";
import GradientBackground from '@/components/animation/gradient-background';

export default function BackupCodeVerificationPage() {
  const [backupCode, setBackupCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!backupCode.trim()) {
      setError("Please enter a backup code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await client.twoFactor.verifyBackupCode({
        code: backupCode.trim(),
        trustDevice: trustDevice,
      });

      if (response.data) {
        setSuccess(true);
        toast.success("Backup code verified successfully");
        
        setTimeout(() => {
          router.push("/console");
        }, 1500);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid backup code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBackupCode = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBackupCode(e.target.value);
    setBackupCode(formatted);
    setError("");
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
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
              <Key className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Use backup code</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter one of your backup codes to access your account
            </p>
          </div>
          
          <div className="mt-8">
            <div className="space-y-6">
              {!success ? (
                <>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-700">
                        Each backup code can only be used once. After using a code, 
                        it will be permanently invalidated.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="platform-backup-code" className="block text-sm font-medium text-gray-700">
                        Backup code
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Enter the 8-character backup code from your saved list</p>
                      <div className="mt-1">
                        <Input
                          id="platform-backup-code"
                          type="text"
                          value={backupCode}
                          onChange={handleInputChange}
                          placeholder="XXXX-XXXX"
                          maxLength={9}
                          className="font-mono text-center text-lg tracking-wider appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="platform-trust-device"
                        checked={trustDevice}
                        onChange={(e) => setTrustDevice(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="platform-trust-device" className="ml-2 text-sm cursor-pointer">
                        Trust this device for 30 days
                      </Label>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" 
                      disabled={isLoading || !backupCode.trim()}
                    >
                      {isLoading ? "Verifying..." : "Verify backup code"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-green-600">Verification successful</h3>
                    <p className="text-sm text-gray-600">
                      Redirecting you to your dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!success && (
            <div className="mt-8 space-y-4 pt-6 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <Link href="/auth/two-factor">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-500 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to authenticator
                  </Button>
                </Link>
                
                <Link href="/auth/signin">
                  <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-500">
                    Sign in differently
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have backup codes?{" "}
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Reset your password
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <GradientBackground />
      </div>
    </div>
  );
}