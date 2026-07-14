import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #11998a 0%, #0a5a50 100%)",
          borderRadius: 40,
          color: "white",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: 4,
          fontFamily: "Helvetica Neue, Arial, sans-serif",
        }}
      >
        CS
      </div>
    ),
    { ...size },
  );
}
