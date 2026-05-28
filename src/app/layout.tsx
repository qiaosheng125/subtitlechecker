import type { Metadata } from "next";
import { AnalyticsScripts } from "./analytics";
import "./globals.css";

const siteUrl = "https://www.subtitlechecker.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SRT Subtitle Checker - Line Length, CPS, and Timing Validator",
    template: "%s | Subtitle Checker"
  },
  description:
    "Check SRT subtitles for line length, CPS, two-line limits, timing overlaps, numbering issues, and readability problems. Runs in your browser with no upload.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "SRT Subtitle Checker",
    description:
      "Paste or upload an SRT file and get a clear subtitle quality report with line length, CPS, timing, and repair suggestions.",
    url: siteUrl,
    siteName: "Subtitle Checker",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Subtitle Checker preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SRT Subtitle Checker",
    description:
      "Check SRT subtitles for line length, CPS, timing overlaps, and readability issues before publishing.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
