import { cn } from "@/lib/utils";

/** Page-width container. One place to change the measure. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>{children}</div>;
}

/** Small uppercase label that sits above a section heading. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-3 text-[11px] font-medium tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

/**
 * The disclaimer, stated where a stranger actually sees it.
 * GetCalFresh's pattern: saying what the product is NOT, up front, raises trust
 * rather than lowering it. Ours was buried in the footer.
 */
export function NotAffiliated({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-xs leading-relaxed", className)}>
      An independent prototype — not affiliated with MoRTH, NIC or Parivahan Sewa. Every vehicle,
      OTP and payment here is synthetic.
    </p>
  );
}
