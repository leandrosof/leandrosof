"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { trackToolUsage } from "@/lib/analytics";

export default function ROICalculator() {
  const [investimento, setInvestimento] = useState("");
  const [retorno, setRetorno] = useState("");
  const [resultado, setResultado] = useState<{
    roi: string;
    lucro: number;
  } | null>(null);

  // Função para formatar o valor como Moeda (BRL) enquanto digita
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = (parseInt(numbers, 10) / 100).toFixed(2);
    return "R$ " + amount.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Função para converter "R$ 1.500,00" de volta para 1500.00 para o cálculo
  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[R$\s.]/g, "").replace(",", "."));
  };

  const calcularROI = (e: React.FormEvent) => {
    e.preventDefault();
    trackToolUsage("roi", "calcular");
    const inv = parseCurrency(investimento);
    const ret = parseCurrency(retorno);

    if (isNaN(inv) || isNaN(ret) || inv === 0) return;

    const lucroReal = ret - inv;
    const porcentagemROI = (lucroReal / inv) * 100;

    setResultado({
      roi: porcentagemROI.toFixed(2),
      lucro: lucroReal,
    });
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de ROI para Publis</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Descubra o Retorno sobre Investimento (ROI) de uma campanha de marketing
        de influência ou anúncio pago.
      </p>

      <div className="grid-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Valores da Campanha" type="tech">
          <form
            onSubmit={calcularROI}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Valor Investido
              </label>
              <input
                type="text"
                value={investimento}
                onChange={(e) => setInvestimento(formatCurrency(e.target.value))}
                required
                placeholder="R$ 0,00"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Receita Gerada
              </label>
              <input
                type="text"
                value={retorno}
                onChange={(e) => setRetorno(formatCurrency(e.target.value))}
                required
                placeholder="R$ 0,00"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-email"
              style={{ marginTop: "1rem", justifyContent: "center" }}
            >
              Calcular ROI
            </button>
          </form>

          {resultado && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "rgba(0, 255, 204, 0.1)",
                borderLeft: "4px solid var(--primary-color)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <p style={{ marginBottom: "5px", color: "var(--text-secondary)" }}>
                Resultado da Campanha:
              </p>
              <p style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                Lucro Líquido:{" "}
                <strong style={{ color: resultado.lucro >= 0 ? "#00ffcc" : "#ff007f" }}>
                  {resultado.lucro >= 0 ? "+ " : "- "}
                  R$ {Math.abs(resultado.lucro).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </strong>
              </p>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: resultado.lucro >= 0 ? "#00ffcc" : "#ff007f",
                }}
              >
                ROI: {resultado.roi}%
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}