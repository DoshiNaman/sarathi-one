"use client";
import { useEffect, useRef } from "react";

/** The lead feather, plus the smaller ones drifting behind it. */
const TRAIL = [
  { scale: 1, lag: 0.18, opacity: 1 },
  { scale: 0.62, lag: 0.1, opacity: 0.5 },
  { scale: 0.42, lag: 0.065, opacity: 0.3 },
  { scale: 0.28, lag: 0.042, opacity: 0.16 },
];

/** Where the feather rests when the pointer is still. */
const REST_TILT = 45;

/**
 * The pointer, as a feather falling.
 *
 * The feather is the illustration itself, cut out of its background, rather
 * than a drawing of one — at 22px the painted barbs still read, and a flat SVG
 * next to this page's other artwork looked like a different product.
 *
 * Four feathers at decreasing size chase the pointer at decreasing speed, so
 * the small ones lag furthest and the shape reads as a tail rather than four
 * copies. Over anything clickable the lead feather grows and stands up, which
 * is the job the native pointer's hand cursor used to do — the native cursor is
 * hidden here, so that signal has to come from somewhere.
 *
 * Deliberately narrow: the landing page only, a real mouse only, off under
 * reduced motion. A citizen filling in Form 29 needs a text caret where their
 * caret should be.
 *
 * Positions are written straight to the elements inside rAF. A mouse move never
 * schedules a React render.
 */
export function FeatherCursor() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const root = host.current;
    if (!root) return;
    // SAFETY: every child of this element is a <span> rendered right below,
    // so the collection is HTMLElements and nothing else can be inserted.
    const parts = Array.from(root.children) as HTMLElement[];

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let hot = false;
    const pos = parts.map(() => ({ x: tx, y: ty }));

    function onMove(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;
      root?.style.setProperty("opacity", "1");
      // Anything the browser would have shown a hand or a caret for.
      // SAFETY: a pointer event's target is an Element or null; the DOM types
      // widen it to EventTarget because other event kinds can target a window.
      const el = e.target as Element | null;
      hot = !!el?.closest("a,button,[role='button'],input,select,textarea,label");
    }
    function onLeave() {
      root?.style.setProperty("opacity", "0");
    }

    function frame() {
      TRAIL.forEach((t, i) => {
        const p = pos[i];
        p.x += (tx - p.x) * t.lag;
        p.y += (ty - p.y) * t.lag;
        // Lean into the direction of travel, around the resting angle. Capped so
        // a fast flick cannot spin the feather all the way over.
        const lean = Math.max(-34, Math.min(34, (tx - p.x) * 1.1));
        const scale = t.scale * (hot && i === 0 ? 1.45 : 1);
        const tilt = hot && i === 0 ? lean * 0.5 : REST_TILT + lean;
        parts[i].style.transform =
          `translate3d(${p.x}px, ${p.y}px, 0) rotate(${tilt}deg) scale(${scale})`;
      });
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    // Hides the native cursor for this page only, via the stylesheet.
    document.documentElement.dataset.feather = "on";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.feather;
    };
  }, []);

  return (
    <div ref={host} data-feather-cursor aria-hidden>
      {TRAIL.map((t, i) => (
        <span key={i} style={{ opacity: t.opacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image
              wraps this in a sized span that fights the transform we write on
              every frame; the file is 52KB and already the right size. */}
          <img src="/krishna/feather-cursor.png" alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}
