import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Data Atmos",
  description: "Secure authentication for Data Atmos platform. Sign in, sign up, and manage your account with enterprise-grade security.",
  keywords: [
    "authentication",
    "login",
    "signup",
    "security",
    "two-factor authentication",
    "passkeys",
    "Data Atmos login",
    "account management"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Authentication - Data Atmos",
    description: "Secure authentication for Data Atmos platform",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Authentication - Data Atmos",
    description: "Secure authentication for Data Atmos platform",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 