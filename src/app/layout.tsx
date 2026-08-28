import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono, Eczar } from "next/font/google";
import "./globals.css";
import { StoreHydrator } from "@/components/store-hydrator";
import { HtmlLang } from "@/components/html-lang";
import { SITE } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";
import { SiteChrome } from "@/components/site-chrome";

// Geist ships no devanagari subset, so every Hindi string in this bilingual app
// was falling back to whatever the OS had. Inter carries the Latin text and Noto
// Sans Devanagari is chained after it for Devanagari glyphs, so one font stack
// serves both locales with no branching.
const sans = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-sans-devanagari",
  subsets: ["devanagari", "latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

// Display face. A serif headline is the fastest way to look art-directed rather
// than generated — every "premium SaaS" template reaches for a geometric sans.
// Eczar is one variable family covering BOTH Latin and Devanagari, so Hindi
// headlines get the same voice as English instead of a mismatched fallback,
// and it weighs less than pairing two separate display faces.
const display = Eczar({
  variable: "--font-display",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase resolves every relative OG/canonical URL below.
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    // Child pages set only their own title; this appends the brand.
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  category: "government services",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Runs before paint: without it the page renders in the OS theme and
          // then jumps to the stored choice.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("sarathi-theme");if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${devanagari.variable} ${mono.variable} ${display.variable} bg-background flex min-h-dvh flex-col font-sans antialiased`}
      >
        <StructuredData />
        <StoreHydrator />
        <HtmlLang />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
