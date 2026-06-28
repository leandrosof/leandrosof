"use client";

import { useState } from "react";

export default function FormatadorJSON() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  function format() {
    try {
      const parsed = JSON.parse(input.trim() || "{}");
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "JSON inválido");
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input.trim() || "{}");
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "JSON inválido");
      setOutput("");
    }
  }

  function validate() {
    try {
      const parsed = JSON.parse(input.trim() || "{}");
      const size = new Blob([input]).size;
      const keys = countKeys(parsed);
      setOutput("");
      setError("");
      alert(`✅ JSON válido!\n\n📊 Estatísticas:\n• Tamanho: ${formatSize(size)}\n• Chaves no raiz: ${Object.keys(parsed).length}\n• Total de chaves: ${keys}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "JSON inválido");
    }
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Formatador e Validador JSON</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Formate, valide ou minifique JSON. Perfeito para desenvolvedores depurando APIs e configs.
      </p>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <button onClick={format} style={actionBtn("var(--accent-color)")}>Formatar</button>
        <button onClick={minify} style={actionBtn("#f59e0b")}>Minificar</button>
        <button onClick={validate} style={actionBtn("#22c55e")}>Validar</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} style={{ padding: "8px 14px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.85rem", outline: "none", cursor: "pointer" }}>
          <option value={2}>2 espaços</option>
          <option value={4}>4 espaços</option>
          <option value={0}>Tab</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>JSON de entrada</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); }} placeholder='Cole seu JSON aqui... Ex: {"nome": "Leandro"}' rows={14} style={taStyle} />
          {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem", fontFamily: "monospace" }}>{error}</p>}
        </div>
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>Resultado</label>
          <textarea value={output} readOnly rows={14} style={{ ...taStyle, opacity: output ? 1 : 0.5 }} placeholder="JSON formatado aparece aqui..." />
          {output && (
            <button onClick={copy} style={{ position: "absolute", top: "2rem", right: "0.8rem", padding: "6px 14px", borderRadius: "20px", border: "none", background: copied ? "#22c55e" : "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
              {copied ? "Copiado!" : "Copiar"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function countKeys(obj: unknown): number {
  if (typeof obj !== "object" || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countKeys(item), 0);
  let count = 0;
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    count++;
    count += countKeys((obj as Record<string, unknown>)[key]);
  }
  return count;
}

function formatSize(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

const taStyle: React.CSSProperties = {
  width: "100%", padding: "1rem", borderRadius: "12px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "0.8rem", fontFamily: "monospace",
  outline: "none", resize: "vertical", backdropFilter: "blur(10px)",
  lineHeight: 1.6, tabSize: 2,
};

function actionBtn(color: string): React.CSSProperties {
  return { padding: "8px 20px", borderRadius: "30px", border: "none", background: color, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" };
}
