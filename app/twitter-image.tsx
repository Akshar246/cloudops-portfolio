import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          background: "linear-gradient(120deg, #0f172a, #1e293b)",
          color: "#ffffff",
          padding: "56px",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 22, color: "#cbd5e1" }}>CLOUDOPS PORTFOLIO</div>
        <div style={{ fontSize: 68, fontWeight: 700 }}>Akshar Chanchlani</div>
        <div style={{ fontSize: 36, color: "#7dd3fc", fontWeight: 600 }}>
          Cloud / DevOps Engineer
        </div>
        <div style={{ fontSize: 28, color: "#cbd5e1" }}>
          AWS labs, projects, certifications, and case studies
        </div>
      </div>
    ),
    size
  );
}
