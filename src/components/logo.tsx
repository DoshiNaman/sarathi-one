import { cn } from "@/lib/utils";

/**
 * A prism: one thin beam goes in, a full spectrum comes out.
 *
 * That is precisely the product — the official record gives a buyer one narrow
 * line of information, and this splits it into everything the decision actually
 * needs. Inline SVG so it inherits currentColor for the beam, costs no request,
 * and stays crisp at any size. Deliberately not a seal or emblem: the rules
 * forbid anything that reads as government endorsement.
 */
const SPECTRUM = [
  { className: "stroke-spec-1", y: 12.4 },
  { className: "stroke-spec-2", y: 15.2 },
  { className: "stroke-spec-3", y: 18.0 },
  { className: "stroke-spec-4", y: 20.8 },
  { className: "stroke-spec-5", y: 23.6 },
];

export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Sarathi One"
      className={cn("size-7 shrink-0", className)}
    >
      {/* incoming beam */}
      <path
        d="M1.5 14.5 L11 14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* the prism */}
      <path
        d="M16.2 6.2 L25.4 22.6 L7 22.6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* refracted spectrum */}
      <g fill="none" strokeWidth="1.7" strokeLinecap="round">
        {SPECTRUM.map((band, i) => (
          <path
            key={band.y}
            d={`M25.8 ${band.y} L30.5 ${band.y - 1.4}`}
            className={cn(band.className, animated && "logo-band")}
            style={animated ? { animationDelay: `${240 + i * 70}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

export function Logo({ className, animated }: { className?: string; animated?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark animated={animated} />
      <span className="font-display text-[19px] leading-none tracking-tight">
        Sarathi<span className="text-muted-foreground"> One</span>
      </span>
    </span>
  );
}
