import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1C33",
          color: "#B8935A",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        R&amp;C
      </div>
    ),
    size
  );
}
