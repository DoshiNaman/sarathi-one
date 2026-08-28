import { SITE } from "@/lib/site";

/**
 * JSON-LD for the site. Describes what this is and, importantly, that it is a
 * demo — the disclaimer belongs in the machine-readable description too, not
 * only in the visible banner.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: ["en-IN", "hi-IN"],
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE.url}/#app`,
        name: SITE.name,
        url: SITE.url,
        applicationCategory: "GovernmentService",
        operatingSystem: "Any modern web browser",
        browserRequirements: "Requires JavaScript",
        inLanguage: ["en-IN", "hi-IN"],
        description: SITE.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        disambiguatingDescription:
          "Independent hackathon prototype. Not affiliated with, endorsed by, or connected to the Ministry of Road Transport and Highways, NIC, or Parivahan Sewa. All data is synthetic.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // SAFETY: `data` is a literal built above from our own constants; no user
      // input reaches it, so there is nothing to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
