"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function OneRepMaxCalculator() {
  const [peso, setPeso] = useState("");
  const [reps, setReps] = useState("");
  const [rm, setRm] = useState<number | null>(null);

  const calcularRM = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(peso);
    const r = parseInt(reps);

    if (isNaN(p) || isNaN(r) || r <= 0) return;

    // Fórmula de Brzycki (uma das mais precisas para musculação)
    const calculo = p * (36 / (37 - r));
    setRm(Math.round(calculo));
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de Carga Máxima (1RM)</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Descubra sua One Rep Max (1RM), ou seja, a carga máxima que você
        conseguiria levantar para apenas uma repetição em um exercício.
      </p>

      <div
        className="grid-container"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Card title="Insira seu último levantamento" type="creator">
          <form
            onSubmit={calcularRM}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Carga Levantada (kg)
              </label>
              <input
                type="number"
                step="0.5"
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
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Número de Repetições
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
                placeholder="Ex: 8"
                max="15"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              />
              <small
                style={{ color: "var(--text-secondary)", marginTop: "5px" }}
              >
                *Para maior precisão, use de 1 a 10 repetições.
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-tiktok"
              style={{ marginTop: "1rem", justifyContent: "center" }}
            >
              Calcular 1RM
            </button>
          </form>

          {rm && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "rgba(255, 0, 127, 0.1)",
                borderLeft: "4px solid var(--accent-color)",
                borderRadius: "0 8px 8px 0",
                textAlign: "center",
              }}
            >
              <p
                style={{ marginBottom: "5px", color: "var(--text-secondary)" }}
              >
                Sua 1RM Estimada é:
              </p>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--accent-color)",
                }}
              >
                {rm} kg
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
