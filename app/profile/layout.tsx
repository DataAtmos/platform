import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Data Atmos",
  description: "Manage your Data Atmos account settings, security preferences, and profile information.",
  keywords: [
    "profile",
    "account settings",
    "user profile",
    "security settings",
    "passkey management",
    "backup codes",
    "Data Atmos profile",
    "account management"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Profile - Data Atmos",
    description: "Manage your Data Atmos account settings and security preferences",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Profile - Data Atmos",
    description: "Manage your Data Atmos account settings and security preferences",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
} 