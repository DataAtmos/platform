"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformFormField, PlatformAlert } from "@/components/ui/platform-form-field";
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
        
        // Redirect after a short delay
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
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Add hyphen after every 4 characters for better readability
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
    <div className="platform-auth-container">
      <div className="platform-auth-content platform-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 flex items-center justify-center">
              <Key className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Use backup code</h1>
          <p className="text-sm text-muted-foreground">
            Enter one of your backup codes to access your account
          </p>
        </div>
        
        <div className="space-y-6">
          {!success ? (
            <>
              <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  Each backup code can only be used once. After using a code, 
                  it will be permanently invalidated.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="platform-backup-code" className="text-sm font-medium">
                    Backup code *
                  </label>
                  <p className="text-xs text-muted-foreground">Enter the 8-character backup code from your saved list</p>
                  <Input
                    id="platform-backup-code"
                    type="text"
                    value={backupCode}
                    onChange={handleInputChange}
                    placeholder="XXXX-XXXX"
                    maxLength={9} // 8 characters + 1 hyphen
                    className="font-mono text-center text-lg tracking-wider"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="platform-trust-device"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                  />
                  <Label htmlFor="platform-trust-device" className="text-sm cursor-pointer">
                    Trust this device for 30 days
                  </Label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !backupCode.trim()}
                >
                  {isLoading ? "Verifying..." : "Verify backup code"}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-green-600">Verification successful</h3>
                <p className="text-sm text-muted-foreground">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </div>
          )}
        </div>

        {!success && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Link href="/auth/two-factor">
                <Button variant="ghost" size="sm" className="text-primary hover:underline flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to authenticator
                </Button>
              </Link>
              
              <Link href="/auth/signin">
                <Button variant="link" size="sm" className="text-primary hover:underline">
                  Sign in differently
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-sm">
                Don&apos;t have backup codes?{" "}
                <Link 
                  href="/auth/forgot-password" 
                  className="text-primary hover:underline"
                >
                  Reset your password
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}