import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Data Atmos",
  description: "Set a new password for your Data Atmos account. Enter your new password to complete the reset process.",
  keywords: [
    "reset password",
    "new password",
    "change password",
    "Data Atmos password reset",
    "set new password",
    "password update"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Reset Password - Data Atmos",
    description: "Set a new password for your Data Atmos account",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Reset Password - Data Atmos",
    description: "Set a new password for your Data Atmos account",
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 