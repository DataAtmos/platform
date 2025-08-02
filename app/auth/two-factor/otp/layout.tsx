import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification - Data Atmos",
  description: "Enter your one-time password (OTP) to complete two-factor authentication for your Data Atmos account.",
  keywords: [
    "OTP verification",
    "one-time password",
    "2FA OTP",
    "Data Atmos OTP",
    "authentication code",
    "verification code"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "OTP Verification - Data Atmos",
    description: "Enter your one-time password to complete 2FA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "OTP Verification - Data Atmos",
    description: "Enter your one-time password to complete 2FA",
  },
};

export default function OtpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 