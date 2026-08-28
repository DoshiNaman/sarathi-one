"use client";
import { useEffect, useRef, useState } from "react";
import { useT, type TKey } from "@/lib/i18n";

const THIN = [
  "Registration    GJ01AB1234",
  "Maker / model   Swift VXI",
  "Owner           AM** S**H",
  "Hypothecated    YES",
];

const TONE = {
  1: { text: "text-spec-1", border: "border-spec-1/45", bg: "bg-spec-1", stroke: "stroke-spec-1" },
  2: { text: "text-spec-2", border: "border-spec-2/45", bg: "bg-spec-2", stroke: "stroke-spec-2" },
  3: { text: "text-spec-3", border: "border-spec-3/45", bg: "bg-spec-3", stroke: "stroke-spec-3" },
  4: { text: "text-spec-4", border: "border-spec-4/45", bg: "bg-spec-4", stroke: "stroke-spec-4" },
  5: { text: "text-spec-5", border: "border-spec-5/45", bg: "bg-spec-5", stroke: "stroke-spec-5" },
} satisfies Record<number, { text: string; border: string; bg: string; stroke: string }>;

/**
 * `valueKey` is translated; `value` is printed as-is. A bank name, a count and a
 * price range read the same in all three locales, so only two of the five rows
 * carry words that need translating.
 */
const FULL: {
  label: TKey;
  value?: string;
  valueKey?: TKey;
  tone: keyof typeof TONE;
}[] = [
  { label: "financier", value: "HDFC Bank Ltd", tone: 1 },
  { label: "form35", valueKey: "neverFiled", tone: 2 },
  { label: "ownersLabel", value: "2", tone: 3 },
  { label: "challansShort", valueKey: "pendingAmount", tone: 4 },
  { label: "fairPrice", value: "₹4.65L – ₹5.10L", tone: 5 },
];

/**
 * The hero visual: the thin official record enters a prism and leaves as the
 * things that actually decide a purchase.
 *
 * Pure DOM, SVG and CSS. A WebGL scene here would cost roughly 234 KB gzipped —
 * close to doubling this app's client JS — to decorate one screen for an
 * audience the brief says is on slower connections.
 *
 * Nothing is hidden by default. The animation starts only once the element is
 * on screen AND the browser reports it can animate, so a frozen or
 * JS-less render still shows the whole diagram.
 */
export function PrismHero() {
  const t = useT();
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={root}
      data-prism
      data-lit={lit ? "true" : undefined}
      className="relative w-full max-w-[420px] select-none"
      aria-hidden
    >
      {/* the thin record going in */}
      <div className="border-muted-foreground/25 bg-card/40 rounded-xl border border-dashed p-3 backdrop-blur-sm">
        <p className="text-muted-foreground/70 mb-2 text-[10px] tracking-[0.16em] uppercase">
          {t("portalReturns")}
        </p>
        <ul className="space-y-1">
          {THIN.map((row) => (
            <li key={row} className="text-muted-foreground font-mono text-[10.5px] whitespace-pre">
              {row}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground/60 mt-2 text-[10px]">{t("threeLookups")}</p>
      </div>

      {/* the beam, the prism, the split */}
      <div className="relative h-28">
        <svg
          viewBox="0 0 420 112"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {/* one thin beam entering from the record above */}
          <line
            data-beam
            x1="210"
            y1="0"
            x2="210"
            y2="30"
            className="stroke-foreground/70 [filter:drop-shadow(0_0_5px_var(--foreground))]"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* prism body */}
          <path
            data-glass
            d="M210 30 L232 66 L188 66 Z"
            className="fill-foreground/[0.09] stroke-foreground/90 [filter:drop-shadow(0_0_7px_var(--foreground))]"
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* five rays fanning out to sit above their rows */}
          {FULL.map((row, i) => (
            <line
              key={row.label}
              data-ray
              x1="210"
              y1="66"
              x2={40 + i * 85}
              y2="112"
              className={`stroke-current [filter:drop-shadow(0_0_6px_currentColor)] ${TONE[row.tone].text}`}
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* A packet of light re-runs the whole path every few seconds: down
              the beam, through the glass, out along each ray. It restates the
              product in motion while someone is reading the headline, then
              rests, so the panel is alive without ever being busy.

              pathLength="1" normalises every line to a length of 1, so one set
              of dash values works for the short beam and the long angled rays
              alike. */}
          <line
            data-pulse
            pathLength="1"
            x1="210"
            y1="0"
            x2="210"
            y2="30"
            className="stroke-foreground [filter:drop-shadow(0_0_5px_var(--foreground))]"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {FULL.map((row, i) => (
            <line
              key={`pulse-${row.label}`}
              data-pulse
              pathLength="1"
              x1="210"
              y1="66"
              x2={40 + i * 85}
              y2="112"
              className={`stroke-current [filter:drop-shadow(0_0_7px_currentColor)] ${TONE[row.tone].text}`}
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      {/* what comes out */}
      <ul className="-mt-3 space-y-1.5">
        {FULL.map((row) => (
          <li
            key={row.label}
            data-band
            className={`bg-card/55 flex items-center justify-between gap-3 rounded-lg border border-l-[3px] px-3 py-2 backdrop-blur-sm ${TONE[row.tone].border}`}
          >
            <span className="text-muted-foreground text-[11px]">{t(row.label)}</span>
            <span className={`font-mono text-[11.5px] font-medium ${TONE[row.tone].text}`}>
              {row.valueKey ? t(row.valueKey) : row.value}
            </span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_currentColor] ${TONE[row.tone].bg} ${TONE[row.tone].text}`}
              data-dot
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
