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
import { Loader2, Plus, Trash2, Key } from "lucide-react"
import { toast } from "sonner"

interface Passkey {
  id: string
  name: string
  createdAt: string
}

export function PasskeyManagement() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPasskeyName, setNewPasskeyName] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const handleCreatePasskey = async () => {
    if (!newPasskeyName.trim()) {
      toast.error("Please enter a name for your passkey")
      return
    }

    setIsCreating(true)
    try {
      await client.passkey.addPasskey({
        name: newPasskeyName,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Passkey created successfully")
            setNewPasskeyName("")
            setCreateDialogOpen(false)
            // Refresh passkeys list
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to create passkey")
          },
        },
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create passkey")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePasskey = async (passkeyId: string) => {
    setIsLoading(true)
    try {
      await client.passkey.deletePasskey({
        id: passkeyId,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Passkey deleted successfully")
            setPasskeys(passkeys.filter((p) => p.id !== passkeyId))
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to delete passkey")
          },
        },
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete passkey")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-foreground">Manage your passkeys for secure, passwordless authentication</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex-shrink-0">
              <Plus className="h-3 w-3 mr-2" />
              Add Passkey
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Passkey</DialogTitle>
              <DialogDescription>
                Add a new passkey to your account for secure, passwordless authentication.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passkey-name">Passkey Name</Label>
                <Input
                  id="passkey-name"
                  placeholder="e.g., My iPhone, Work Laptop"
                  value={newPasskeyName}
                  onChange={(e) => setNewPasskeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePasskey} disabled={isCreating}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Passkey"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {passkeys.length === 0 ? (
        <div className="text-center py-8 border border-border bg-atmos-subtle">
          <Key className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No passkeys configured</p>
          <p className="text-xs text-muted-foreground mt-1">Add a passkey to enable passwordless authentication</p>
        </div>
      ) : (
        <div className="space-y-2">
          {passkeys.map((passkey) => (
            <div key={passkey.id} className="flex items-center justify-between p-3 border border-border">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{passkey.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(passkey.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDeletePasskey(passkey.id)} disabled={isLoading}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
