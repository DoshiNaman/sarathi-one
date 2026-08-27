import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check a used vehicle before you buy",
  description:
    "Enter a registration number to see what the official record shows, then unlock a full Trust Report: ownership history, active bank loan, challans, and a plain-language verdict.",
  alternates: { canonical: "/check" },
  openGraph: {
    title: "Check a used vehicle before you buy",
    description:
      "Ownership history, active bank loan, challans and a plain-language verdict — before you pay.",
    url: "/check",
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
