"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const THIN = [
  ["Registration", "GJ01AB1234"],
  ["Maker / model", "Swift VXI"],
  ["Owner", "AM** S**H"],
  ["Hypothecated", "YES"],
];

/* Tailwind scans source statically, so every class has to appear in full —
   `stroke-spec-${n}` would never be generated. */
const TONE = {
  1: {
    stroke: "stroke-spec-1",
    text: "text-spec-1",
    border: "border-spec-1/45",
    fill: "bg-spec-1/15",
  },
  2: {
    stroke: "stroke-spec-2",
    text: "text-spec-2",
    border: "border-spec-2/45",
    fill: "bg-spec-2/15",
  },
  3: {
    stroke: "stroke-spec-3",
    text: "text-spec-3",
    border: "border-spec-3/45",
    fill: "bg-spec-3/15",
  },
  4: {
    stroke: "stroke-spec-4",
    text: "text-spec-4",
    border: "border-spec-4/45",
    fill: "bg-spec-4/15",
  },
  5: {
    stroke: "stroke-spec-5",
    text: "text-spec-5",
    border: "border-spec-5/45",
    fill: "bg-spec-5/15",
  },
} satisfies Record<number, { stroke: string; text: string; border: string; fill: string }>;

const BANDS = [
  { label: "Financier", value: "HDFC Bank Ltd", tone: 1 as const },
  { label: "Form 35", value: "Never filed", tone: 2 as const },
  { label: "Owners", value: "2", tone: 3 as const },
  { label: "Challans", value: "₹500 pending", tone: 4 as const },
  { label: "Fair price", value: "₹4.65L – ₹5.10L", tone: 5 as const },
];

/* Layout constants, shared by the SVG and the HTML boxes so the rays land
   exactly on each box's left edge. Percentages of the same 100x100 space. */
const BOX_LEFT = 39;
const BOX_TOP = 4;
const BOX_H = 16.2;
const BOX_GAP = 4.75;
const PRISM_EXIT_X = 19;
const PRISM_EXIT_Y = 46;
const boxCentre = (i: number) => BOX_TOP + i * (BOX_H + BOX_GAP) + BOX_H / 2;

export function PrismHero() {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [active, setActive] = useState<number | null>(null);

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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The beam's entry angle follows the pointer, so the whole fan swings. Written
  // straight to a CSS custom property rather than React state: this fires on
  // every pointer move, and a re-render per frame would be wasteful.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const dx = (event.clientX - (b.left + b.width / 2)) / b.width;
      const dy = (event.clientY - (b.top + b.height / 2)) / b.height;
      el.style.setProperty("--tilt", `${(dx * 7).toFixed(2)}deg`);
      el.style.setProperty("--lean", `${(dy * 3).toFixed(2)}deg`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={root}
      data-prism
      data-lit={lit ? "true" : undefined}
      className="bg-ink text-ink-foreground w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 p-4 shadow-2xl"
    >
      {/* the thin record going in */}
      <div className="rounded-xl border border-dashed border-white/15 p-3">
        <p className="mb-2 text-[10px] tracking-[0.16em] text-white/40 uppercase">
          What the portal returns
        </p>
        <dl className="space-y-1">
          {THIN.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 font-mono text-[10.5px]">
              <dt className="text-white/45">{k}</dt>
              <dd className="text-white/75">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[10px] text-white/35">…and three lookups a day.</p>
      </div>

      {/* the optics: beam → prism → five bands */}
      <div className="relative mt-3 h-[268px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            {/* One bloom filter for the whole light group — far cheaper than a
                drop-shadow per ray, and it composites in a single pass. */}
            <filter id="prism-bloom" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="beam-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* everything downstream of the prism swings with the pointer */}
          <g
            filter="url(#prism-bloom)"
            style={{
              transform: "rotate(var(--tilt, 0deg))",
              transformOrigin: `${PRISM_EXIT_X}% ${PRISM_EXIT_Y}%`,
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {BANDS.map((band, i) => (
              <line
                key={band.label}
                data-ray
                data-active={active === i ? "true" : undefined}
                x1={PRISM_EXIT_X}
                y1={PRISM_EXIT_Y}
                x2={BOX_LEFT}
                y2={boxCentre(i)}
                className={TONE[band.tone].stroke}
                strokeWidth={active === i ? 2.4 : 1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={active === null || active === i ? 1 : 0.18}
              />
            ))}
          </g>

          {/* the incoming beam and the glass itself */}
          <g
            style={{
              transform: "rotate(var(--lean, 0deg))",
              transformOrigin: `${PRISM_EXIT_X}% ${PRISM_EXIT_Y}%`,
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <line
              data-beam
              x1={PRISM_EXIT_X}
              y1="0"
              x2={PRISM_EXIT_X}
              y2="34"
              stroke="url(#beam-fade)"
              strokeWidth="1.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              data-glass
              d={`M${PRISM_EXIT_X} 30 L${PRISM_EXIT_X + 11} ${PRISM_EXIT_Y + 4} L${PRISM_EXIT_X - 11} ${PRISM_EXIT_Y + 4} Z`}
              className="fill-white/[0.07] stroke-white/70"
              strokeWidth="1.4"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>

        {/* the five facts, positioned to match the ray endpoints exactly */}
        <ul className="absolute inset-0">
          {BANDS.map((band, i) => (
            <li
              key={band.label}
              data-band
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              style={{
                top: `${BOX_TOP + i * (BOX_H + BOX_GAP)}%`,
                height: `${BOX_H}%`,
                left: `${BOX_LEFT}%`,
              }}
              className={cn(
                "absolute right-0 flex items-center justify-between gap-2 rounded-lg border px-2.5",
                TONE[band.tone].border,
                active === i
                  ? `${TONE[band.tone].fill} translate-x-1`
                  : "translate-x-0 bg-white/[0.03]",
                active !== null && active !== i && "opacity-40",
                "transition-all duration-300"
              )}
            >
              <span className="text-[10.5px] text-white/55">{band.label}</span>
              <span className={cn("font-mono text-[11px] font-medium", TONE[band.tone].text)}>
                {band.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
