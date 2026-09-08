"use client";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A cursor-following glow along a card's edge.
 *
 * Ported from React Bits (MIT + Commons Clause) to TypeScript. Three changes to
 * the original:
 *
 *   - every colour is dropped. The original takes a background, a glow hue and
 *     three gradient stops as props, then writes ~15 inline custom properties.
 *     That cannot follow a theme, so the palette lives in globals.css against
 *     the app's own tokens instead and flips with `data-theme` for free. What
 *     is left in JS is the part that genuinely needs it: where the pointer is.
 *   - the intro sweep is dropped with it. It animates seven properties on a
 *     timer, and seven cards playing it at once on a page load is a lot of
 *     motion for decoration.
 *   - the pointer listener detaches under `prefers-reduced-motion`, so the card
 *     is a plain bordered surface for anyone who asked for less movement.
 *
 * Two custom properties come out of here and the stylesheet reads them:
 * `--edge-proximity` (0–100, how close the pointer is to an edge) and
 * `--cursor-angle` (which edge it is near).
 */
export function BorderGlow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const card = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el) return;
    // Asked in the handler rather than cached on mount. Cached, a pointer that
    // moved before the effect attached would light the glow once for someone
    // who asked for less motion — rare, but it is the whole promise.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;

    // How far out the pointer is, as a fraction of the distance to the edge it
    // is heading for. 0 at the centre, 1 on the border.
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 450) % 360;

    el.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
    el.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
  }, []);

  // Leaving mid-move would otherwise freeze the glow where the pointer left it.
  const onPointerLeave = useCallback(() => {
    card.current?.style.setProperty("--edge-proximity", "0");
  }, []);

  return (
    <div
      ref={card}
      data-border-glow
      className={cn("relative isolate", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span aria-hidden data-edge-light />
      {children}
    </div>
  );
}
