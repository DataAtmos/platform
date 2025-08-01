"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/auth-client"
import { Shield, Download, Copy, RefreshCw, AlertTriangle, CheckCircle2, Key } from "lucide-react"
import { toast } from "sonner"

interface BackupCodesManagementProps {
  session: {
    user: {
      twoFactorEnabled?: boolean | null
    }
  } | null
}

export function BackupCodesManagement({ session }: BackupCodesManagementProps) {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  if (!session?.user.twoFactorEnabled) {
    return null
  }

  const handleGenerateBackupCodes = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      const response = await client.twoFactor.generateBackupCodes({
        password,
      })

      if (response.data) {
        setBackupCodes(response.data.backupCodes)
        setShowGenerateDialog(false)
        setShowViewDialog(true)
        setPassword("")
        toast.success("New backup codes generated successfully")
      }
    } catch (error) {
      console.error("Failed to generate backup codes:", error)
      toast.error("Failed to generate backup codes")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success("Backup code copied to clipboard")
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error("Failed to copy backup code:", error)
      toast.error("Failed to copy backup code")
    }
  }

  const downloadBackupCodes = () => {
    const content =
      `Data Atmos Platform - Backup Codes\n\n` +
      `Generated: ${new Date().toLocaleString()}\n\n` +
      `Important: Store these backup codes in a safe place.\n` +
      `Each code can only be used once.\n\n` +
      `Backup Codes:\n` +
      backupCodes.map((code, index) => `${index + 1}. ${code}`).join("\n") +
      `\n\nKeep these codes secure and separate from your device.`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-atmos-backup-codes-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Backup codes downloaded")
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="platform-heading-sm flex items-center gap-2">
          <Key className="h-4 w-4" />
          Backup Codes
        </h3>
        <p className="platform-text-small text-platform-fg-muted mt-1">
          Recovery codes for when you lose access to your authenticator app
        </p>
      </div>

      <div className="space-y-4 border border-platform-border-default p-4 bg-platform-canvas-default">
        <div className="platform-alert platform-alert-info flex items-start gap-3">
          <Shield className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <div className="platform-text-small">
            Backup codes allow you to access your account if you lose your authenticator device. Each code can only be
            used once.
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="platform-btn platform-btn-outline platform-btn-sm bg-transparent"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                <span className="platform-text-small">Generate New Codes</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-platform-canvas-overlay border-platform-border-default max-w-md">
              <DialogHeader>
                <DialogTitle className="platform-heading-md flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-platform-attention-fg" />
                  Generate New Backup Codes
                </DialogTitle>
                <DialogDescription className="platform-text-small">
                  This will invalidate all existing backup codes and generate new ones. Make sure to save the new codes
                  securely.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="platform-text-sm font-medium">Enter your password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="platform-input"
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowGenerateDialog(false)
                    setPassword("")
                  }}
                  className="platform-btn platform-btn-ghost platform-btn-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateBackupCodes}
                  disabled={isLoading}
                  className="platform-btn platform-btn-primary platform-btn-sm"
                >
                  {isLoading ? "Generating..." : "Generate New Codes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Backup Codes Display Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="bg-platform-canvas-overlay border-platform-border-default max-w-md">
            <DialogHeader>
              <DialogTitle className="platform-heading-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-platform-success-emphasis" />
                Your Backup Codes
              </DialogTitle>
              <DialogDescription className="platform-text-small">
                Save these codes in a secure location. Each can only be used once.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="platform-alert platform-alert-warning flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <div className="platform-text-small">
                  <strong>Important:</strong> These codes will not be shown again. Save them now in a secure location.
                </div>
              </div>

              <div className="grid gap-2 p-4 bg-platform-canvas-subtle border border-platform-border-default">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-platform-canvas-default border border-platform-border-muted font-mono platform-text-small"
                  >
                    <span>{code}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                      className="h-6 w-6 p-0 platform-btn platform-btn-ghost"
                    >
                      {copiedCode === code ? (
                        <CheckCircle2 className="h-3 w-3 text-platform-success-emphasis" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBackupCodes}
                  className="flex-1 platform-btn platform-btn-outline platform-btn-sm bg-transparent"
                >
                  <Download className="h-3 w-3 mr-2" />
                  <span className="platform-text-small">Download</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allCodes = backupCodes.join("\n")
                    copyToClipboard(allCodes)
                  }}
                  className="flex-1 platform-btn platform-btn-outline platform-btn-sm"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  <span className="platform-text-small">Copy All</span>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowViewDialog(false)
                  setBackupCodes([])
                }}
                className="w-full platform-btn platform-btn-primary platform-btn-sm"
              >
                I&apos;ve Saved My Codes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
