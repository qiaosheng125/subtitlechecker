import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#f6f9fb",
          color: "#111827",
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#0f766e",
            fontWeight: 700,
            marginBottom: 20
          }}
        >
          Subtitle Checker
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 800,
            maxWidth: 920
          }}
        >
          Check SRT subtitle quality before publishing
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.4,
            color: "#475569",
            marginTop: 28,
            maxWidth: 900
          }}
        >
          Line length, CPS, timing overlap, numbering, and repair prompts.
        </div>
      </div>
    ),
    size
  );
}
