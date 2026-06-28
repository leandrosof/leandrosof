"use client";

import { useState, useRef, useEffect } from "react";
import { trackToolUsage } from "@/lib/analytics";

export default function JurosCompostos() {
  const [inicial, setInicial] = useState("1000");
  const [mensal, setMensal] = useState("200");
  const [taxa, setTaxa] = useState("1");
  const [periodo, setPeriodo] = useState(12);
  const [tipoTaxa, setTipoTaxa] = useState<"mensal" | "anual">("mensal");
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackToolUsage("calculadora-juros-compostos", "calcular");
    }
  }, [inicial, mensal, taxa, periodo, tipoTaxa]);

  const taxaDecimal = tipoTaxa === "anual"
    ? Math.pow(1 + parseFloat(taxa || "0") / 100, 1 / 12) - 1
    : parseFloat(taxa || "0") / 100;

  const totalInvestido = parseFloat(inicial || "0") + parseFloat(mensal || "0") * periodo;
  const montante = Array.from({ length: periodo }, (_, i) => {
    const meses = i + 1;
    let val = parseFloat(inicial || "0");
    for (let m = 0; m < meses; m++) {
      val = val * (1 + taxaDecimal) + parseFloat(mensal || "0");
    }
    return val;
  });
  const valorFinal = montante.length > 0 ? montante[montante.length - 1] : 0;
  const juros = valorFinal - totalInvestido;
  const maxVal = Math.max(valorFinal, totalInvestido, 1);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Calculadora de Juros Compostos</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Simule o crescimento do seu dinheiro com juros compostos. Veja quanto rende com aportes mensais.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Valor inicial (R$)" value={inicial} onChange={setInicial} />
          <Field label="Aporte mensal (R$)" value={mensal} onChange={setMensal} />
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Taxa de juros (%)</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input type="number" value={taxa} onChange={(e) => setTaxa(e.target.value)} style={{ ...fieldInput, flex: 1 }} step="0.01" />
              <select value={tipoTaxa} onChange={(e) => setTipoTaxa(e.target.value as "mensal" | "anual")} style={{ ...fieldInput, width: "100px" }}>
                <option value="mensal">a.m.</option>
                <option value="anual">a.a.</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Período: {periodo} meses</label>
            <input type="range" min="1" max="360" value={periodo} onChange={(e) => setPeriodo(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card" style={{ opacity: 1, transform: "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Total Investido</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-color)" }}>R$ {fmt(totalInvestido)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Valor Final</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#22c55e" }}>R$ {fmt(valorFinal)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Juros Ganhos</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--accent-color)" }}>R$ {fmt(juros)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Rentabilidade</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: totalInvestido > 0 ? "#22c55e" : "var(--text-secondary)" }}>{totalInvestido > 0 ? ((juros / totalInvestido) * 100).toFixed(1) : "0"}%</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "1rem", opacity: 1, transform: "none" }}>
            <h3 style={{ marginTop: 0, fontSize: "0.8rem", marginBottom: "1rem" }}>Evolução (barras)</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", height: "120px" }}>
              {montante.filter((_, i) => i % Math.max(1, Math.floor(periodo / 30)) === 0 || i === periodo - 1).map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                  <div style={{ width: "100%", maxWidth: "20px", height: `${(v / maxVal) * 100}%`, background: "var(--accent-color)", borderRadius: "4px 4px 0 0", minHeight: "2px", opacity: 0.8 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} style={fieldInput} />
    </div>
  );
}

const fieldInput: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: "12px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "1rem", outline: "none",
  backdropFilter: "blur(10px)",
};
