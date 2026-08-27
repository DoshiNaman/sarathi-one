"use client";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

// Keeps <html lang> in step with the locale toggle so screen readers use the
// right pronunciation rules for Devanagari content.
export function HtmlLang() {
  const locale = useApp((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
