import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "One login for every vehicle and licence service. Demo account, no real OTP sent.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
