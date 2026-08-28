"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PORTALS = [
  "Vahan",
  "Sarathi",
  "eChallan",
  "ePayment",
  "Slot booking",
  "PUCC",
  "Fancy number",
  "NR services",
];

/**
 * The core argument, told as motion: eight separate portals converge into one.
 *
 * This is the single place scroll-scrubbing earns its cost — the animation IS
 * the pitch, not decoration on top of it. Reduced-motion users get the end
 * state immediately, and the text below states the same thing so the meaning
 * never depends on the animation running.
 */
export function EightToOne() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>("[data-portal]");

      // Centring lives in xPercent/yPercent, NOT an inline translate: GSAP writes
      // x/y to the same transform property and would otherwise wipe the -50%,
      // making the cards converge on their own top-left corner instead of centre.
      const angleOf = (i: number) => (i / cards.length) * Math.PI * 2;
      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        x: (i: number) => Math.cos(angleOf(i)) * 235,
        y: (i: number) => Math.sin(angleOf(i)) * 100,
        rotate: (i: number) => (i % 2 ? 5 : -5),
        autoAlpha: 1,
      });
      gsap.set("[data-merged]", { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.9 });

      if (reduced) {
        gsap.set(cards, { x: 0, y: 0, rotate: 0, autoAlpha: 0 });
        gsap.set("[data-merged]", { autoAlpha: 1, scale: 1 });
        return;
      }

      // Cards drift gently before the scroll sequence takes over, so the section
      // is alive on arrival rather than a frozen diagram.
      const drifts = cards.map((card, i) =>
        gsap.to(card, {
          y: `+=${i % 2 ? 9 : -9}`,
          x: `+=${i % 3 ? 5 : -5}`,
          duration: 2.6 + (i % 4) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );

      // Pointer parallax uses xPercent/yPercent so it layers on top of the drift
      // and the scroll timeline, which both own x/y. Depth varies per card so the
      // cloud has some dimension to it.
      let interactive = true;
      const onMove = (event: PointerEvent) => {
        if (!interactive) return;
        const bounds = scope.current?.getBoundingClientRect();
        if (!bounds) return;
        const dx = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
        const dy = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
        cards.forEach((card, i) => {
          const depth = 1.4 + (i % 4) * 0.9;
          gsap.to(card, {
            xPercent: -50 + dx * depth,
            yPercent: -50 + dy * depth,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      // Pointer only: a touch device has no hover, and this would fight scrolling.
      const canHover = window.matchMedia("(hover: hover)").matches;
      if (canHover) window.addEventListener("pointermove", onMove, { passive: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 0.6,
        },
      });

      tl.to(cards, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.82,
        stagger: { each: 0.045, from: "edges" },
        ease: "power2.inOut",
      })
        .to(cards, { autoAlpha: 0, duration: 0.3 }, "-=0.15")
        .to(
          "[data-merged]",
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2"
        );

      // The scroll sequence owns position once pinned. Idle drift and pointer
      // parallax both hand control back to it, then resume on the way out —
      // otherwise they keep nudging cards that are trying to converge.
      ScrollTrigger.create({
        trigger: scope.current,
        start: "top top",
        onEnter: () => {
          interactive = false;
          drifts.forEach((d) => d.pause());
          gsap.to(cards, { xPercent: -50, yPercent: -50, duration: 0.4, overwrite: "auto" });
        },
        onLeaveBack: () => {
          interactive = true;
          drifts.forEach((d) => d.resume());
        },
      });

      return () => {
        if (canHover) window.removeEventListener("pointermove", onMove);
      };
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="bg-ink text-ink-foreground relative flex min-h-dvh items-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-ink-muted mb-3 text-center text-[11px] font-medium tracking-[0.18em] uppercase">
          One vehicle transaction today
        </p>
        <h2 className="font-display mx-auto max-w-2xl text-center text-[clamp(1.7rem,4.2vw,3rem)] leading-tight text-balance">
          Eight portals. Four logins. One captcha per page.
        </h2>

        <div className="relative mt-10 h-52 sm:h-64">
          {/* scattered starting positions, converging on centre */}
          {PORTALS.map((p) => (
            <div
              key={p}
              data-portal
              className="border-ink-foreground/20 bg-ink-foreground/[0.06] hover:border-pop/60 hover:bg-ink-foreground/[0.12] invisible absolute top-1/2 left-1/2 cursor-default rounded-xl border px-4 py-2.5 text-sm whitespace-nowrap backdrop-blur transition-colors duration-200"
            >
              {p}
            </div>
          ))}

          <div
            data-merged
            className="bg-ink-foreground text-ink invisible absolute top-1/2 left-1/2 rounded-2xl px-7 py-5 text-center"
          >
            <p className="font-display text-2xl leading-none">Sarathi One</p>
            <p className="mt-1.5 text-xs opacity-70">one login · one place</p>
          </div>
        </div>

        <p className="text-ink-muted mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed">
          Form 29/30 on Vahan, Form 35 for the loan, a separate payment app and a separate
          slot-booking app — each with its own design, its own login and its own captcha. This
          replaces all of it with one account.
        </p>
      </div>
    </section>
  );
}
