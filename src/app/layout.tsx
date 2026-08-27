import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { StoreHydrator } from "@/components/store-hydrator";
import { HtmlLang } from "@/components/html-lang";
import { Sahayak } from "@/components/sahayak";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarathi One — every vehicle & licence service, one place",
  description:
    "Hackathon demo reimagining Parivahan Sewa's citizen experience: one login, used-vehicle Trust Reports, guided ownership transfer, and a unified garage. All data synthetic. Not a government product.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background flex min-h-dvh flex-col font-sans antialiased`}
      >
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
