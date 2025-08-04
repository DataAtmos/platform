"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, CheckCircle2, Mail, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo";
import GradientBackground from '@/components/animation/gradient-background';
import Link from "next/link";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600 mb-6">
              Verify your identity with a one-time password
            </p>
          </div>
          
          <div className="mt-8">
            <div className="space-y-6">
              {message && (
                <div className={`p-4 border rounded-md ${
                  isError 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  {isError ? (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {!isOtpSent ? (
                <Button 
                  onClick={requestOTP} 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" 
                  disabled={loading}
                >
                  <Mail className="w-4 h-4 mr-2" /> 
                  {loading ? "Sending..." : "Send OTP to Email"}
                </Button>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      One-Time Password
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Check your email for the 6-digit OTP</p>
                    <div className="mt-1">
                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        inputMode="numeric"
                        className="text-center text-lg tracking-widest font-mono appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={validateOTP}
                    disabled={otp.length !== 6 || loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {loading ? "Validating..." : "Validate OTP"}
                  </Button>
                </div>
              )}
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