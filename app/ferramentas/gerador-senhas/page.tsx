"use client";

import { useState, useCallback } from "react";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%&*()_+-=[]{}|;:,.<>?",
};

export default function GeradorSenhas() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = "";
    if (useUpper) pool += CHARS.upper;
    if (useLower) pool += CHARS.lower;
    if (useNumbers) pool += CHARS.numbers;
    if (useSymbols) pool += CHARS.symbols;
    if (!pool) return;

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool[arr[i] % pool.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const strength = () => {
    let score = 0;
    if (useUpper) score++;
    if (useLower) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;
    if (length >= 12) score++;
    if (length >= 20) score++;
    if (score <= 2) return { label: "Fraca", cor: "#ef4444" };
    if (score <= 4) return { label: "Média", cor: "#f59e0b" };
    return { label: "Forte", cor: "#22c55e" };
  };

  const s = strength();

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de Senhas Fortes</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Gere senhas seguras e aleatórias usando criptografia do navegador.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Tamanho: {length} caracteres</label>
            <input type="range" min="6" max="50" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
          </div>
          <Check label="Letras maiúsculas (A-Z)" checked={useUpper} onChange={setUseUpper} />
          <Check label="Letras minúsculas (a-z)" checked={useLower} onChange={setUseLower} />
          <Check label="Números (0-9)" checked={useNumbers} onChange={setUseNumbers} />
          <Check label="Símbolos (!@#$%)" checked={useSymbols} onChange={setUseSymbols} />
          <button onClick={generate} style={{ padding: "14px 32px", borderRadius: "30px", border: "none", background: "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "0.5rem" }}>
            Gerar Senha
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {password ? (
            <>
              <div className="card" style={{ padding: "1.5rem", opacity: 1, transform: "none", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "monospace", wordBreak: "break-all", letterSpacing: "1px", marginBottom: "1rem", color: s.cor }}>
                  {password}
                </div>
                <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                  <button onClick={copy} style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: copied ? "#22c55e" : "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                  <button onClick={generate} style={{ padding: "8px 20px", borderRadius: "20px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    Nova
                  </button>
                </div>
              </div>
              <div className="card" style={{ padding: "1rem 1.5rem", opacity: 1, transform: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>Força da senha</span>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: s.cor }}>{s.label}</span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "var(--surface-border)", marginTop: "0.6rem", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: s.label === "Forte" ? "100%" : s.label === "Média" ? "55%" : "25%", borderRadius: "3px", background: s.cor, transition: "width 0.3s" }} />
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", opacity: 1, transform: "none" }}>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Configure e clique em Gerar Senha</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--accent-color)", cursor: "pointer" }} />
      <label style={{ fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }} onClick={() => onChange(!checked)}>{label}</label>
    </div>
  );
}
