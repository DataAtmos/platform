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
import {
  Loader2,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Monitor,
  Key,
  Shield,
  Smartphone as PhoneIcon,
  Calendar,
  User,
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
    if (!userAgent) return <Monitor className="h-4 w-4" />
    const parser = new UAParser(userAgent)
    const device = parser.getDevice()
    if (device.type === "mobile") return <PhoneIcon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return "Unknown device"
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    return `${browser.name || "Unknown"} on ${os.name || "Unknown"}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[var(--font-size-500)] font-semibold mb-1">Account Settings</h1>
        <p className="text-[var(--font-size-200)] text-muted-foreground">Manage your account settings and security preferences</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-4">
          {/* Profile Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src={session?.user.image || undefined} alt="Avatar" />
                <AvatarFallback className="bg-muted text-[var(--font-size-200)] font-medium">
                  {getInitials(session?.user.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-[var(--font-size-300)] font-medium truncate mb-1">{session?.user.name}</h3>
                <p className="text-[var(--font-size-200)] text-muted-foreground truncate mb-2">{session?.user.email}</p>
                <div className="flex items-center gap-2">
                  {session?.user.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[var(--font-size-100)] bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[var(--font-size-100)] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <EditUserDialog />
              <ChangePasswordDialog />
            </div>
          </div>

          {/* Email Verification Alert */}
          {!session?.user.emailVerified && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--font-size-200)] font-medium text-yellow-900 dark:text-yellow-200 mb-1">Verify Your Email</p>
                  <p className="text-[var(--font-size-100)] text-yellow-800 dark:text-yellow-300 mb-2">
                    Check your inbox for the verification email.
                  </p>
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
                    className="text-[var(--font-size-100)] h-7"
                  >
                    {emailVerificationPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resend Email"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Security & Sessions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Security Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-[var(--font-size-400)] font-semibold">Security</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Two-Factor Authentication */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-[var(--font-size-300)] font-medium">Two-Factor Authentication</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div>
                      <p className="text-[var(--font-size-200)] font-medium">2FA Status</p>
                      <p className="text-[var(--font-size-100)] text-muted-foreground">
                        {session?.user.twoFactorEnabled ? "Enabled" : "Add an extra layer of security"}
                      </p>
                    </div>
                    <TwoFactorDialog session={session} router={router} />
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <h4 className="text-[var(--font-size-200)] font-medium mb-3">Backup Codes</h4>
                    <BackupCodesManagement session={session} />
                  </div>
                </div>
              </div>

              {/* Passkeys */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-[var(--font-size-300)] font-medium">Passkeys</h3>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <PasskeyManagement />
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-[var(--font-size-400)] font-semibold">Active Sessions</h2>
              </div>
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
                  className="text-[var(--font-size-100)] h-7"
                >
                  Sign out all other sessions
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeSessions
                .filter((session) => session.userAgent)
                .map((session) => {
                  const isCurrentSession = session.id === initialSession?.session.id
                  return (
                    <div key={session.id} className={`flex items-center justify-between p-3 rounded-md border ${isCurrentSession ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {getDeviceIcon(session.userAgent)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[var(--font-size-200)] font-medium truncate">{getDeviceInfo(session.userAgent)}</p>
                            {isCurrentSession && (
                              <span className="text-[var(--font-size-100)] bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[var(--font-size-100)] text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(new Date().toISOString())}</span>
                            </div>
                          </div>
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
                        className={`text-[var(--font-size-100)] h-7 flex-shrink-0 ${isCurrentSession ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}`}
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
              
              {activeSessions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Monitor className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-[var(--font-size-200)]">No active sessions found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-[var(--font-size-400)] font-semibold">Sign Out</h2>
            </div>
            <p className="text-[var(--font-size-200)] text-muted-foreground mb-4">
              Sign out of your account on all devices. You&apos;ll need to sign in again.
            </p>
            <Button
              variant="destructive"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        <Button variant="outline" className="w-full justify-start text-[var(--font-size-200)] h-9">
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--font-size-400)]">Edit Profile</DialogTitle>
          <DialogDescription className="text-[var(--font-size-200)]">Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--font-size-200)]">Full Name</Label>
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
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
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
          variant="outline"
          size="sm"
          className="text-[var(--font-size-200)] h-7"
        >
          {session?.user.twoFactorEnabled ? "Disable" : "Enable"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--font-size-400)]">{session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}</DialogTitle>
          <DialogDescription className="text-[var(--font-size-200)]">
            {session?.user.twoFactorEnabled
              ? "Disable two-factor authentication from your account"
              : "Enable 2FA to secure your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {twoFactorVerifyURI ? (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-muted border border-border rounded-lg">
                <QRCode value={twoFactorVerifyURI} size={140} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-[var(--font-size-200)]">Verification code from your app</Label>
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
              <Label htmlFor="password" className="text-[var(--font-size-200)]">Password</Label>
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
          >
            {isPendingTwoFa ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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
        <Button variant="outline" className="w-full justify-start text-[var(--font-size-200)] h-9">
          <Key className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--font-size-400)]">Change Password</DialogTitle>
          <DialogDescription className="text-[var(--font-size-200)]">Update your account password</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-[var(--font-size-200)]">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[var(--font-size-200)]">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[var(--font-size-200)]">Confirm Password</Label>
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
            <label htmlFor="sign-out-devices" className="text-[var(--font-size-200)]">
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
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}