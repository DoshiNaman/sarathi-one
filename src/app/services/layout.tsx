import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All services",
  description:
    "Fitness and ATS booking, permits, learner licence, DL renewal, fancy-number auctions, scrapping and grievances — the rest of the Gujarat transport journey on one account.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
