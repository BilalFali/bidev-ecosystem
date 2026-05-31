import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "bidev.site";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "flex-end",
          padding: "64px", background: "#050505",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 20%, rgba(34,211,238,0.08) 0%, transparent 60%)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
          <span style={{ fontSize: "18px", color: "#22d3ee", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            bidev.site
          </span>
          <h1 style={{ fontSize: title.length > 50 ? "40px" : "52px", fontWeight: 800, color: "#f0f0f0", margin: 0, lineHeight: 1.1 }}>
            {title}
          </h1>
          <p style={{ fontSize: "18px", color: "#71717a", margin: 0 }}>
            Flutter · Mobile Dev · Developer Tools
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
