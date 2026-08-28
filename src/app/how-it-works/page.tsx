import type { Metadata } from "next";
import { HowItWorks } from "./content";

export const metadata: Metadata = {
  title: "How this works — what is real, what is mocked",
  description:
    "The problem, what changed, exactly what works today, exactly what is simulated, and how the idea could run safely at national scale.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How this works — what is real, what is mocked",
    description: "Who has the problem, what we changed, and an explicit works-vs-simulated split.",
    url: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return <HowItWorks />;
}
