import { cn } from "@/lib/utils";

/**
 * Wordmark. The mark is a road narrowing to a horizon inside a rounded square —
 * "sarathi" means charioteer, and the journey read is the point. Drawn as inline
 * SVG so it inherits currentColor and needs no image request.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Sarathi One"
      className={cn("size-7", className)}
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      {/* road edges converging toward the horizon */}
      <path
        d="M9.5 25 L14.2 9 M22.5 25 L17.8 9"
        className="stroke-primary-foreground"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* centre line, dashed like lane markings */}
      <path
        d="M16 23.5 L16 20 M16 17 L16 14.2 M16 11.8 L16 10"
        className="stroke-primary-foreground/70"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[15px] leading-none font-semibold tracking-tight">
        Sarathi<span className="text-muted-foreground font-normal"> One</span>
      </span>
    </span>
  );
}
