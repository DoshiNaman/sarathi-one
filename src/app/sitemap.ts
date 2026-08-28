import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Only the pages a stranger should be able to land on. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-08-28");
  const routes = [
    { path: "", priority: 1 },
    { path: "/check", priority: 0.9 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/status", priority: 0.6 },
    { path: "/login", priority: 0.5 },
    { path: "/changelog", priority: 0.4 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified: updated,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
