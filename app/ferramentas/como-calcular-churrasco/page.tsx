"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function BBQCalculator() {
  const [homens, setHomens] = useState("");
  const [mulheres, setMulheres] = useState("");
  const [criancas, setCriancas] = useState("");
  const [resultado, setResultado] = useState<{
    carne: number;
    cerveja: number;
    bebidaSemAlcool: number;
    acompanhamentos: number;
    carvao: number;
  } | null>(null);

  const calcularChurrasco = (e: React.FormEvent) => {
    e.preventDefault();
    
    const h = parseInt(homens) || 0;
    const m = parseInt(mulheres) || 0;
    const c = parseInt(criancas) || 0;

    if (h === 0 && m === 0 && c === 0) return;

    // Cálculo de Carne (em KG)
    const totalCarne = (h * 0.5) + (m * 0.4) + (c * 0.2);

    // Cálculo de Cerveja (em Latas de 350ml)
    const totalCerveja = (h * 5) + (m * 3);

    // Bebidas sem álcool (Refri/Água/Suco em Litros)
    const totalBebidaSemAlcool = (h * 0.5) + (m * 0.75) + (c * 1);

    // Acompanhamentos (Pão de alho, Queijo coalho, Farofa - em KG)
    const totalAcompanhamentos = (h * 0.1) + (m * 0.1);

    // Carvão (Média de 1kg de carvão para cada 1kg de carne)
    const totalCarvao = totalCarne;

    setResultado({
      carne: totalCarne,
      cerveja: totalCerveja,
      bebidaSemAlcool: totalBebidaSemAlcool,
      acompanhamentos: totalAcompanhamentos,
      carvao: totalCarvao,
    });
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de Churrasco 🥩</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Não deixe faltar nem sobrar! Descubra a quantidade exata de carne, bebidas e carvão para o seu churrasco de fim de semana.
      </p>

      <div className="grid-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Quem vai colar?" type="creator">
          <form
            onSubmit={calcularChurrasco}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>👨 Homens</label>
              <input
                type="number"
                min="0"
                value={homens}
                onChange={(e) => setHomens(e.target.value)}
                placeholder="0"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                  width: "100px",
                  textAlign: "center"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>👩 Mulheres</label>
              <input
                type="number"
                min="0"
                value={mulheres}
                onChange={(e) => setMulheres(e.target.value)}
                placeholder="0"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                  width: "100px",
                  textAlign: "center"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>🧒 Crianças</label>
              <input
                type="number"
                min="0"
                value={criancas}
                onChange={(e) => setCriancas(e.target.value)}
                placeholder="0"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                  width: "100px",
                  textAlign: "center"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "1rem",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ff4500", // Cor quente remetendo a fogo/churrasco
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Calcular Quantidades 🔥
            </button>
          </form>

          {resultado && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "rgba(255, 69, 0, 0.1)", // Fundo avermelhado/laranja
                borderLeft: "4px solid #ff4500",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <h4 style={{ marginBottom: "1.2rem", color: "#fff" }}>Lista de Compras:</h4>
              
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span>🥩 Carnes (Bovina, Frango, Linguiça):</span>
                  <strong>{resultado.carne.toFixed(1).replace(".", ",")} kg</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span>🍺 Cerveja:</span>
                  <strong>{resultado.cerveja} latas</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span>🥤 Refri / Água / Suco:</span>
                  <strong>{Math.ceil(resultado.bebidaSemAlcool)} Litros</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                  <span>🧄 Acompanhamentos (Pão de alho, queijo):</span>
                  <strong>{resultado.acompanhamentos.toFixed(1).replace(".", ",")} kg</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #444" }}>
                  <span>🔥 Carvão:</span>
                  <strong>{Math.ceil(resultado.carvao)} kg</strong>
                </li>
              </ul>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}