"use client";

import { useState } from "react";
import { trackToolUsage } from "@/lib/analytics";

export default function GeradorBioInstagram() {
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("profissional");
  const [emojis, setEmojis] = useState(true);
  const [bios, setBios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    if (!niche.trim()) return;
      setLoading(true);
      setBios([]);
      trackToolUsage("gerador-bio-instagram", "gerar");

    try {
      const res = await fetch("/api/gerar-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, tone, emojis }),
      });

      const data = await res.json();
      if (data.bios) setBios(data.bios);
    } catch {
      alert("Erro ao gerar bios. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function copyBio(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de Bio para Instagram</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "700px",
        }}
      >
        Crie bios criativas e otimizadas para o seu perfil do Instagram usando
        inteligência artificial.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          maxWidth: "600px",
          marginBottom: "2rem",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.4rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Seu nicho / área de atuação
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder='Ex: "Desenvolvedor Front-end e criador de conteúdo tech"'
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid var(--surface-border)",
              background: "var(--card-bg)",
              color: "var(--text-color)",
              fontSize: "0.95rem",
              outline: "none",
              backdropFilter: "blur(10px)",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.4rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Tom de voz
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid var(--surface-border)",
              background: "var(--card-bg)",
              color: "var(--text-color)",
              fontSize: "0.95rem",
              outline: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            <option value="profissional">Profissional</option>
            <option value="criativo">Criativo / Divertido</option>
            <option value="motivacional">Motivacional</option>
            <option value="minimalista">Minimalista / Direto</option>
            <option value="descolado">Descolado / Street</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <input
            type="checkbox"
            id="emojis"
            checked={emojis}
            onChange={(e) => setEmojis(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "var(--primary-color)" }}
          />
          <label
            htmlFor="emojis"
            style={{ fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
          >
            Incluir emojis
          </label>
        </div>

        <button
          onClick={generate}
          disabled={loading || !niche.trim()}
          style={{
            padding: "14px 32px",
            borderRadius: "30px",
            border: "none",
            background: loading
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, var(--primary-color), #0099ff)",
            color: "#000",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "wait" : "pointer",
            transition: "all 0.3s ease",
            alignSelf: "flex-start",
          }}
        >
          {loading ? "Gerando bios..." : "Gerar Bios"}
        </button>
      </div>

      {bios.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
          {bios.map((bio, i) => (
            <div
              key={i}
              className="card tech-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                padding: "1.2rem",
              }}
            >
              <p style={{ flex: 1, margin: 0, color: "var(--text-color)" }}>{bio}</p>
              <button
                onClick={() => copyBio(bio, i)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid var(--primary-color)",
                  background: copied === i ? "var(--primary-color)" : "transparent",
                  color: copied === i ? "#000" : "var(--primary-color)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {copied === i ? "Copiado!" : "Copiar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
