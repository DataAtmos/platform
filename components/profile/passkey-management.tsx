"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Fingerprint, Plus, Trash, Loader2, AlertCircle, CheckCircle2, Key } from "lucide-react"

interface Passkey {
  id: string
  name?: string
  deviceType: string
  createdAt: Date
}

export function PasskeyManagement() {
  const { data: passkeys, isPending, error, refetch } = client.useListPasskeys()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [passkeyName, setPasskeyName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleAddPasskey = async () => {
    if (!passkeyName.trim()) {
      setMessage("Passkey name is required")
      setIsError(true)
      return
    }

    setIsAdding(true)
    setMessage("")
    setIsError(false)

    try {
      await client.passkey.addPasskey({
        name: passkeyName.trim(),
        fetchOptions: {
          onSuccess: () => {
            setMessage("Passkey added successfully! You can now use it to sign in.")
            setIsError(false)
            setPasskeyName("")
            setIsAddDialogOpen(false)
            refetch()
          },
          onError: (context) => {
            setMessage(context.error.message || "Failed to add passkey")
            setIsError(true)
          },
        },
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add passkey"
      setMessage(errorMessage)
      setIsError(true)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeletePasskey = async (passkeyId: string) => {
    setIsDeletingId(passkeyId)
    setMessage("")
    setIsError(false)

    try {
      await client.passkey.deletePasskey({
        id: passkeyId,
        fetchOptions: {
          onSuccess: () => {
            setMessage("Passkey deleted successfully")
            setIsError(false)
            refetch()
          },
          onError: (context) => {
            setMessage(context.error.message || "Failed to delete passkey")
            setIsError(true)
          },
        },
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete passkey"
      setMessage(errorMessage)
      setIsError(true)
    } finally {
      setIsDeletingId(null)
    }
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="platform-heading-md">Passkeys</h2>
          <p className="platform-text-small text-platform-fg-muted">
            Manage your passkeys for secure, passwordless authentication
          </p>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="platform-heading-md">Passkeys</h2>
          <p className="platform-text-small text-platform-fg-muted">
            Manage your passkeys for secure, passwordless authentication
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="platform-btn platform-btn-primary platform-btn-sm gap-2">
              <Plus className="h-3 w-3" />
              <span className="platform-text-small">Add Passkey</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-platform-canvas-overlay border-platform-border-default max-w-md">
            <DialogHeader>
              <DialogTitle className="platform-heading-md">Add New Passkey</DialogTitle>
              <DialogDescription className="platform-text-small">
                Create a new passkey to securely access your account without a password.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passkey-name" className="platform-text-sm font-medium">
                  Passkey Name
                </Label>
                <Input
                  id="passkey-name"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  placeholder="e.g., My iPhone, Work Laptop"
                  className="platform-input"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isAdding}
                className="platform-btn platform-btn-outline platform-btn-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPasskey}
                disabled={isAdding}
                className="platform-btn platform-btn-primary platform-btn-sm"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="mr-2 h-3 w-3" />
                    Create Passkey
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <div
          className={`platform-alert ${isError ? "platform-alert-danger" : "platform-alert-success"} flex items-center gap-2`}
        >
          {isError ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
          <span className="platform-text-small">{message}</span>
        </div>
      )}

      {error && (
        <div className="platform-alert platform-alert-danger flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          <span className="platform-text-small">Failed to load passkeys: {error.message}</span>
        </div>
      )}

      <div className="border border-platform-border-default bg-platform-canvas-default">
        {passkeys && passkeys.length > 0 ? (
          <div className="divide-y divide-platform-border-muted">
            {passkeys.map((passkey: Passkey) => (
              <div key={passkey.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-platform-accent-subtle border border-platform-accent-emphasis/20">
                    <Key className="h-3 w-3 text-platform-accent-emphasis" />
                  </div>
                  <div>
                    <p className="platform-text-small font-medium">{passkey.name || "Unnamed Passkey"}</p>
                    <p className="platform-text-xs text-platform-fg-muted">
                      {passkey.deviceType} • Added {passkey.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePasskey(passkey.id)}
                  disabled={isDeletingId === passkey.id}
                  className="platform-btn platform-btn-ghost platform-btn-sm text-platform-danger-fg hover:text-platform-danger-fg hover:bg-platform-danger-subtle"
                >
                  {isDeletingId === passkey.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Fingerprint className="h-12 w-12 text-platform-fg-muted mx-auto mb-4" />
            <h3 className="platform-heading-sm mb-2">No passkeys found</h3>
            <p className="platform-text-small text-platform-fg-muted mb-4">
              Add a passkey to enable secure, passwordless authentication
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="platform-btn platform-btn-primary platform-btn-sm gap-2"
            >
              <Plus className="h-3 w-3" />
              <span className="platform-text-small">Add Your First Passkey</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
