"use client";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

/**
 * Stateless by design.
 *
 * The theme lives in <html data-theme> and localStorage, which are external
 * stores — mirroring them into React state would mean reading them in an effect
 * and re-rendering, and would flash the wrong icon before hydration. Instead the
 * icons are both rendered and CSS picks one via the data-theme attribute, so the
 * correct one is right from the very first paint.
 */
export function ThemeToggle() {
  const t = useT();

  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("sarathi-theme", next);
    } catch {
      // Private mode or blocked storage: the choice just will not persist.
    }
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label={t("switchTheme")}>
      <Moon aria-hidden className="theme-icon-light" />
      <Sun aria-hidden className="theme-icon-dark" />
    </Button>
  );
}
