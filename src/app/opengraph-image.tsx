import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Semita — Find your path through AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0c0f",
          color: "#f2f4f6",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#4ade80",
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 600 }}>semita</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 650, lineHeight: 1.1, maxWidth: 900 }}>
            Find your path through AI.
          </div>
          <div style={{ fontSize: 28, color: "#8b95a1", maxWidth: 820 }}>
            Compare LLMs by cost, context and use case — leverage AI, don’t be
            replaced by it.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
