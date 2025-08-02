"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect authenticated users to console
  useEffect(() => {
    if (!isPending && session) {
      router.push("/console");
    }
  }, [session, isPending, router]);

  const requestOTP = async () => {
    setLoading(true);
    try {
      await client.twoFactor.sendOtp();
      setMessage("OTP sent to your email");
      setIsError(false);
      setIsOtpSent(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const validateOTP = async () => {
    setLoading(true);
    try {
      const result = await client.twoFactor.verifyOtp({
        code: otp,
      });
      
      if (result.data) {
        setMessage("OTP validated successfully");
        setIsError(false);
        router.push("/console");
      } else {
        setIsError(true);
        setMessage("Invalid OTP");
      }
    } catch (error: unknown) {
      setIsError(true);
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h1>
            <p className="text-sm text-muted-foreground">
              Verify your identity with a one-time password
            </p>
          </div>
          
          <div className="space-y-6">
            {message && (
              <Alert variant={isError ? "destructive" : "default"}>
                {isError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {!isOtpSent ? (
              <Button 
                onClick={requestOTP} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" /> 
                {loading ? "Sending..." : "Send OTP to Email"}
              </Button>
            ) : (
              <div className="space-y-6">
                <FormField
                  label="One-Time Password"
                  description="Check your email for the 6-digit OTP"
                >
                  <Input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                  />
                </FormField>
                
                <Button
                  onClick={validateOTP}
                  disabled={otp.length !== 6 || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Validating..." : "Validate OTP"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}