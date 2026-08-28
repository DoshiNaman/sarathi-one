import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Inline CSS custom properties.
 *
 * React types `style` as CSSProperties, which has no index signature for
 * `--x` keys, so every custom property otherwise needs its own assertion at
 * the call site. One here instead of one per component.
 */
export function cssVars(vars: Record<`--${string}`, string | number>): React.CSSProperties {
  // SAFETY: every key is `--`-prefixed, so the object contains only CSS custom
  // properties. React does not validate style keys — it forwards anything
  // starting with `--` straight to CSSStyleDeclaration.setProperty, which is
  // exactly the intended behaviour.
  return vars as React.CSSProperties;
}
