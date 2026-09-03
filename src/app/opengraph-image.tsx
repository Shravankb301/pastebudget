import { ImageResponse } from "next/og";

export const alt =
  "PasteBudget shows the real paste budget inside a 200K-token context window";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = [
  ["Published context window", "200,000"],
  ["Already used by the chat", "−191,850"],
  ["Protected for the answer", "−8,000"],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d1715",
          color: "#ffffff",
          padding: "48px 56px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 11,
                background: "#d9ff72",
                color: "#10231f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              [ ]
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 700 }}>PasteBudget</div>
              <div style={{ fontSize: 14, color: "#a8cbbf" }}>
                pastebudget.com
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(217,255,114,.3)",
              borderRadius: 999,
              background: "rgba(217,255,114,.08)",
              color: "#d9ff72",
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".08em",
            }}
          >
            PRIVATE · BROWSER-ONLY
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 52,
            paddingTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 610,
            }}
          >
            <div
              style={{
                display: "flex",
                marginBottom: 16,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: ".18em",
                color: "#a8cbbf",
              }}
            >
              THE CONTEXT-WINDOW TRAP
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 57,
                lineHeight: 0.98,
                fontWeight: 700,
                letterSpacing: "-.055em",
              }}
            >
              <span>Your context window</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span>is</span>
                <span style={{ color: "#d9ff72" }}>not</span>
                <span>your paste budget.</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 570,
                fontSize: 21,
                lineHeight: 1.35,
                color: "#c8d4d0",
              }}
            >
              See what actually fits after prior messages and answer space—then
              split the overflow into safe parts.
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 28,
                fontSize: 14,
                color: "#dce6e2",
              }}
            >
              {["Real API limits", "No uploads", "Free"].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    border: "1px solid rgba(255,255,255,.13)",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.05)",
                    padding: "8px 13px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 420,
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: 22,
              background: "#14221f",
              padding: "26px 28px",
              boxShadow: "0 24px 70px rgba(0,0,0,.28)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 13, color: "#a8cbbf" }}>
                  CLAUDE HAIKU 4.5
                </div>
                <div style={{ fontSize: 21, fontWeight: 700 }}>
                  The 200K context trap
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: 999,
                  background: "#ffded7",
                  color: "#832f24",
                  padding: "7px 11px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                11 OVER
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                paddingBottom: 17,
                borderBottom: "1px solid rgba(255,255,255,.1)",
              }}
            >
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 18,
                    fontSize: 15,
                    color: "#c8d4d0",
                  }}
                >
                  <span>{label}</span>
                  <span style={{ color: "white", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingTop: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <div style={{ fontSize: 13, color: "#9fb0aa" }}>
                  Actual room left
                </div>
                <div style={{ fontSize: 43, fontWeight: 700, color: "#d9ff72" }}>
                  150
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 3,
                }}
              >
                <div style={{ fontSize: 13, color: "#9fb0aa" }}>
                  Prompt needs
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#ff9b86" }}>
                  ≈161
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 16,
                borderRadius: 11,
                background: "#d9ff72",
                color: "#10231f",
                padding: "12px 14px",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              FIX IT → 2 PASTE-READY PARTS
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
