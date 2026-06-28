"use client";

import { useState } from "react";
import { trackToolUsage } from "@/lib/analytics";

type Classificacao = {
  label: string; min: number; max: number; cor: string; desc: string;
};

const tabela: Classificacao[] = [
  { label: "Magreza grave", min: 0, max: 16, cor: "#ef4444", desc: "Abaixo do peso com risco à saúde." },
  { label: "Magreza moderada", min: 16, max: 17, cor: "#f59e0b", desc: "Abaixo do peso ideal." },
  { label: "Magreza leve", min: 17, max: 18.5, cor: "#fbbf24", desc: "Levemente abaixo do peso." },
  { label: "Peso normal", min: 18.5, max: 25, cor: "#22c55e", desc: "Peso ideal para sua altura." },
  { label: "Sobrepeso", min: 25, max: 30, cor: "#f59e0b", desc: "Acima do peso ideal." },
  { label: "Obesidade grau I", min: 30, max: 35, cor: "#f97316", desc: "Obesidade leve." },
  { label: "Obesidade grau II", min: 35, max: 40, cor: "#ea580c", desc: "Obesidade moderada." },
  { label: "Obesidade grau III", min: 40, max: 200, cor: "#dc2626", desc: "Obesidade grave." },
];

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [unidadeAltura, setUnidadeAltura] = useState<"m" | "cm">("m");
  const [resultado, setResultado] = useState<{ imc: number; classif: Classificacao } | null>(null);

  function calcular() {
    const p = parseFloat(peso.replace(",", "."));
    let a = parseFloat(altura.replace(",", "."));
    if (!p || !a || a <= 0) return;
    if (unidadeAltura === "cm") a = a / 100;
    if (a > 3) a = a / 100; // auto-corrige se digitou cm no campo m
    const imc = p / (a * a);
    const classif = tabela.find((c) => imc >= c.min && imc < c.max) || tabela[tabela.length - 1];
    setResultado({ imc, classif });
    trackToolUsage("calculadora-imc", "calcular");
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") calcular(); };

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Calculadora de IMC</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Calcule seu Índice de Massa Corporal e veja sua classificação segundo a OMS.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Peso (kg)</label>
            <input type="text" value={peso} onChange={(e) => setPeso(e.target.value)} onKeyDown={handleKey} placeholder="Ex: 70,5" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Altura</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input type="text" value={altura} onChange={(e) => setAltura(e.target.value)} onKeyDown={handleKey} placeholder={unidadeAltura === "m" ? "Ex: 1,75" : "Ex: 175"} style={{ ...inputStyle, flex: 1 }} />
              <select value={unidadeAltura} onChange={(e) => setUnidadeAltura(e.target.value as "m" | "cm")} style={{ ...inputStyle, width: "80px", padding: "12px 8px", cursor: "pointer" }}>
                <option value="m">m</option>
                <option value="cm">cm</option>
              </select>
            </div>
          </div>
          <button onClick={calcular} style={btnStyle}>Calcular IMC</button>
        </div>

        {resultado && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card" style={{ textAlign: "center", padding: "2rem", opacity: 1, transform: "none" }}>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: resultado.classif.cor }}>{resultado.imc.toFixed(1)}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: resultado.classif.cor, marginTop: "0.3rem" }}>{resultado.classif.label}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>{resultado.classif.desc}</div>
            </div>

            <div className="card" style={{ padding: "1.5rem", opacity: 1, transform: "none" }}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "0.9rem" }}>Classificação OMS</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {tabela.map((c) => {
                  const ativo = resultado.classif.label === c.label;
                  return (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "6px 8px", borderRadius: "8px", background: ativo ? `${c.cor}18` : "transparent", border: ativo ? `1px solid ${c.cor}44` : "1px solid transparent" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: c.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", fontWeight: ativo ? 800 : 600, color: ativo ? c.cor : "var(--text-secondary)", flex: 1 }}>{c.label}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>IMC {c.min}–{c.max === 200 ? "40+" : c.max}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: "12px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "1rem", outline: "none",
  backdropFilter: "blur(10px)",
};

const btnStyle: React.CSSProperties = {
  padding: "14px 32px", borderRadius: "30px", border: "none",
  background: "var(--accent-color)", color: "#fff",
  fontWeight: 700, fontSize: "1rem", cursor: "pointer",
};
