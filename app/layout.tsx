import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { BannerProvider } from "@/lib/providers/banner-provider";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
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
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="data-atmos-theme">
          <BannerProvider>
            <Header />
            {children}
          </BannerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}