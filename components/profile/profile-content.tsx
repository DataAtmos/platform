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
  Edit,
  Laptop,
  Loader2,
  LogOut,
  ShieldCheck,
  ShieldOff,
  AlertCircle,
  Smartphone,
  Monitor,
  Globe,
  User,
  Key,
  Shield,
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

    if (device.type === "mobile") return <Smartphone className="h-4 w-4" />
    if (device.type === "tablet") return <Laptop className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
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
        <div className="loading-shimmer h-8 w-8"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and security preferences.</p>
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
            </div>

            <div className="flex items-start justify-between p-4 border border-border bg-github-subtle">
              <div className="flex items-center gap-4">
                <Avatar className="profile-avatar h-16 w-16">
                  <AvatarImage src={session?.user.image || undefined} alt="Avatar" className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getInitials(session?.user.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{session?.user.name}</h3>
                    {session?.user.emailVerified ? (
                      <span className="status-verified">Verified</span>
                    ) : (
                      <span className="status-unverified">Unverified</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session?.user.email}</p>
                </div>
              </div>
              <EditUserDialog />
            </div>

            {!session?.user.emailVerified && (
              <div className="alert-github alert-warning">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Verify Your Email Address</p>
                      <p className="text-sm mt-1">
                        Please verify your email address. Check your inbox for the verification email.
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
                              toast.success("Verification email sent successfully")
                              setEmailVerificationPending(false)
                            },
                          },
                        )
                      }}
                    >
                      {emailVerificationPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Resend Email"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="section-divider"></div>

          {/* Active Sessions */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Active Sessions</h2>
            </div>

            <div className="space-y-3">
              {activeSessions
                .filter((session) => session.userAgent)
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-border hover:bg-github-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.userAgent)}
                      <div>
                        <p className="text-sm font-medium text-foreground">{getDeviceInfo(session.userAgent)}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.id === initialSession?.session.id ? "Current session" : "Other session"}
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
                      {isTerminating === session.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Terminate"}
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Security Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <TwoFactorDialog session={session} router={router} />
              </div>

              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <ChangePasswordDialog />
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Passkeys */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Passkeys</h2>
            </div>
            <div className="p-4 border border-border">
              <PasskeyManagement />
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Backup Codes */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-foreground">Backup Codes</h2>
            </div>
            <div className="p-4 border border-border">
              <BackupCodesManagement session={session} />
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Sign Out */}
          <div className="space-y-6">
            <div className="p-4 border border-destructive/30 bg-destructive/5">
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
        <Button size="sm" variant="outline">
          <Edit className="h-3 w-3 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
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
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Profile"}
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
        <Button variant={session?.user.twoFactorEnabled ? "destructive" : "default"} size="sm">
          {session?.user.twoFactorEnabled ? (
            <>
              <ShieldOff className="h-3 w-3 mr-2" />
              Disable 2FA
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3 mr-2" />
              Enable 2FA
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
              <div className="flex justify-center p-4 bg-muted border border-border">
                <QRCode value={twoFactorVerifyURI} size={160} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter verification code from your app</Label>
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
              <Label htmlFor="password">Password</Label>
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
              <Loader2 className="h-4 w-4 animate-spin" />
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
        <Button variant="outline" size="sm">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your account password</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
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
            <label htmlFor="sign-out-devices" className="text-sm">
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
