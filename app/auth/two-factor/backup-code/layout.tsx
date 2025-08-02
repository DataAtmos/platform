import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup Code Verification - Data Atmos",
  description: "Use your backup codes to complete two-factor authentication for your Data Atmos account when OTP is unavailable.",
  keywords: [
    "backup codes",
    "backup code verification",
    "2FA backup",
    "Data Atmos backup codes",
    "recovery codes",
    "emergency access"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Backup Code Verification - Data Atmos",
    description: "Use backup codes to complete 2FA verification",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Backup Code Verification - Data Atmos",
    description: "Use backup codes to complete 2FA verification",
  },
};

export default function BackupCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 