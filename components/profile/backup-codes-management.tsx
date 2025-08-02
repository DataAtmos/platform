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
import { client } from "@/lib/auth-client"
import { Loader2, Download, RefreshCw, Shield, Copy } from "lucide-react"
import { toast } from "sonner"

interface BackupCodesManagementProps {
  session: {
    user: {
      twoFactorEnabled: boolean | null | undefined
    }
  } | null
}

export function BackupCodesManagement({ session }: BackupCodesManagementProps) {
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCodes, setShowCodes] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [password, setPassword] = useState("")

  const generateBackupCodes = async () => {
    if (!password) {
      toast.error("Please enter your password")
      return
    }
    setIsGenerating(true)
    try {
      await client.twoFactor.generateBackupCodes({
        password,
        fetchOptions: {
          onSuccess: (data) => {
            setBackupCodes(data.data.backupCodes)
            setShowCodes(true)
            toast.success("Backup codes generated successfully")
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to generate backup codes")
          },
        },
      })
    } catch (error) {
      toast.error("Failed to generate backup codes")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const downloadCodes = () => {
    const codesText = backupCodes.join("\n")
    const blob = new Blob([codesText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "backup-codes.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Backup codes downloaded")
  }

  if (!session?.user.twoFactorEnabled) {
    return (
      <div className="text-center py-8 border border-border bg-github-subtle">
        <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Two-factor authentication is not enabled</p>
        <p className="text-xs text-muted-foreground mt-1">Enable 2FA to generate backup codes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground">Recovery codes for when you lose access to your authenticator app</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-2" />
              Generate Codes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Backup Codes</DialogTitle>
              <DialogDescription>
                Generate new backup codes for your account. Keep these codes safe and secure.
              </DialogDescription>
            </DialogHeader>

            {showCodes && backupCodes.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 border border-border bg-github-subtle">
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-border bg-background"
                      >
                        <span>{code}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)} className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadCodes} variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-3 w-3 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => copyToClipboard(backupCodes.join("\n"))} variant="outline" className="flex-1">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Enter your password to generate backup codes
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              {!showCodes ? (
                <Button onClick={generateBackupCodes} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Codes"}
                </Button>
              ) : (
                <Button onClick={() => setDialogOpen(false)}>Done</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-center py-8 border border-border bg-github-subtle">
        <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No backup codes generated yet</p>
        <p className="text-xs text-muted-foreground mt-1">Generate backup codes to secure your account</p>
      </div>
    </div>
  )
}