"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function TMBCalculator() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("M");
  const [atividade, setAtividade] = useState("1.2");
  const [resultado, setResultado] = useState<{
    tmb: number;
    gastoTotal: number;
    emagrecer: number;
    ganhar: number;
  } | null>(null);

  const calcularTMB = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(peso);
    const a = parseFloat(altura);
    const i = parseInt(idade);
    const fatorAtividade = parseFloat(atividade);

    if (!p || !a || !i) return;

    // Fórmula de Mifflin-St Jeor
    let tmbBase = 10 * p + 6.25 * a - 5 * i;
    tmbBase = sexo === "M" ? tmbBase + 5 : tmbBase - 161;
    
    const gastoDiario = tmbBase * fatorAtividade;

    setResultado({
      tmb: Math.round(tmbBase),
      gastoTotal: Math.round(gastoDiario),
      emagrecer: Math.round(gastoDiario - 500), // Déficit padrão
      ganhar: Math.round(gastoDiario + 500),    // Superávit padrão
    });
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de TMB e Calorias</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Descubra sua Taxa Metabólica Basal (o quanto seu corpo gasta parado) e
        seu gasto calórico diário para ajustar seus treinos e dieta.
      </p>

      <div className="grid-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card title="Insira seus dados" type="creator">
          <form
            onSubmit={calcularTMB}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                  }}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Idade (anos)</label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  required
                  placeholder="Ex: 30"
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
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                  placeholder="Ex: 80"
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
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Altura (cm)</label>
                <input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                  placeholder="Ex: 180"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: "0.5rem" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Nível de Atividade Física
              </label>
              <select
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              >
                <option value="1.2">Sedentário (pouco ou nenhum exercício)</option>
                <option value="1.375">Levemente ativo (exercício leve 1 a 3 dias/semana)</option>
                <option value="1.55">Moderadamente ativo (exercício moderado 3 a 5 dias/semana)</option>
                <option value="1.725">Muito ativo (exercício pesado 6 a 7 dias/semana)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-tiktok"
              style={{ marginTop: "1rem", justifyContent: "center" }}
            >
              Calcular Gasto Calórico
            </button>
          </form>

          {resultado && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "rgba(255, 0, 127, 0.1)",
                borderLeft: "4px solid var(--accent-color)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <p style={{ marginBottom: "10px", fontSize: "1.1rem" }}>
                Sua TMB: <strong>{resultado.tmb} kcal</strong> (o que gasta parado)
              </p>

              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>🎯 Suas Metas Diárias:</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#222", borderRadius: "5px" }}>
                    <span>Para Emagrecer (Déficit):</span>
                    <strong style={{ color: "#ff007f" }}>{resultado.emagrecer} kcal</strong>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#222", borderRadius: "5px" }}>
                    <span>Para Manter o Peso:</span>
                    <strong style={{ color: "#fff" }}>{resultado.gastoTotal} kcal</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#222", borderRadius: "5px" }}>
                    <span>Para Ganhar Massa (Superávit):</span>
                    <strong style={{ color: "#00ffcc" }}>{resultado.ganhar} kcal</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}