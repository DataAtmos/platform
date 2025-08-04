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
      console.error(error)
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
      <div className="text-center py-8 border border-border bg-atmos-subtle">
        <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Two-factor authentication is not enabled</p>
        <p className="text-xs text-muted-foreground mt-1">Enable 2FA to generate backup codes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-foreground">Recovery codes for when you lose access to your authenticator app</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-shrink-0">
              <RefreshCw className="h-3 w-3 mr-2" />
              Generate Codes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Backup Codes</DialogTitle>
              <DialogDescription>
                Generate new backup codes for your two-factor authentication. Keep these codes safe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-atmos flex h-8 w-full file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 mt-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={generateBackupCodes} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Codes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showCodes && backupCodes.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 border border-border bg-atmos-subtle rounded-md">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background border border-border rounded">
                  <span className="text-sm font-mono">{code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadCodes} variant="outline" size="sm">
              <Download className="h-3 w-3 mr-2" />
              Download
            </Button>
            <Button
              onClick={() => {
                const codesText = backupCodes.join("\n")
                copyToClipboard(codesText)
              }}
              variant="outline"
              size="sm"
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}