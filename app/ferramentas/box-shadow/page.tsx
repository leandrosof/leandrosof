"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function BoxShadowGenerator() {
  const [x, setX] = useState("0");
  const [y, setY] = useState("10");
  const [blur, setBlur] = useState("20");
  const [spread, setSpread] = useState("0");
  const [color, setColor] = useState("rgba(0,0,0,0.5)");

  const boxShadowRule = `${x}px ${y}px ${blur}px ${spread}px ${color}`;

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Gerador de Box-Shadow CSS</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Ajuste os parâmetros visualmente e copie o código CSS da sombra.
        Perfeito para devs e designers UX/UI.
      </p>

      <div
        className="grid-container"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {/* Controles */}
        <Card title="Controles" type="tech">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Eixo X <span>{x}px</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={x}
                onChange={(e) => setX(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Eixo Y <span>{y}px</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={y}
                onChange={(e) => setY(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Blur (Desfoque) <span>{blur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Spread (Propagação) <span>{spread}px</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={spread}
                onChange={(e) => setSpread(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "0.5rem" }}>
                Cor (Hex, RGB ou RGBA)
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              />
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card title="Preview & Código" type="tech">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: boxShadowRule,
              }}
            ></div>
          </div>

          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "5px",
              borderLeft: "4px solid var(--primary-color)",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                color: "#00ffcc",
                margin: 0,
                wordBreak: "break-all",
              }}
            >
              box-shadow: {boxShadowRule};
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
