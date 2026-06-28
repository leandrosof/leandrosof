"use client";

import { useState } from "react";
import { trackToolUsage } from "@/lib/analytics";

type Result = { populares: string[]; nichadas: string[]; tendencias: string[] };

export default function GeradorHashtags() {
  const [tema, setTema] = useState("");
  const [plataforma, setPlataforma] = useState("Instagram");
  const [qtd, setQtd] = useState(15);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  async function gerar() {
    if (!tema.trim()) return;
    trackToolUsage("gerador-hashtags", "gerar");
    setLoading(true);
    try {
      const res = await fetch("/api/gerar-hashtags", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, plataforma, quantidade: qtd }),
      });
      const data = await res.json();
      if (data.populares) setResult(data);
    } catch { /* */ }
    setLoading(false);
  }

  function copiarTodas() {
    if (!result) return;
    const todas = [...result.populares, ...result.nichadas, ...result.tendencias].join(" ");
    navigator.clipboard.writeText(todas);
    setCopied("todas");
    setTimeout(() => setCopied(""), 2000);
  }

  function copiarCat(cat: string, tags: string[]) {
    navigator.clipboard.writeText(tags.join(" "));
    setCopied(cat);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de Hashtags com IA</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Gere hashtags otimizadas para aumentar o alcance dos seus posts. A IA separa em populares, nichadas e tendências.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Tema do post</label>
            <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder='Ex: "Dicas de musculação para iniciantes"' onKeyDown={(e) => e.key === "Enter" && gerar()} style={inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={lbl}>Plataforma</label>
              <select value={plataforma} onChange={(e) => setPlataforma(e.target.value)} style={sel}>
                <option>Instagram</option>
                <option>TikTok</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Quantidade</label>
              <select value={qtd} onChange={(e) => setQtd(Number(e.target.value))} style={sel}>
                <option value={10}>10 hashtags</option>
                <option value={15}>15 hashtags</option>
                <option value={20}>20 hashtags</option>
                <option value={30}>30 hashtags</option>
              </select>
            </div>
          </div>
          <button onClick={gerar} disabled={loading || !tema.trim()} style={{ padding: "14px", borderRadius: "30px", border: "none", background: tema ? "var(--accent-color)" : "rgba(99,102,241,0.2)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: tema ? "pointer" : "default" }}>
            {loading ? "Gerando..." : "Gerar Hashtags"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {result ? (
            <>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={copiarTodas} style={btnCopy(copied === "todas")}>{copied === "todas" ? "✅ Copiado!" : "📋 Copiar Todas"}</button>
              </div>
              <TagBlock title="🔥 Populares" tags={result.populares} color="#f59e0b" onCopy={() => copiarCat("pop", result.populares)} copied={copied === "pop"} />
              <TagBlock title="🎯 Nichadas" tags={result.nichadas} color="#22c55e" onCopy={() => copiarCat("nich", result.nichadas)} copied={copied === "nich"} />
              <TagBlock title="🚀 Tendências" tags={result.tendencias} color="#6366f1" onCopy={() => copiarCat("tend", result.tendencias)} copied={copied === "tend"} />
            </>
          ) : (
            <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", opacity: 1, transform: "none" }}>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Digite um tema e clique em Gerar</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TagBlock({ title, tags, color, onCopy, copied }: { title: string; tags: string[]; color: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="card" style={{ opacity: 1, transform: "none", borderLeft: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <h3 style={{ margin: 0, fontSize: "0.8rem", color }}>{title}</h3>
        <button onClick={onCopy} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "4px 12px", borderRadius: "10px", border: "none", background: copied ? "#22c55e" : "rgba(255,255,255,0.05)", color: copied ? "#fff" : "var(--text-secondary)", cursor: "pointer" }}>{copied ? "Copiado" : "Copiar"}</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {tags.map((t, i) => (
          <span key={i} style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--surface-border)", color: "var(--text-color)", fontSize: "0.8rem", fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function btnCopy(active: boolean): React.CSSProperties {
  return { padding: "8px 20px", borderRadius: "20px", border: "none", background: active ? "#22c55e" : "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" };
}

const inp: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", backdropFilter: "blur(10px)" };
const sel: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.85rem", outline: "none", cursor: "pointer" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" };
