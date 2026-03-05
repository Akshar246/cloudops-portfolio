import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          padding: "56px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 1.5,
            color: "#cbd5e1",
            border: "1px solid #334155",
            borderRadius: 999,
            padding: "10px 18px",
            alignSelf: "flex-start",
          }}
        >
          CLOUDOPS PORTFOLIO
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 74, fontWeight: 700 }}>Akshar Chanchlani</div>
          <div style={{ fontSize: 40, color: "#7dd3fc", fontWeight: 600 }}>
            Cloud / DevOps Engineer
          </div>
          <div style={{ fontSize: 30, color: "#cbd5e1" }}>
            AWS • Next.js • MongoDB • JWT • S3
          </div>
        </div>

        <div
          style={{
            width: "100%",
            borderTop: "1px solid #334155",
            paddingTop: 18,
            fontSize: 24,
            color: "#e2e8f0",
          }}
        >
          Production-style projects, certifications, and proof-based case studies.
        </div>
      </div>
    ),
    size
  );
}
