import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track an application",
  description:
    "Track any application with a stage-by-stage timeline. No date of birth, no captcha — just the application number.",
  alternates: { canonical: "/status" },
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
