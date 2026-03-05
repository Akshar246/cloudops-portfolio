import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akshar Chanchlani | CloudOps Portfolio",
    template: "%s | Akshar Chanchlani",
  },
  description:
    "Cloud/DevOps portfolio featuring AWS labs, projects, certifications, and proof-based case studies.",
  keywords: [
    "Cloud Engineer",
    "DevOps",
    "AWS",
    "Next.js",
    "MongoDB",
    "S3",
    "Portfolio",
  ],
  authors: [{ name: "Akshar Chanchlani" }],
  creator: "Akshar Chanchlani",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "CloudOps Portfolio",
    title: "Akshar Chanchlani | CloudOps Portfolio",
    description:
      "Production-style cloud portfolio with AWS projects, security decisions, and proof artifacts.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Akshar Chanchlani CloudOps Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshar Chanchlani | CloudOps Portfolio",
    description:
      "AWS labs, projects, certifications, and case-study based cloud engineering work.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
          {/* Neutral container: pages control their own layouts */}
          {children}
        </div>
      </body>
    </html>
  );
}
