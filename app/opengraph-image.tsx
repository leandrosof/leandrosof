import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Leandro Silva - Criador de Conteúdo & Tech";
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          fontFamily: "Segoe UI",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,255,204,0.1) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "4px solid rgba(99,102,241,0.5)",
            marginBottom: 30,
            background: "linear-gradient(135deg, #6366f1, #00ffcc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          LS
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: "linear-gradient(135deg, #00ffcc 0%, #fff 40%, #6366f1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: 12,
            letterSpacing: -2,
          }}
        >
          Leandro Silva
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "#aaa",
            marginBottom: 0,
            maxWidth: 700,
            textAlign: "center",
          }}
        >
          Criador de Conteúdo · Analista de Sistemas · UX & IoT
        </p>
        <p
          style={{
            fontSize: 22,
            color: "#6366f1",
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          leandrosof.com.br
        </p>
      </div>
    ),
    { ...size }
  );
}
