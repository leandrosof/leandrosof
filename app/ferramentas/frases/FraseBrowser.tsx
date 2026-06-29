"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const CATS_RECORD: Record<string, { label: string; emoji: string }> = {
  motivacao: { label: "Motivação", emoji: "🔥" },
  visao: { label: "Visão", emoji: "🚀" },
  zueira: { label: "Zueira", emoji: "😂" },
  resenha: { label: "Resenha", emoji: "🤡" },
  indiretas: { label: "Indiretas", emoji: "🐍" },
  empreendedor: { label: "Empreendedor", emoji: "💼" },
  tech: { label: "Tech", emoji: "💻" },
  trampo: { label: "Trampo", emoji: "📱" },
  conteudo: { label: "Conteúdo", emoji: "🎬" },
  romance: { label: "Romance", emoji: "❤️" },
  reflexao: { label: "Reflexão", emoji: "🧘" },
  curtas: { label: "Curtas", emoji: "📸" },
  musicas: { label: "Músicas", emoji: "🎵" },
  futebol: { label: "Futebol", emoji: "⚽" },
  carro: { label: "Carro", emoji: "🏎️" },
  filmes: { label: "Filmes", emoji: "🎬" },
};

type Section = { cat: string; label: string; emoji: string; frases: string[] };

export default function FraseBrowserClient({ sections }: { sections: Section[]; allCats: typeof CATS_RECORD }) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [copied, setCopied] = useState<string | null>(null);
  const [allFrases, setAllFrases] = useState<string[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);

  // Carrega todas as frases via API só quando filtra por categoria específica
  useEffect(() => {
    if (categoria === "todas" || allLoaded) return;
    fetch("/api/gerar-frases-story", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tom: categoria, assunto: "" }),
    }).then(r => r.json()).then(d => {
      if (d.frases) setAllFrases(d.frases);
      setAllLoaded(true);
    });
  }, [categoria, allLoaded]);

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto);
    setCopied(texto);
    trackEvent({ action: "copiar_frase", category: "frases", label: texto.slice(0, 30) });
    setTimeout(() => setCopied(null), 1500);
  }

  // Filtra as seções que já vieram do servidor
  const filteredSections = categoria === "todas"
    ? sections.map(s => {
        const filtered = busca.trim().length >= 2
          ? s.frases.filter(f => busca.toLowerCase().split(/\s+/).some(w => f.toLowerCase().includes(w)))
          : s.frases;
        return { ...s, frases: filtered };
      }).filter(s => s.frases.length > 0)
    : [{
        cat: categoria,
        label: CATS_RECORD[categoria]?.label || categoria,
        emoji: CATS_RECORD[categoria]?.emoji || "📖",
        frases: busca.trim().length >= 2
          ? allFrases.filter(f => busca.toLowerCase().split(/\s+/).some(w => f.toLowerCase().includes(w)))
          : allFrases,
      }];

  return (
    <section style={{ paddingTop: "2rem", minHeight: "100vh", paddingBottom: "4rem" }}>
      <h2>Banco de Frases</h2>
      <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
        +2.000 frases prontas para copiar e usar nos seus stories, posts e legendas. Clique na frase para copiar.
      </p>

      <input
        value={busca} onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar frase..."
        style={inputStyle}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "1rem 0" }}>
        <button onClick={() => { setCategoria("todas"); setAllLoaded(false); setBusca(""); }} style={catBtn("todas" === categoria)}>📖 Todas</button>
        {Object.entries(CATS_RECORD).map(([key, { label, emoji }]) => (
          <button key={key} onClick={() => { setCategoria(key); setAllLoaded(false); setBusca(""); trackEvent({ action: "filtro_categoria", category: "frases", label: key }); }} style={catBtn(key === categoria)}>
            {emoji} {label}
          </button>
        ))}
      </div>

      {filteredSections.map(section => (
        <div key={section.cat} style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--accent-color)" }}>
            {section.emoji} {section.label} <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 400 }}>({section.frases.length} frases)</span>
          </h3>
          <div style={{ columns: "280px", columnGap: "1rem" }}>
            {section.frases.map((f, i) => (
              <div key={i} className="card" style={{
                padding: "1rem 1.2rem", marginBottom: "0.8rem", opacity: 1, transform: "none",
                breakInside: "avoid", cursor: "pointer", transition: "all 0.2s",
                border: copied === f ? "1px solid #22c55e" : undefined,
              }} onClick={() => copiar(f)}>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-color)" }}>{f}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                    background: copied === f ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                    color: copied === f ? "#22c55e" : "var(--text-secondary)",
                  }}>{copied === f ? "✅ Copiado!" : "📋 Copiar"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {filteredSections.length === 0 && (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>Nenhuma frase encontrada.</p>
      )}
    </section>
  );
}

function catBtn(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
    border: active ? "1px solid var(--accent-color)" : "1px solid var(--surface-border)",
    background: active ? "rgba(99,102,241,0.1)" : "transparent",
    color: active ? "var(--accent-color)" : "var(--text-secondary)",
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%", maxWidth: "500px", padding: "12px 18px", borderRadius: "30px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "0.95rem", outline: "none",
  backdropFilter: "blur(10px)",
};
