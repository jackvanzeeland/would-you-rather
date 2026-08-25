import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { QUESTIONS } from "@/lib/data";
import { CATEGORY_ORDER } from "@/lib/theme";
import "./globals.css";

// Runs before hydration so a returning visitor's saved light-mode choice
// applies immediately — otherwise they'd see a flash of the dark default.
// Also retints the theme-color meta so mobile browser chrome matches;
// the meta may not be parsed yet when this runs, hence the DOM-ready retry.
const THEME_INIT_SCRIPT = `
try {
  if (localStorage.getItem('wyr-theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    var setLightChrome = function () {
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', '#f7f6fc');
    };
    setLightChrome();
    document.addEventListener('DOMContentLoaded', setLightChrome);
  }
} catch (e) {}
`;

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Prefer the stable production domain over VERCEL_URL — the latter is the
// per-deployment host, which social scrapers may not even be able to reach
// when deployment protection is on.
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

const dilemmaCount = QUESTIONS.length;
const categoryCount = CATEGORY_ORDER.length;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Would You Rather",
  description: `A party game of impossible choices — ${dilemmaCount} dilemmas across deep thoughts, family, friends, dating, work, dreams, and recreation.`,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Would You Rather",
    description: `Pick a side. ${dilemmaCount} dilemmas across ${categoryCount} categories.`,
    images: [{ url: "/logo.jpeg", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary",
    title: "Would You Rather",
    description: `Pick a side. ${dilemmaCount} dilemmas across ${categoryCount} categories.`,
    images: ["/logo.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#191a1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
