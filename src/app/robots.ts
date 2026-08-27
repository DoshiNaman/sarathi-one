import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Staff-only surfaces carry nothing a search engine should index, and the
      // per-vehicle pages are synthetic demo records, not public documents.
      disallow: ["/admin", "/admin/", "/api/", "/report/", "/crash/", "/transfer/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
