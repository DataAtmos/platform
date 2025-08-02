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
import { Separator } from "@/components/ui/separator"
import { client, signOut, useSession } from "@/lib/auth-client"
import {
  Edit,
  Loader2,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Monitor,
  Info,
} from "lucide-react"
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-3 w-3" />

    const parser = new UAParser(userAgent)
    const device = parser.getDevice()

    if (device.type === "mobile") return <Smartphone className="h-3 w-3" />
    return <Monitor className="h-3 w-3" />
  }

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return "Unknown device"

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()

    return `${browser.name || "Unknown"} on ${os.name || "Unknown"}`
  }

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
    <div className="max-w-10xl mx-auto">
      {/* Header */}
      <div className="mb-6 mt-8">
        <h1 className="text-lg font-semibold mb-1">Account Settings</h1>
        <p className="text-xs text-muted-foreground">Manage your account settings and security preferences</p>
      </div>

      {/* Profile Information & Password Group */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Profile Information</h2>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={session?.user.image || undefined} alt="Avatar" className="object-cover" />
              <AvatarFallback className="bg-muted text-sm font-medium">
                {getInitials(session?.user.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-medium truncate">{session?.user.name}</h3>
                {session?.user.emailVerified ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded font-medium flex-shrink-0">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded font-medium flex-shrink-0">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{session?.user.email}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <EditUserDialog />
            <ChangePasswordDialog />
          </div>
        </div>

        {!session?.user.emailVerified && (
          <div className="flex items-start gap-2 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-md">
            <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-yellow-900 dark:text-yellow-200">Verify Your Email Address</p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-0.5">
                    Check your inbox for the verification email.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={emailVerificationPending}
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
                          toast.success("Verification email sent")
                          setEmailVerificationPending(false)
                        },
                      },
                    )
                  }}
                  className="text-xs h-7 px-2 flex-shrink-0"
                >
                  {emailVerificationPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resend"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SSO Note */}
        <div className="flex items-start gap-2 p-3 border border-blue-500/20 bg-blue-500/5 rounded-md mt-3">
          <Info className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-200">SSO Account Notice</p>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
              If you signed up with Google or another SSO provider, you cannot enable MFA or change your password through this interface.
            </p>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Two-Factor Authentication & Backup Codes Group */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Two-Factor Authentication</h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-3 w-3 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Two-Factor Authentication</p>
                <p className="text-[10px] text-muted-foreground">
                  {session?.user.twoFactorEnabled ? "Enabled" : "Add an extra layer of security"}
                </p>
              </div>
            </div>
            <TwoFactorDialog session={session} router={router} />
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-medium mb-2">Backup Codes</h3>
            <BackupCodesManagement session={session} />
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Passkeys */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3">Passkeys</h2>
        <PasskeyManagement />
      </div>

      <Separator className="mb-6" />

      {/* Active Sessions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Sessions</h2>
          {activeSessions.filter(s => s.id !== initialSession?.session.id).length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  await client.revokeOtherSessions()
                  setActiveSessions(activeSessions.filter(s => s.id === initialSession?.session.id))
                  toast.success("All other sessions terminated successfully")
                } catch (error: unknown) {
                  const errorMessage = error instanceof Error ? error.message : "Failed to terminate sessions"
                  toast.error(errorMessage)
                }
              }}
              className="text-xs h-7 px-2"
            >
              Sign out all other sessions
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {activeSessions
            .filter((session) => session.userAgent)
            .map((session) => {
              const isCurrentSession = session.id === initialSession?.session.id
              return (
                <div key={session.id} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b last:border-0 ${isCurrentSession ? 'bg-muted/30 rounded p-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.userAgent)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate">{getDeviceInfo(session.userAgent)}</p>
                        {isCurrentSession && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded font-medium flex-shrink-0">
                            Current session
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {isCurrentSession ? "This device" : "Other device"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isTerminating === session.id}
                    onClick={async () => {
                      setIsTerminating(session.id)
                      try {
                        await client.revokeSession({ token: session.token })
                        removeActiveSession(session.id)
                        toast.success(isCurrentSession ? "Signed out successfully" : "Session terminated successfully")
                        if (isCurrentSession) router.refresh()
                      } catch (error: unknown) {
                        const errorMessage = error instanceof Error ? error.message : "Failed to terminate session"
                        toast.error(errorMessage)
                      } finally {
                        setIsTerminating(undefined)
                      }
                    }}
                    className={`text-xs h-7 px-2 flex-shrink-0 ${isCurrentSession ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}`}
                  >
                    {isTerminating === session.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        {isCurrentSession ? "Signing out..." : "Terminating..."}
                      </>
                    ) : (
                      isCurrentSession ? "Sign Out" : "Terminate"
                    )}
                  </Button>
                </div>
              )
            })}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Sign Out */}
      <div className="pt-2">
        <Button
          variant="destructive"
          className="w-full"
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
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-3 w-3" />
              Sign out of all devices
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Dialog components with updated styling
function EditUserDialog() {
  const { data } = useSession()
  const [name, setName] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit Profile</DialogTitle>
          <DialogDescription className="text-xs">Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs">Full Name</Label>
            <Input
              id="name"
              placeholder={data?.user.name}
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="text-xs h-8"
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
                    toast.success("Profile updated")
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
            size="sm"
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update"}
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
        <Button
          variant={session?.user.twoFactorEnabled ? "outline" : "default"}
          size="sm"
          className="text-xs h-7 px-2"
        >
          {session?.user.twoFactorEnabled ? "Disable" : "Enable"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">{session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}</DialogTitle>
          <DialogDescription className="text-xs">
            {session?.user.twoFactorEnabled
              ? "Disable two-factor authentication from your account"
              : "Enable 2FA to secure your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {twoFactorVerifyURI ? (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-muted border border-border">
                <QRCode value={twoFactorVerifyURI} size={140} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-xs">Verification code from your app</Label>
                <Input
                  id="otp"
                  value={twoFaPassword}
                  onChange={(e) => setTwoFaPassword(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-xs h-8"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={twoFaPassword}
                onChange={(e) => setTwoFaPassword(e.target.value)}
                className="text-xs h-8"
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
                      toast.success("2FA disabled")
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
                        toast.success("2FA enabled")
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
            size="sm"
            className="text-xs"
          >
            {isPendingTwoFa ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : session?.user.twoFactorEnabled ? (
              "Disable"
            ) : twoFactorVerifyURI ? (
              "Verify"
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
        <Button variant="outline" size="sm" className="text-xs h-7 px-2">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Change Password</DialogTitle>
          <DialogDescription className="text-xs">Update your account password</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-xs">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="text-xs h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="text-xs h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="text-xs h-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sign-out-devices"
              checked={signOutDevices}
              onCheckedChange={(checked) => setSignOutDevices(checked as boolean)}
            />
            <label htmlFor="sign-out-devices" className="text-xs">
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
                toast.success("Password changed")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }
            }}
            size="sm"
            className="text-xs"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}