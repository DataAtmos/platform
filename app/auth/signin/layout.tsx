import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Data Atmos",
  description: "Sign in to your Data Atmos account with secure authentication including passkeys, Google OAuth, and traditional login.",
  keywords: [
    "sign in",
    "login",
    "authentication",
    "Data Atmos login",
    "passkey login",
    "Google sign in",
    "secure login"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Sign In - Data Atmos",
    description: "Secure sign in to your Data Atmos account",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In - Data Atmos",
    description: "Secure sign in to your Data Atmos account",
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 