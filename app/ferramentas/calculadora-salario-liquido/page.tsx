"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function NetSalaryCalculator() {
  const [salarioBruto, setSalarioBruto] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [outrosDescontos, setOutrosDescontos] = useState("");
  const [resultado, setResultado] = useState<{
    bruto: number;
    inss: number;
    irrf: number;
    outros: number;
    liquido: number;
  } | null>(null);

  // Formatação de Moeda
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = (parseInt(numbers, 10) / 100).toFixed(2);
    return "R$ " + amount.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[R$\s.]/g, "").replace(",", "."));
  };

  const calcularSalario = (e: React.FormEvent) => {
    e.preventDefault();
    const bruto = parseCurrency(salarioBruto);
    const deps = parseInt(dependentes) || 0;
    const outros = parseCurrency(outrosDescontos) || 0;

    if (bruto <= 0) return;

    // 1. CÁLCULO DO INSS (Tabela 2026)
    let inss = 0;
    if (bruto <= 1621.00) {
      inss = bruto * 0.075;
    } else if (bruto <= 2902.84) {
      inss = (bruto * 0.09) - 24.32;
    } else if (bruto <= 4354.27) {
      inss = (bruto * 0.12) - 111.41;
    } else if (bruto <= 8475.55) {
      inss = (bruto * 0.14) - 198.49;
    } else {
      inss = 988.09; // Teto Máximo INSS 2026
    }

    // 2. CÁLCULO DO IRRF (Tabela Progressiva Base)
    const deducaoDependentes = deps * 189.59;
    const deducoesLegais = inss + deducaoDependentes;
    const deducaoAplicada = deducoesLegais > 607.20 ? deducoesLegais : 607.20;

    const baseIRRF = bruto - deducaoAplicada;
    let irrf = 0;

    if (baseIRRF > 4664.68) {
      irrf = (baseIRRF * 0.275) - 908.73;
    } else if (baseIRRF > 3751.05) {
      irrf = (baseIRRF * 0.225) - 675.49;
    } else if (baseIRRF > 2826.65) {
      irrf = (baseIRRF * 0.15) - 394.16;
    } else if (baseIRRF > 2428.80) {
      irrf = (baseIRRF * 0.075) - 182.16;
    }

    if (irrf < 0) irrf = 0;

    // 3. APLICAÇÃO DA NOVA REGRA DE ISENÇÃO E REDUÇÃO (2026)
    if (bruto <= 5000) {
       irrf = 0; // Isenção total
    } else if (bruto <= 7350) {
       // Desconto parcial e decrescente para rendas até R$ 7.350
       const redutor = 978.62 - (0.133145 * bruto);
       irrf = irrf - redutor;
       if (irrf < 0) irrf = 0;
    }

    // 4. SALÁRIO LÍQUIDO FINAL
    const liquido = bruto - inss - irrf - outros;

    setResultado({
      bruto,
      inss,
      irrf,
      outros,
      liquido: liquido > 0 ? liquido : 0,
    });
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de Salário Líquido (2026) 💰</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Descubra quanto vai sobrar na sua conta no fim do mês com as tabelas de INSS e IRRF atualizadas.
      </p>

      <div className="grid-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Insira os dados do seu holerite" type="tech">
          <form
            onSubmit={calcularSalario}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Salário Bruto (R$) *
              </label>
              <input
                type="text"
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(formatCurrency(e.target.value))}
                required
                placeholder="R$ 0,00"
                style={{ padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#333", color: "#fff" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  Nº de Dependentes
                </label>
                <input
                  type="number"
                  min="0"
                  value={dependentes}
                  onChange={(e) => setDependentes(e.target.value)}
                  placeholder="0"
                  style={{ padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#333", color: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  Outros Descontos (R$)
                </label>
                <input
                  type="text"
                  value={outrosDescontos}
                  onChange={(e) => setOutrosDescontos(formatCurrency(e.target.value))}
                  placeholder="Ex: Plano de saúde"
                  style={{ padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#333", color: "#fff" }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "1rem", padding: "12px", borderRadius: "8px", border: "none",
                backgroundColor: "#00ffcc", color: "#000", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer"
              }}
            >
              Calcular Salário Líquido
            </button>
          </form>

          {resultado && (
            <div
              style={{
                marginTop: "2rem", padding: "1.5rem", backgroundColor: "rgba(0, 255, 204, 0.1)",
                borderLeft: "4px solid #00ffcc", borderRadius: "0 8px 8px 0",
              }}
            >
              <h4 style={{ marginBottom: "1rem", color: "#fff", textAlign: "center" }}>Seu Holerite Resumido</h4>
              
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                  <span>(+) Salário Bruto:</span>
                  <span>R$ {resultado.bruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", color: "#ff4500" }}>
                  <span>(-) INSS:</span>
                  <span>R$ {resultado.inss.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", color: "#ff4500" }}>
                  <span>(-) Imposto de Renda (IRRF):</span>
                  <span>R$ {resultado.irrf.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </li>
                {resultado.outros > 0 && (
                  <li style={{ display: "flex", justifyContent: "space-between", color: "#ff4500" }}>
                    <span>(-) Outros Descontos:</span>
                    <span>R$ {resultado.outros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </li>
                )}
                
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", fontWeight: "bold", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #444", color: "#00ffcc" }}>
                  <span>(=) Salário Líquido:</span>
                  <span>R$ {resultado.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </li>
              </ul>
              
              <div style={{ marginTop: "1.5rem", padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "5px", fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center" }}>
                ⚠️ <strong>Atenção:</strong> Este cálculo é uma estimativa baseada nas tabelas progressivas padrão e regras de isenção/redução de 2026. O valor real pode ter uma pequena margem de erro dependendo de acordos sindicais ou particularidades da sua empresa.
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}