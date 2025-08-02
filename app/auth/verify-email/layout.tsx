import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Data Atmos",
  description: "Verify your email address to complete your Data Atmos account setup and access the platform.",
  keywords: [
    "verify email",
    "email verification",
    "confirm email",
    "Data Atmos email verification",
    "account verification",
    "email confirmation"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Verify Email - Data Atmos",
    description: "Verify your email address to complete your account setup",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Verify Email - Data Atmos",
    description: "Verify your email address to complete your account setup",
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 