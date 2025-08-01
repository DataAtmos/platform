"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { client, signOut, useSession } from "@/lib/auth-client"
import { Edit, Laptop, Loader2, LogOut, ShieldCheck, ShieldOff, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"
import QRCode from "react-qr-code"
import { PasskeyManagement } from "./passkey-management"
import { BackupCodesManagement } from "./backup-codes-management"

interface Session {
  user: {
    id: string
    name: string
    email: string
    image?: string
    emailVerified: boolean
    twoFactorEnabled: boolean
  }
  session: {
    id: string
    userId: string
    token: string
    userAgent?: string
  }
}

interface ProfileContentProps {
  session: Session | null
  activeSessions: Array<{
    id: string
    userId: string
    token: string
    userAgent?: string
  }>
}

export default function ProfileContent({
  session: initialSession,
  activeSessions: initialActiveSessions,
}: ProfileContentProps) {
  const router = useRouter()
  const { data, isPending } = useSession()
  const session = data || initialSession

  const [isTerminating, setIsTerminating] = useState<string>()
  const [isSignOut, setIsSignOut] = useState<boolean>(false)
  const [emailVerificationPending, setEmailVerificationPending] = useState<boolean>(false)
  const [activeSessions, setActiveSessions] = useState(initialActiveSessions)

  const removeActiveSession = (id: string) => setActiveSessions(activeSessions.filter((session) => session.id !== id))

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-platform-canvas-default">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="platform-heading-lg">Account Settings</h1>
            <p className="platform-text-muted">Manage your account settings and security preferences.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="platform-text-sm font-medium text-platform-fg-default">Profile</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user.image || undefined} alt="Avatar" className="object-cover" />
                      <AvatarFallback className="text-sm bg-platform-accent-emphasis text-platform-fg-on-emphasis font-medium">
                        {session?.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="platform-text-sm font-medium text-platform-fg-default">{session?.user.name}</p>
                        {session?.user.emailVerified && (
                          <span className="inline-flex items-center px-2 py-0.5 platform-text-xs font-medium bg-platform-success-subtle text-platform-success-fg border border-platform-success-emphasis/20">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="platform-text-xs text-platform-fg-muted">{session?.user.email}</p>
                    </div>
                  </div>
                  <EditUserDialog />
                </div>

                {!session?.user.emailVerified && (
                  <div className="bg-platform-attention-subtle border border-platform-attention-emphasis/20 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-platform-attention-emphasis flex-shrink-0 mt-0.5" />
                      <div className="space-y-3">
                        <div>
                          <p className="platform-text-sm font-medium text-platform-attention-fg">Verify Your Email Address</p>
                          <p className="platform-text-xs text-platform-fg-muted mt-1">
                            Please verify your email address. Check your inbox for the verification email.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="platform-text-xs bg-transparent"
                          onClick={async () => {
                            await client.sendVerificationEmail(
                              { email: session?.user.email || "" },
                              {
                                onRequest() {
                                  setEmailVerificationPending(true)
                                },
                                onError(context) {
                                  toast.error(context.error.message)
                                  setEmailVerificationPending(false)
                                },
                                onSuccess() {
                                  toast.success("Verification email sent successfully")
                                  setEmailVerificationPending(false)
                                },
                              },
                            )
                          }}
                        >
                          {emailVerificationPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Resend Verification Email"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="platform-text-sm font-medium text-platform-fg-default">Active Sessions</h2>
              <div className="space-y-2">
                {activeSessions
                  .filter((session) => session.userAgent)
                  .map((session) => {
                    const parser = new UAParser(session.userAgent || "")
                    const device = parser.getDevice()
                    const os = parser.getOS()
                    const browser = parser.getBrowser()

                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 border border-platform-border-default bg-platform-canvas-default"
                      >
                        <div className="flex items-center gap-3">
                          {device.type === "mobile" ? (
                            <div className="h-4 w-4 text-platform-fg-muted">📱</div>
                          ) : (
                            <Laptop className="h-4 w-4 text-platform-fg-muted" />
                          )}
                          <div>
                            <p className="platform-text-sm font-medium text-platform-fg-default">
                              {os.name} • {browser.name}
                            </p>
                            <p className="platform-text-xs text-platform-fg-muted">
                              {session.id === initialSession?.session.id ? "Current session" : "Other session"}
                            </p>
                          </div>
                        </div>
                                                 <Button
                           variant="ghost"
                           size="sm"
                           className="platform-text-xs"
                           disabled={isTerminating === session.id}
                           onClick={async () => {
                             setIsTerminating(session.id)
                             try {
                               await client.revokeSession({ token: session.token })
                               removeActiveSession(session.id)
                               toast.success("Session terminated successfully")
                               if (session.id === initialSession?.session.id) router.refresh()
                             } catch (error: unknown) {
                               const errorMessage = error instanceof Error ? error.message : "Failed to terminate session"
                               toast.error(errorMessage)
                             } finally {
                               setIsTerminating(undefined)
                             }
                           }}
                         >
                           {isTerminating === session.id ? (
                             <Loader2 size={12} className="animate-spin" />
                           ) : (
                             "Terminate"
                           )}
                         </Button>
                      </div>
                    )
                  })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="platform-text-sm font-medium text-platform-fg-default">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-platform-border-default bg-platform-canvas-default">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-platform-fg-muted" />
                    <div>
                      <p className="platform-text-sm font-medium text-platform-fg-default">Two-Factor Authentication</p>
                      <p className="platform-text-xs text-platform-fg-muted">
                        {session?.user.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <TwoFactorDialog session={session} router={router} />
                </div>

                <div className="flex items-center justify-between p-3 border border-platform-border-default bg-platform-canvas-default">
                  <div className="flex items-center gap-3">
                    <ShieldOff className="h-4 w-4 text-platform-fg-muted" />
                    <div>
                      <p className="platform-text-sm font-medium text-platform-fg-default">Change Password</p>
                      <p className="platform-text-xs text-platform-fg-muted">Update your account password</p>
                    </div>
                  </div>
                  <ChangePasswordDialog />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="platform-text-sm font-medium text-platform-fg-default">Passkeys</h2>
              <PasskeyManagement />
            </div>

                         <div className="space-y-4">
               <h2 className="platform-text-sm font-medium text-platform-fg-default">Backup Codes</h2>
               <BackupCodesManagement session={session} />
             </div>

            <div className="pt-6 border-t border-platform-border-muted">
              <Button
                variant="outline"
                className="w-full platform-btn platform-btn-outline text-platform-danger-fg border-platform-danger-emphasis hover:bg-platform-danger-subtle hover:text-platform-danger-fg"
                disabled={isSignOut}
                onClick={async () => {
                  setIsSignOut(true)
                  await signOut({
                    fetchOptions: {
                      onRequest() {
                        setIsSignOut(true)
                      },
                      onError(context) {
                        toast.error(context.error.message)
                        setIsSignOut(false)
                      },
                      onSuccess() {
                        router.push("/")
                      },
                    },
                  })
                }}
              >
                {isSignOut ? (
                  <>
                    <Loader2 size={12} className="animate-spin mr-2" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out of all devices
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditUserDialog() {
  const { data } = useSession()
  const [name, setName] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="platform-text-xs bg-transparent">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="platform-text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder={data?.user.name}
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              await client.updateUser({
                name: name || undefined,
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Profile updated successfully")
                    setOpen(false)
                    router.refresh()
                  },
                  onError: (error) => {
                    toast.error(error.error.message)
                  },
                },
              })
              setIsLoading(false)
            }}
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TwoFactorDialog({
  session,
  router,
}: {
  session: { user: { twoFactorEnabled: boolean | null | undefined } } | null
  router: { push: (path: string) => void; refresh?: () => void }
}) {
  const [isPendingTwoFa, setIsPendingTwoFa] = useState<boolean>(false)
  const [twoFaPassword, setTwoFaPassword] = useState<string>("")
  const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false)
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>("")

  return (
    <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
      <DialogTrigger asChild>
        <Button variant={session?.user.twoFactorEnabled ? "destructive" : "outline"} size="sm" className="platform-text-xs">
          {session?.user.twoFactorEnabled ? (
            <ShieldOff className="h-3 w-3 mr-1" />
          ) : (
            <ShieldCheck className="h-3 w-3 mr-1" />
          )}
          {session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}</DialogTitle>
          <DialogDescription>
            {session?.user.twoFactorEnabled
              ? "Disable two-factor authentication from your account"
              : "Enable 2FA to secure your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {twoFactorVerifyURI ? (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-platform-canvas-subtle border border-platform-border-default rounded-lg">
                <QRCode value={twoFactorVerifyURI} size={160} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="platform-text-sm font-medium">
                  Enter verification code from your app
                </Label>
                <Input
                  id="otp"
                  value={twoFaPassword}
                  onChange={(e) => setTwoFaPassword(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password" className="platform-text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={twoFaPassword}
                onChange={(e) => setTwoFaPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={isPendingTwoFa}
            onClick={async () => {
              if (twoFaPassword.length < 6 && !twoFactorVerifyURI) {
                toast.error("Password must be at least 6 characters")
                return
              }
              setIsPendingTwoFa(true)

              if (session?.user.twoFactorEnabled) {
                await client.twoFactor.disable({
                  password: twoFaPassword,
                  fetchOptions: {
                    onError(context) {
                      toast.error(context.error.message)
                    },
                    onSuccess() {
                      toast.success("2FA disabled successfully")
                      setTwoFactorDialog(false)
                      router.refresh?.()
                    },
                  },
                })
              } else {
                if (twoFactorVerifyURI) {
                  await client.twoFactor.verifyTotp({
                    code: twoFaPassword,
                    fetchOptions: {
                      onError(context) {
                        toast.error(context.error.message)
                      },
                      onSuccess() {
                        toast.success("2FA enabled successfully")
                        setTwoFactorVerifyURI("")
                        setTwoFactorDialog(false)
                        router.refresh?.()
                      },
                    },
                  })
                } else {
                  await client.twoFactor.enable({
                    password: twoFaPassword,
                    fetchOptions: {
                      onError(context) {
                        toast.error(context.error.message)
                      },
                      onSuccess(ctx) {
                        setTwoFactorVerifyURI(ctx.data.totpURI)
                      },
                    },
                  })
                }
              }
              setIsPendingTwoFa(false)
              setTwoFaPassword("")
            }}
          >
            {isPendingTwoFa ? (
              <Loader2 size={12} className="animate-spin" />
            ) : session?.user.twoFactorEnabled ? (
              "Disable 2FA"
            ) : twoFactorVerifyURI ? (
              "Verify & Enable"
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ChangePasswordDialog() {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [signOutDevices, setSignOutDevices] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="platform-text-xs bg-transparent">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your account password</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="platform-text-sm font-medium">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="platform-text-sm font-medium">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="platform-text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sign-out-devices"
              checked={signOutDevices}
              onCheckedChange={(checked) => setSignOutDevices(checked as boolean)}
            />
            <label htmlFor="sign-out-devices" className="platform-text-sm">
              Sign out from other devices
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match")
                return
              }
              if (newPassword.length < 8) {
                toast.error("Password must be at least 8 characters")
                return
              }
              setLoading(true)
              const res = await client.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: signOutDevices,
              })
              setLoading(false)
              if (res.error) {
                toast.error(res.error.message || "Failed to change password")
              } else {
                setOpen(false)
                toast.success("Password changed successfully")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }
            }}
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
