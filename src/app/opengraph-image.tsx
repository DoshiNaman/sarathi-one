import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated at build time so sharing the link never shows a bare URL card. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 34, color: "#8b8b9e", display: "flex" }}>{SITE.name}</div>
      <div
        style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 20, display: "flex" }}
      >
        Every vehicle service.
      </div>
      <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
        One login. One place.
      </div>
      <div style={{ fontSize: 30, color: "#a1a1b5", marginTop: 32, display: "flex" }}>
        Check a used vehicle before you buy it
      </div>
      <div style={{ fontSize: 22, color: "#f59e0b", marginTop: 40, display: "flex" }}>
        Hackathon prototype · not a government product · synthetic data
      </div>
    </div>,
    size
  );
}
