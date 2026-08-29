/**
 * When a pinned section has to measure itself again.
 *
 * ScrollTrigger's `pin` takes the section out of the document flow and gives it
 * a fixed position with a pixel width captured at refresh time. That means two
 * things: the panel's `padding-right` on <body> cannot reach a pinned section,
 * and a ResizeObserver on that section never fires while it is pinned, because
 * its box is now a constant. Watching the section is therefore useless exactly
 * when it matters.
 *
 * So the panel announces itself instead, and anything that measures the page
 * listens. Twice per change: once immediately for the un-pinned case, and once
 * after the width transition has finished for the pinned one.
 */

/** Long enough to clear the 260ms padding transition on <body>. */
const SETTLE_MS = 340;

export const LAYOUT_EVENT = "krishna:layout";

/** Call from anything that changes how wide the page is. */
export function announceLayoutChange() {
  window.dispatchEvent(new Event(LAYOUT_EVENT));
  window.setTimeout(() => window.dispatchEvent(new Event(LAYOUT_EVENT)), SETTLE_MS);
}

/**
 * Runs `measure` on a layout change and on resize, never more than once a
 * frame. Returns the cleanup.
 */
export function watchLayout(measure: () => void) {
  let queued = 0;
  const run = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(measure);
  };

  window.addEventListener(LAYOUT_EVENT, run);
  window.addEventListener("resize", run);
  window.addEventListener("orientationchange", run);

  return () => {
    cancelAnimationFrame(queued);
    window.removeEventListener(LAYOUT_EVENT, run);
    window.removeEventListener("resize", run);
    window.removeEventListener("orientationchange", run);
  };
}
