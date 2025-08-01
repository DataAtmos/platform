import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dataatmos.ai"),
  title: "Data Atmos - Unify your OLTP, OLAP, and AI Orchestration",
  description:
    "DataAtmos consolidates database operations, data-lake pipelines, and AI/ML workflows in one cloud-native platform. Enterprise-grade governance for small and mid-sized businesses.",
  keywords: [
    "Data Atmos",
    "DataAtmos",
    "dataatmos",
    "data atmos",
    "database operations",
    "data lakes",
    "AI ML workflows",
    "DataOps",
    "cloud-native platform",
    "database management",
    "data pipelines",
    "OLTP",
    "OLAP",
    "AI orchestration",
    "DBaaS",
    "data lake pipelines",
    "agentic reporting",
    "enterprise data governance",
    "unified data platform",
  ],
  authors: [{ name: "Data Atmos Team" }],
  creator: "Data Atmos",
  publisher: "Data Atmos",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dataatmos.ai",
    siteName: "Data Atmos",
    images: ["/og-image.png"],
    title: "Data Atmos - OLTP, OLAP, and AI orchestration is about to get easier with Data Atmos",
    description:
      "Consolidate database operations, data-lake pipelines, and AI/ML orchestration in one cloud-native platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Atmos - OLTP, OLAP, and AI orchestration is about to get easier with Data Atmos",
    description:
      "Consolidate database operations, data-lake pipelines, and AI/ML orchestration in one cloud-native platform.",
    images: ["/og-image.png"],
    creator: "@dataatmos",
  },
  alternates: {
    canonical: "https://dataatmos.ai",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Data Atmos",
              alternateName: ["DataAtmos", "dataatmos", "data atmos"],
              description:
                "DataAtmos consolidates database operations, data-lake pipelines, and AI/ML orchestration in one cloud-native platform. Custom AI agents run databases and drive agentic reporting.",
              applicationCategory: "DatabaseApplication",
              operatingSystem: "Cloud",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Data Atmos",
                url: "https://dataatmos.ai",
              },
              keywords:
                "database operations, data lakes, AI ML workflows, DataOps, cloud-native platform, OLTP, OLAP, AI orchestration",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
      </body>
    </html>
  );
}
