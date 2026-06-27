"use client";

import { useState, useCallback } from "react";

type Harmony = "complementar" | "analogo" | "triadico" | "tetradico" | "monocromatico" | "aleatorio";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(harmony: Harmony): string[] {
  const baseH = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 55 + Math.floor(Math.random() * 15);

  switch (harmony) {
    case "complementar":
      return [
        hslToHex(baseH, s, l),
        hslToHex((baseH + 180) % 360, s, l),
        hslToHex(baseH, s - 15, l + 10),
        hslToHex((baseH + 180) % 360, s - 15, l - 10),
        hslToHex(baseH, s - 25, l + 20),
      ];
    case "analogo":
      return [
        hslToHex(baseH, s, l),
        hslToHex((baseH + 30) % 360, s, l),
        hslToHex((baseH + 60) % 360, s, l),
        hslToHex((baseH - 30 + 360) % 360, s, l),
        hslToHex((baseH - 60 + 360) % 360, s, l),
      ];
    case "triadico":
      return [
        hslToHex(baseH, s, l),
        hslToHex((baseH + 120) % 360, s, l),
        hslToHex((baseH + 240) % 360, s, l),
        hslToHex(baseH, s - 10, l + 15),
        hslToHex((baseH + 120) % 360, s - 10, l + 15),
      ];
    case "tetradico":
      return [
        hslToHex(baseH, s, l),
        hslToHex((baseH + 90) % 360, s, l),
        hslToHex((baseH + 180) % 360, s, l),
        hslToHex((baseH + 270) % 360, s, l),
        hslToHex(baseH, s - 20, l + 20),
      ];
    case "monocromatico":
      return [
        hslToHex(baseH, s, l + 20),
        hslToHex(baseH, s, l + 10),
        hslToHex(baseH, s, l),
        hslToHex(baseH, s, l - 10),
        hslToHex(baseH, s, l - 20),
      ];
    case "aleatorio":
    default:
      return Array.from({ length: 5 }, () =>
        hslToHex(Math.random() * 360, 50 + Math.random() * 40, 40 + Math.random() * 30)
      );
  }
}

export default function GeradorPaletaCores() {
  const [harmony, setHarmony] = useState<Harmony>("complementar");
  const [palette, setPalette] = useState<string[]>(() => generatePalette("complementar"));
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedAll, setCopiedAll] = useState(false);

  const regenerate = useCallback(() => {
    setPalette((prev) => {
      const newColors = generatePalette(harmony);
      return prev.map((c, i) => (locked[i] ? c : newColors[i]));
    });
  }, [harmony, locked]);

  function handleHarmonyChange(h: Harmony) {
    setHarmony(h);
    setLocked([false, false, false, false, false]);
    setPalette(generatePalette(h));
  }

  function toggleLock(index: number) {
    setLocked((prev) => prev.map((l, i) => (i === index ? !l : l)));
  }

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex);
  }

  function copyAll() {
    navigator.clipboard.writeText(palette.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de Paleta de Cores</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "700px",
        }}
      >
        Gere combinações de cores harmoniosas para seus projetos de design, UI
        e desenvolvimento web.
      </p>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {(
          [
            ["complementar", "Complementar"],
            ["analogo", "Análogo"],
            ["triadico", "Triádico"],
            ["tetradico", "Tetrádico"],
            ["monocromatico", "Monocromático"],
            ["aleatorio", "Aleatório"],
          ] as [Harmony, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleHarmonyChange(key)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: harmony === key ? "2px solid var(--primary-color)" : "1px solid var(--surface-border)",
              background: harmony === key ? "var(--glow-primary)" : "transparent",
              color: harmony === key ? "var(--primary-color)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {palette.map((color, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 120px",
              minWidth: "120px",
              height: "200px",
              borderRadius: "16px",
              background: color,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0.8rem",
              cursor: "default",
              border: locked[i] ? "3px solid #fff" : "3px solid transparent",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            <button
              onClick={() => toggleLock(i)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: locked[i] ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
            >
              {locked[i] ? "🔒" : "🔓"}
            </button>
            <span
              onClick={() => copyHex(color)}
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                cursor: "pointer",
              }}
              title="Clique para copiar"
            >
              {color.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={regenerate}
          className="btn"
          style={{
            background: "var(--glow-primary)",
            border: "1px solid var(--primary-color)",
            color: "var(--primary-color)",
          }}
        >
          Gerar Nova Paleta
        </button>
        <button
          onClick={copyAll}
          className="btn btn-email"
        >
          {copiedAll ? "Copiado!" : "Copiar Tudo (CSS/Hex)"}
        </button>
      </div>
    </section>
  );
}
