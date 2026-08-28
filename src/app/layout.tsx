import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { StoreHydrator } from "@/components/store-hydrator";
import { HtmlLang } from "@/components/html-lang";
import { Sahayak } from "@/components/sahayak";
import { SITE } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";

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
    <html lang="en">
      <body
        className={`${sans.variable} ${devanagari.variable} ${mono.variable} bg-background flex min-h-dvh flex-col font-sans antialiased`}
      >
        <StructuredData />
        <StoreHydrator />
        <HtmlLang />
        <Header />
        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {children}
        </main>
        <Sahayak />
        <footer className="text-muted-foreground mt-12 border-t py-6 text-center text-xs">
          Sarathi One — Build What Moves India hackathon prototype. Not affiliated with MoRTH or
          NIC.
        </footer>
      </body>
    </html>
  );
}
