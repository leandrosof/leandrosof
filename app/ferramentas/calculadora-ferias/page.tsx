"use client";

import { useState } from "react";

function fmtMoeda(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function calcINSS(base: number) {
  const teto = 7786.02;
  const b = Math.min(base, teto);
  let inss = 0;
  // Faixa 1: 7,5% até R$1.412,00
  inss += Math.min(b, 1412.00) * 0.075;
  // Faixa 2: 9% de R$1.412,01 até R$2.666,68
  if (b > 1412.00) inss += (Math.min(b, 2666.68) - 1412.00) * 0.09;
  // Faixa 3: 12% de R$2.666,69 até R$4.000,03
  if (b > 2666.68) inss += (Math.min(b, 4000.03) - 2666.68) * 0.12;
  // Faixa 4: 14% de R$4.000,04 até o teto
  if (b > 4000.03) inss += (Math.min(b, teto) - 4000.03) * 0.14;
  return inss;
}

function calcIRRF(base: number) {
  // Isenção total até R$5.000,00 (nova regra 2026)
  if (base <= 5000.00) return 0;

  // Tabela progressiva normal
  function tabela(b: number) {
    if (b <= 2259.20) return 0;
    if (b <= 2826.65) return b * 0.075 - 169.44;
    if (b <= 3751.05) return b * 0.15 - 381.44;
    if (b <= 4664.68) return b * 0.225 - 662.77;
    return b * 0.275 - 896.00;
  }

  const impostoTabela = tabela(base);

  // Rampa de transição: R$5.000,01 a R$7.350,00
  if (base <= 7350.00) {
    const fator = (base - 5000.00) / 2350.00;
    return Math.max(0, impostoTabela * fator);
  }

  // Acima de R$7.350: tabela normal
  return Math.max(0, impostoTabela);
}

export default function CalculadoraFerias() {
  const [salario, setSalario] = useState("");
  const [dias, setDias] = useState(30);
  const [abono, setAbono] = useState(false);
  const [adiantar13, setAdiantar13] = useState(false);
  const [dependentes, setDependentes] = useState(0);

  const sal = parseFloat(salario.replace(",", ".")) || 0;

  // Dias de férias: se vendeu abono, são 20 dias de gozo + 10 de abono
  const diasFerias = abono ? 20 : dias;
  const diasAbono = abono ? 10 : 0;

  // Verbas
  const feriasBruto = (sal / 30) * diasFerias;
  const umTercoFerias = feriasBruto / 3;
  const abonoBruto = diasAbono > 0 ? (sal / 30) * diasAbono : 0;
  const umTercoAbono = abonoBruto / 3;

  // Base tributável: APENAS férias + 1/3 (abono + 1/3 abono é ISENTO)
  const baseTributavel = feriasBruto + umTercoFerias;

  // Descontos sobre base tributável
  const inss = calcINSS(baseTributavel);
  const deducaoDep = dependentes * 189.59;
  const baseIRRF = Math.max(0, baseTributavel - inss - deducaoDep);
  const irrf = calcIRRF(baseIRRF);

  // Líquidos
  const liquidoFerias = baseTributavel - inss - irrf;
  const liquidoAbono = abonoBruto + umTercoAbono; // isento
  const totalFerias = liquidoFerias + liquidoAbono;

  // 13º
  const adiantamento13Valor = adiantar13 ? sal / 2 : 0;
  const totalGeral = totalFerias + adiantamento13Valor;

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Calculadora de Férias CLT 2026</h2>
      <p style={{ marginBottom: "0.5rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Atualizada com as novas regras de 2026: isenção de IR até R$5.000, INSS progressivo e abono pecuniário isento de impostos.
      </p>
      <p style={{ marginBottom: "2rem", fontSize: "0.75rem", color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "0.5rem 0.8rem", borderRadius: "10px", maxWidth: "700px" }}>
        ✅ Abono pecuniário + 1/3 do abono são ISENTOS de INSS e IRRF (Art. 143 CLT)
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Salário bruto (R$)</label>
            <input type="text" inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3.000,00" style={inp} />
          </div>
          <div>
            <label style={lbl}>Dias de férias: {abono ? "20 (gozo) + 10 (abono)" : dias}</label>
            <input type="range" min={5} max={30} step={5} value={dias} onChange={(e) => setDias(Number(e.target.value))} disabled={abono} style={{ width: "100%", accentColor: "var(--accent-color)", opacity: abono ? 0.4 : 1 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
            </div>
          </div>
          <div>
            <label style={lbl}>Dependentes (dedução IRRF)</label>
            <input type="number" value={dependentes} onChange={(e) => setDependentes(Math.max(0, Number(e.target.value)))} min={0} max={20} style={inp} />
          </div>
          <Check label="Vender 10 dias (abono pecuniário)" checked={abono} onChange={(v) => { setAbono(v); if (v) setDias(30); }} />
          <Check label="Adiantar 1ª parcela do 13º" checked={adiantar13} onChange={setAdiantar13} />
        </div>

        <div className="card" style={{ opacity: 1, transform: "none" }}>
          <h3 style={{ marginTop: 0, fontSize: "0.9rem", marginBottom: "1rem" }}>Resumo do Cálculo</h3>
          {sal > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <Row label={`Férias (${diasFerias} dias)`} value={feriasBruto} />
              <Row label="+ 1/3 Constitucional" value={umTercoFerias} />

              {abono && (
                <>
                  <div style={{ borderTop: "1px dashed var(--surface-border)", paddingTop: "0.4rem", marginTop: "0.2rem" }}>
                    <Row label="Abono pecuniário (10 dias)" value={abonoBruto} exempt />
                    <Row label="+ 1/3 sobre abono" value={umTercoAbono} exempt />
                    <div style={{ fontSize: "0.6rem", color: "#22c55e", marginTop: "2px" }}>✅ Isento de INSS e IRRF</div>
                  </div>
                </>
              )}

              <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "0.5rem", marginTop: "0.3rem" }}>
                <Row label="Base tributável" value={baseTributavel} bold />
                <Row label="INSS (−)" value={inss} negative />
                <Row label="IRRF (−)" value={irrf} negative />
                {irrf === 0 && baseTributavel > 0 && (
                  <div style={{ fontSize: "0.6rem", color: "#22c55e", marginTop: "-2px" }}>
                    ✅ Isento de IR (base até R$5.000 ou dentro da rampa)
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "0.5rem", marginTop: "0.3rem" }}>
                <Row label="💰 Férias Líquidas" value={liquidoFerias} bold green />
                {abono && <Row label="+ Abono Líquido" value={liquidoAbono} green />}
                <Row label="Total Férias" value={totalFerias} bold green />
              </div>

              {adiantar13 && (
                <div style={{ marginTop: "0.3rem", padding: "0.6rem", background: "rgba(99,102,241,0.1)", borderRadius: "12px" }}>
                  <Row label="+ 1ª parcela 13º" value={adiantamento13Valor} />
                  <div style={{ borderTop: "1px solid rgba(99,102,241,0.2)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <Row label="💰💰 Total a Receber" value={totalGeral} bold green />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>Informe o salário para calcular</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, bold, negative, green, exempt }: {
  label: string; value: number; bold?: boolean; negative?: boolean; green?: boolean; exempt?: boolean;
}) {
  const absVal = Math.abs(value);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.8rem", color: negative ? "#ef4444" : exempt ? "#22c55e" : "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600, fontSize: bold ? "0.95rem" : "0.85rem", color: green ? "#22c55e" : negative ? "#ef4444" : exempt ? "#22c55e" : "var(--text-color)" }}>
        {negative ? "− " : ""}{fmtMoeda(absVal)}
      </span>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "var(--accent-color)", cursor: "pointer" }} />
      <label style={{ fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }} onClick={() => onChange(!checked)}>{label}</label>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", backdropFilter: "blur(10px)" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" };
