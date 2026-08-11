import { ImageResponse } from "next/og";

export const alt = "Core — agence de développement logiciel";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f5f7fb",
          color: "#172033",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#5a5ee8",
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Core.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Le logiciel sur mesure.
        </div>
        <div
          style={{
            color: "#5c667b",
            display: "flex",
            fontSize: 28,
            marginTop: 20,
          }}
        >
          Sites web, applications et produits numériques depuis Bamako.
        </div>
      </div>
    ),
    size,
  );
}
