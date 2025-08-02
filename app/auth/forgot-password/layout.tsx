import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Data Atmos",
  description: "Reset your Data Atmos account password securely. Enter your email to receive password reset instructions.",
  keywords: [
    "forgot password",
    "password reset",
    "recover password",
    "Data Atmos password recovery",
    "reset account password",
    "password help"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Forgot Password - Data Atmos",
    description: "Reset your Data Atmos account password securely",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Forgot Password - Data Atmos",
    description: "Reset your Data Atmos account password securely",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 