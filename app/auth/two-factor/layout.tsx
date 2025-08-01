import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Two-Factor Authentication - Data Atmos",
  description: "Complete two-factor authentication to securely access your Data Atmos account with enhanced security.",
  keywords: [
    "two-factor authentication",
    "2FA",
    "MFA",
    "multi-factor authentication",
    "Data Atmos 2FA",
    "security verification",
    "OTP verification"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Two-Factor Authentication - Data Atmos",
    description: "Complete two-factor authentication for enhanced security",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Two-Factor Authentication - Data Atmos",
    description: "Complete two-factor authentication for enhanced security",
  },
};

export default function TwoFactorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 