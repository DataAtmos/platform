import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console - Data Atmos",
  description: "Data Atmos console - Manage your database operations, data pipelines, and AI workflows in one unified platform.",
  keywords: [
    "console",
    "dashboard",
    "database management",
    "data pipelines",
    "AI workflows",
    "Data Atmos console",
    "platform dashboard",
    "data operations"
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Console - Data Atmos",
    description: "Manage your database operations, data pipelines, and AI workflows",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Console - Data Atmos",
    description: "Manage your database operations, data pipelines, and AI workflows",
  },
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
} 