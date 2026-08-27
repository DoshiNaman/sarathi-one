import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Garage",
  description:
    "Your vehicles, applications, payment receipts and document expiry alerts in one place.",
  alternates: { canonical: "/garage" },
  // Personal surface: nothing here belongs in a search index.
  robots: { index: false, follow: false },
};

export default function GarageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
