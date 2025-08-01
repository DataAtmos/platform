"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertCircle, CheckCircle, Info } from "lucide-react";

export function PasskeyDebug() {
  const [debugInfo, setDebugInfo] = useState<{
    browserSupport: boolean;
    platformAuthenticator: boolean;
    userPasskeys: Array<{ name?: string; deviceType: string; createdAt: string }>;
    errors: string[];
    canCreatePasskeys?: boolean;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkPasskeySupport = async () => {
    setIsChecking(true);
    
    const info: {
      browserSupport: boolean;
      platformAuthenticator: boolean;
      userPasskeys: Array<{ name?: string; deviceType: string; createdAt: string }>;
      errors: string[];
      canCreatePasskeys?: boolean;
    } = {
      browserSupport: false,
      platformAuthenticator: false,
      userPasskeys: [],
      errors: [],
    };

    try {
      // Check WebAuthn support
      if (window.PublicKeyCredential) {
        info.browserSupport = true;
        
        // Check platform authenticator
        if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          info.platformAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        }
      }

      // Try to get user's passkeys  
      try {
        // Note: We can't call the hook here since this is not a React component context
        // This would need to be refactored to work properly with hooks
        info.userPasskeys = [];
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        info.errors.push(`Failed to fetch passkeys: ${errorMessage}`);
      }

      // Test passkey creation capability
      try {
        // This won't actually create a passkey, just test the capability
        const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.();
        info.canCreatePasskeys = isAvailable;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        info.errors.push(`Platform authenticator check failed: ${errorMessage}`);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      info.errors.push(`General error: ${errorMessage}`);
    }

    setDebugInfo(info);
    setIsChecking(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Passkey Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkPasskeySupport} disabled={isChecking}>
          {isChecking ? "Checking..." : "Check Passkey Support"}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                {debugInfo.browserSupport ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Browser WebAuthn Support: {debugInfo.browserSupport ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center gap-2">
                {debugInfo.platformAuthenticator ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span>Platform Authenticator: {debugInfo.platformAuthenticator ? "Available" : "Not Available"}</span>
              </div>

              <div className="flex items-center gap-2">
                {debugInfo.userPasskeys.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span>User Passkeys: {debugInfo.userPasskeys.length} registered</span>
              </div>
            </div>

            {debugInfo.userPasskeys.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Registered Passkeys:</h4>
                <div className="space-y-1">
                  {debugInfo.userPasskeys.map((passkey, index: number) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      <div>Name: {passkey.name || "Unnamed"}</div>
                      <div>Device: {passkey.deviceType}</div>
                      <div>Created: {new Date(passkey.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debugInfo.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Errors:</h4>
                <div className="space-y-1">
                  {debugInfo.errors.map((error: string, index: number) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4">
              <div>User Agent: {navigator.userAgent}</div>
              <div>Origin: {window.location.origin}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}