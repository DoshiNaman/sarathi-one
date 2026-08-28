/**
 * Staggered entrance for a screen's top-level blocks.
 *
 * No JavaScript at all, and that is the point. Two previous versions hid the
 * content first and relied on JS to bring it back — one via a GSAP tween, one
 * via IntersectionObserver — and both blanked the page whenever that second
 * step did not run. It does not run in a background tab, which is exactly how
 * someone opens a link you sent them.
 *
 * A CSS animation with `backwards` fill plays once on load and cannot get
 * stuck: if the stylesheet loads the content animates, and if it somehow does
 * not, the content is simply there. Stagger comes from nth-child in globals.css,
 * and reduced motion is handled globally.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-reveal-scope className={className}>
      {children}
    </div>
  );
}
