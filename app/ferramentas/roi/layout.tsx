"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function ROICalculator() {
  const [investimento, setInvestimento] = useState("");
  const [retorno, setRetorno] = useState("");
  const [resultado, setResultado] = useState<{
    roi: string;
    lucro: number;
  } | null>(null);

  const calcularROI = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = parseFloat(investimento);
    const ret = parseFloat(retorno);

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

      <div
        className="grid-container"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Card title="Valores da Campanha" type="tech">
          <form
            onSubmit={calcularROI}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Valor Investido (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={investimento}
                onChange={(e) => setInvestimento(e.target.value)}
                required
                placeholder="Ex: 500"
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
                Receita Gerada (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={retorno}
                onChange={(e) => setRetorno(e.target.value)}
                required
                placeholder="Ex: 1500"
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
              <p
                style={{ marginBottom: "5px", color: "var(--text-secondary)" }}
              >
                Resultado da Campanha:
              </p>
              <p style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                Lucro Líquido:{" "}
                <strong
                  style={{
                    color: resultado.lucro >= 0 ? "#00ffcc" : "#ff007f",
                  }}
                >
                  R$ {resultado.lucro.toFixed(2)}
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
