"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { client } from "@/lib/auth-client";
import { Shield, ShieldCheck, Key } from "lucide-react";
import { useState } from "react";

interface SecuritySettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export function SecuritySettings({}: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showSetup2FA, setShowSetup2FA] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError("");

    try {
      await client.changePassword({
        newPassword,
        currentPassword,
      });
      setPasswordMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password";
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const result = await client.twoFactor.enable({
        password: currentPassword,
      });
      
      if (result.data) {
        // Note: Better Auth 2FA returns totpURI, not qrCode
        setQrCode(result.data.totpURI);
        setSetupCode(result.data.totpURI); // Use totpURI as setup code
        setShowSetup2FA(true);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to setup 2FA";
      setPasswordError(errorMessage);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await client.twoFactor.verifyTotp({
        code: verificationCode,
      });
      setIs2FAEnabled(true);
      setShowSetup2FA(false);
      setPasswordMessage("2FA enabled successfully");
    } catch {
      setPasswordError("Invalid verification code");
    }
  };

  const handleDisable2FA = async () => {
    try {
      await client.twoFactor.disable({
        password: currentPassword,
      });
      setIs2FAEnabled(false);
      setPasswordMessage("2FA disabled successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to disable 2FA";
      setPasswordError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings.
        </p>
      </div>

      {/* Change Password */}
      <div className="space-y-4 border p-6">
        <div className="flex items-center space-x-2">
          <Key className="h-4 w-4" />
          <h3 className="font-medium">Change Password</h3>
        </div>
        
        {passwordMessage && (
          <Alert>
            <AlertDescription>{passwordMessage}</AlertDescription>
          </Alert>
        )}
        
        {passwordError && (
          <Alert variant="destructive">
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleChangePassword}
            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4 border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {is2FAEnabled ? (
              <ShieldCheck className="h-4 w-4 text-green-600" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled 
                  ? "2FA is enabled on your account" 
                  : "Add an extra layer of security to your account"
                }
              </p>
            </div>
          </div>
          
          {is2FAEnabled ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Disable
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Enter your password to disable 2FA on your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="disable-password">Password</Label>
                    <Input
                      id="disable-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleDisable2FA}
                    variant="destructive"
                    className="w-full"
                    disabled={!currentPassword}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={showSetup2FA} onOpenChange={setShowSetup2FA}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleEnable2FA}>
                  Enable
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Scan the QR code with your authenticator app and enter the verification code.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {qrCode && (
                    <div className="flex justify-center">
                      <div className="p-4 border">
                        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                      </div>
                    </div>
                  )}
                  
                  {setupCode && (
                    <div className="space-y-2">
                      <Label>Manual Setup Code</Label>
                      <Input value={setupCode} readOnly />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleVerify2FA}
                    className="w-full"
                    disabled={verificationCode.length !== 6}
                  >
                    Verify and Enable
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}