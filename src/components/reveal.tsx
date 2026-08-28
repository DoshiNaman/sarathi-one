"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Staggered entrance for a screen's top-level blocks.
 *
 * GSAP earns its place on the Trust Report specifically: the report is the
 * emotional beat of the journey, and easing the verdict in above the detail
 * makes the grade land before the reader starts scanning numbers. Everywhere
 * else CSS transitions already do the job for free, so this is not applied
 * site-wide — the audience is on slow connections.
 *
 * Honours prefers-reduced-motion: those users get the final state immediately.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-reveal]"), {
        y: 14,
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.07,
        clearProps: "transform,opacity,visibility",
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
