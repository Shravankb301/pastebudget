import { ImageResponse } from "next/og";

export const alt = "PasteBudget — Know what fits before you paste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f5f1",
          color: "#171717",
          padding: "72px 80px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: "#171717",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 27,
              fontWeight: 700,
            }}
          >
            [ ]
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>PasteBudget</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, lineHeight: 1.03, fontWeight: 700, letterSpacing: "-0.055em", maxWidth: 950 }}>
            Know what fits before you paste.
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.4, color: "#57534e", maxWidth: 900 }}>
            Private token counting, honest context budgets, and clean text splitting—entirely in your browser.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 18, color: "#4338ca", fontWeight: 700 }}>
          <span>NO UPLOADS</span>
          <span style={{ color: "#a8a29e" }}>·</span>
          <span>NO ACCOUNT</span>
          <span style={{ color: "#a8a29e" }}>·</span>
          <span>FREE</span>
        </div>
      </div>
    ),
    size,
  );
}
