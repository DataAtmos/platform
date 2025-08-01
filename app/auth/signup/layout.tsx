import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Data Atmos",
  description: "Create your Data Atmos account and start managing your database operations, data pipelines, and AI workflows.",
  keywords: [
    "sign up",
    "register",
    "create account",
    "Data Atmos registration",
    "new account",
    "join Data Atmos",
    "account creation"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Sign Up - Data Atmos",
    description: "Create your Data Atmos account and start your data journey",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign Up - Data Atmos",
    description: "Create your Data Atmos account and start your data journey",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 