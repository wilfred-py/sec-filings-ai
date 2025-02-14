import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./Session-Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL_PROD || "https://tldrsec.app",
  ),
  title: "tldrSEC - AI-Powered SEC Filings Summary Service",
  description:
    "Get instant, AI-powered summaries of SEC filings delivered to your inbox. Track 10-K, 10-Q, 8-K reports and insider trading movements.",
  keywords:
    "SEC filings, summarise 10k, summarise 10q, summarise 8k, AI summary, financial reports, stock market, insider trading, investment research",
  openGraph: {
    title: "tldrSEC - AI-Powered SEC Filings Summary Service",
    description:
      "Get instant, AI-powered summaries of SEC filings delivered to your inbox",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "tldrSEC Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tldrSEC - AI-Powered SEC Filings Summary Service",
    description:
      "Get instant, AI-powered summaries of SEC filings delivered to your inbox",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="tldrSEC" />
        <meta
          property="og:description"
          content="AI-powered SEC filings summary sent straight to your email"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
