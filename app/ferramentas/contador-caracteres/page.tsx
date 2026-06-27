"use client";

import { useState } from "react";

const PLATFORMS = [
  { name: "Instagram", limit: 2200, color: "#dc2743" },
  { name: "Twitter / X", limit: 280, color: "#1da1f2" },
  { name: "TikTok", limit: 2200, color: "#00f2ea" },
  { name: "LinkedIn", limit: 3000, color: "#0a66c2" },
  { name: "YouTube", limit: 5000, color: "#ff0000" },
  { name: "Threads", limit: 500, color: "#fff" },
  { name: "Facebook", limit: 63206, color: "#1877f2" },
];

export default function ContadorCaracteres() {
  const [text, setText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split("\n").length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const limitPercent = Math.min((charCount / selectedPlatform.limit) * 100, 100);

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Contador de Caracteres Avançado</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "700px",
        }}
      >
        Conte caracteres, palavras e linhas com limites específicos de cada
        rede social. Ideal para criar bios, legendas e posts.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {PLATFORMS.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelectedPlatform(p)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border:
                selectedPlatform.name === p.name
                  ? `2px solid ${p.color}`
                  : "1px solid var(--surface-border)",
              background:
                selectedPlatform.name === p.name
                  ? `${p.color}22`
                  : "transparent",
              color:
                selectedPlatform.name === p.name ? p.color : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {p.name} ({p.limit.toLocaleString("pt-BR")})
          </button>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou digite seu texto aqui..."
          style={{
            width: "100%",
            minHeight: "250px",
            padding: "1.2rem",
            borderRadius: "16px",
            border: "1px solid var(--surface-border)",
            background: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "1rem",
            lineHeight: "1.7",
            outline: "none",
            resize: "vertical",
            backdropFilter: "blur(10px)",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div
        style={{
          marginBottom: "1.5rem",
          height: "6px",
          borderRadius: "3px",
          background: "var(--surface-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${limitPercent}%`,
            borderRadius: "3px",
            background:
              limitPercent > 90
                ? "var(--accent-color)"
                : limitPercent > 70
                  ? "#f0a500"
                  : "var(--primary-color)",
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Caracteres"
          value={charCount}
          limit={selectedPlatform.limit}
          color={limitPercent > 90 ? "var(--accent-color)" : "var(--primary-color)"}
        />
        <StatCard
          label="S/ espaços"
          value={charsWithoutSpaces}
        />
        <StatCard label="Palavras" value={wordCount} />
        <StatCard label="Linhas" value={lineCount} />
        <StatCard
          label="Leitura"
          value={`~${readingTime}s`}
        />
      </div>

      <div
        className="card tech-card"
        style={{ maxWidth: "600px", opacity: 1, transform: "none" }}
      >
        <h3>Dicas para {selectedPlatform.name}</h3>
        <p>
          {selectedPlatform.name === "Instagram" &&
            "Legendas de 150-300 caracteres costumam performar melhor. Use quebras de linha para legibilidade."}
          {selectedPlatform.name === "Twitter / X" &&
            "Posts entre 71-100 caracteres têm maior taxa de engajamento. Threads podem ultrapassar o limite."}
          {selectedPlatform.name === "TikTok" &&
            "Use descrições curtas e diretas. O algoritmo favorece textos de 100-150 caracteres."}
          {selectedPlatform.name === "LinkedIn" &&
            "Posts entre 1500-2000 caracteres geram mais engajamento. Abuse de parágrafos curtos."}
          {selectedPlatform.name === "YouTube" &&
            "As primeiras 2-3 linhas aparecem no preview. Coloque o mais importante no início."}
          {selectedPlatform.name === "Threads" &&
            "Textos mais curtos e diretos funcionam melhor. A plataforma favorece autenticidade."}
          {selectedPlatform.name === "Facebook" &&
            "Posts de 40-80 caracteres têm maior taxa de engajamento orgânico."}
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  limit,
  color,
}: {
  label: string;
  value: string | number;
  limit?: number;
  color?: string;
}) {
  return (
    <div
      className="card tech-card"
      style={{
        textAlign: "center",
        padding: "1.2rem 1rem",
        opacity: 1,
        transform: "none",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: color || "var(--text-color)",
          marginBottom: "0.3rem",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        {label}
        {limit !== undefined && (
          <span>
            {" "}
            / {limit.toLocaleString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  );
}
