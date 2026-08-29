"use client";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES } from "@/lib/services";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { watchLayout } from "@/lib/relayout";
import { Button } from "@/components/ui/button";
import { cssVars } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The same spectrum rotation the eight portals use, so the pair matches. */
const HUES = [
  "var(--spec-1)",
  "var(--spec-2)",
  "var(--spec-3)",
  "var(--spec-4)",
  "var(--spec-5)",
  "var(--spec-1)",
  "var(--spec-3)",
];

/**
 * The bookend to EightToOne, and deliberately the same move.
 *
 * That section converges the eight portals a sale passes through today. This
 * one converges the seven services that are still eight more websites, and
 * lands on the button that opens them. Repeating the motion is the point: the
 * argument is that everything collapses into one account, so the page should
 * make the same shape twice rather than invent a second visual language.
 *
 * Simpler than its twin on purpose — no pointer parallax. By this scroll depth
 * the reader has seen that trick once; doing it again reads as a tic, and the
 * second copy of forty lines would have to be maintained alongside the first.
 */
export function SevenToOne() {
  const t = useT();
  const locale = useApp((s) => s.locale);
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      const angleOf = (i: number) => (i / cards.length) * Math.PI * 2 - Math.PI / 2;

      // Radius from the container, not a desktop guess: the section clips its
      // overflow, so a fixed radius drops half the cards off a phone.
      //
      // Centring lives in xPercent/yPercent, never an inline translate: GSAP
      // writes x/y to the same transform and would wipe the -50%.
      function layout() {
        const half = (scope.current?.clientWidth ?? 960) / 2;
        const rx = Math.max(96, Math.min(285, half - 82));
        const ry = rx < 200 ? 118 : 96;
        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          x: (i: number) => Math.cos(angleOf(i)) * rx,
          y: (i: number) => Math.sin(angleOf(i)) * ry,
          rotate: (i: number) => (i % 2 ? 4 : -4),
          autoAlpha: 1,
        });
      }
      layout();
      gsap.set("[data-services-merged]", {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: 0.9,
      });

      if (reduced) {
        gsap.set(cards, { x: 0, y: 0, rotate: 0, autoAlpha: 0 });
        gsap.set("[data-services-merged]", { autoAlpha: 1, scale: 1 });
        return;
      }

      const drifts = cards.map((card, i) =>
        gsap.to(card, {
          y: `+=${i % 2 ? 8 : -8}`,
          duration: 2.8 + (i % 3) * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.6,
        },
      });

      tl.to(cards, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.84,
        stagger: { each: 0.05, from: "edges" },
        ease: "power2.inOut",
      })
        .to(cards, { autoAlpha: 0, duration: 0.3 }, "-=0.15")
        .to(
          "[data-services-merged]",
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        );

      // The drift keeps nudging cards that are trying to converge, so it hands
      // position back to the timeline on the way in and takes it up again on
      // the way out.
      ScrollTrigger.create({
        trigger: scope.current,
        start: "top top",
        onEnter: () => drifts.forEach((d) => d.pause()),
        onLeaveBack: () => drifts.forEach((d) => d.resume()),
      });

      // A pinned section is fixed-position with a frozen width, so it cannot
      // notice the panel docking on its own — see lib/relayout.ts.
      const stopWatching = watchLayout(() => {
        // Only re-ring the cards while they are still in the ring. Mid-scroll
        // the timeline owns x/y, and a gsap.set here would snap converged cards
        // back out to the edges under the reader's cursor.
        if (tl.progress() === 0) layout();
        ScrollTrigger.refresh();
      });

      return stopWatching;
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="bg-ink text-ink-foreground relative flex min-h-dvh items-center overflow-hidden pt-24"
    >
      <span data-spectrum-rule aria-hidden className="absolute inset-x-0 top-0 h-px" />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p
          data-eyebrow
          className="text-ink-muted mb-3 text-center text-[11px] font-medium tracking-[0.18em] uppercase"
        >
          {t("restOfJourney")}
        </p>
        <h2 className="font-display mx-auto max-w-2xl text-center text-[clamp(1.7rem,4.2cqi,3rem)] leading-tight text-balance">
          {t("restTitle")}
        </h2>

        <div className="relative mt-8 h-60 sm:h-64">
          {/* Each service drawn as its own sign-in screen, the same way the
              eight portals are: the repetition across the cards is the
              complaint, so they are not differentiated by colour. */}
          {SERVICES.map((s, i) => (
            <div
              key={s.slug}
              data-service-card
              data-portal
              style={cssVars({ "--portal-hue": HUES[i % HUES.length] })}
              className="border-ink-foreground/12 bg-ink-foreground/[0.05] hover:bg-ink-foreground/[0.1] invisible absolute top-1/2 left-1/2 w-[9.25rem] cursor-default overflow-hidden rounded-lg border shadow-lg shadow-black/30 backdrop-blur transition-colors duration-200"
            >
              <div className="border-ink-foreground/10 bg-ink-foreground/[0.06] flex items-center gap-1.5 border-b px-2 py-1">
                <span className="bg-ink-foreground/25 h-1 w-1 rounded-full" />
                <span className="bg-ink-foreground/25 h-1 w-1 rounded-full" />
                <span className="bg-ink-foreground/25 h-1 w-1 rounded-full" />
                <span className="text-ink-muted ml-0.5 font-mono text-[7.5px] tracking-tight">
                  parivahan.gov.in
                </span>
              </div>
              <p className="px-2.5 pt-2 text-[13px] leading-tight font-medium">{s.short[locale]}</p>
              <div className="text-ink-muted flex items-center gap-1.5 px-2.5 py-2">
                <Lock aria-hidden className="size-2.5 shrink-0" />
                <span className="text-[9px]">{t("signIn")}</span>
                {/* the captcha, as a smear of illegible glyphs */}
                <span className="border-ink-foreground/15 bg-ink-foreground/[0.07] ml-auto rounded-[3px] border px-1 py-px font-mono text-[7px] tracking-[0.12em] italic select-none">
                  x7f2
                </span>
              </div>
            </div>
          ))}

          <div
            data-services-merged
            data-spectrum
            style={cssVars({ "--spectrum-fill": "var(--ink)" })}
            className="invisible absolute top-1/2 left-1/2 rounded-2xl px-7 py-6 text-center shadow-2xl shadow-black/40"
          >
            <p className="font-display text-xl leading-none">{t("appName")}</p>
            <p className="text-ink-muted mt-1.5 text-xs">{t("oneLoginOnePlace")}</p>
            <Button
              variant="pop"
              data-glow
              className="mt-4"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              {t("openServices")}
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>

        {/* The evidence, small, under the animation rather than beside it: the
            section is pinned, so anything wide costs the cards their room. */}
        <dl className="border-ink-muted/20 mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4">
          {[
            ["65", t("statAts")],
            ["12", t("statRvsf")],
            ["40", t("statRto")],
            ["28", t("statContactless")],
          ].map(([n, label]) => (
            <div key={label} className="text-center">
              <dt className="font-display text-2xl leading-none">{n}</dt>
              <dd className="text-ink-muted mx-auto mt-1.5 max-w-[20ch] text-[11px] leading-relaxed">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
