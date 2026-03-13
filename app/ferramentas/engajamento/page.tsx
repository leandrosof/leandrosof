"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function EngagementCalculator() {
  const [seguidores, setSeguidores] = useState("");
  const [curtidas, setCurtidas] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [taxa, setTaxa] = useState<string | null>(null);

  const calcularEngajamento = (e: React.FormEvent) => {
    e.preventDefault();
    const seg = parseInt(seguidores);
    const cur = parseInt(curtidas);
    const com = parseInt(comentarios);

    if (!seg || (!cur && !com)) return;

    const totalInteracoes = (cur || 0) + (com || 0);
    const engajamento = (totalInteracoes / seg) * 100;

    setTaxa(engajamento.toFixed(2));
  };

  return (
    <section style={{ paddingTop: "2rem" }}>
      <h2>Calculadora de Engajamento</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Calcule rapidamente a taxa de engajamento de um post do Instagram ou
        TikTok para relatórios ou propostas de publis.
      </p>

      <div
        className="grid-container"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Card title="Métricas do Post" type="tech">
          <form
            onSubmit={calcularEngajamento}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Total de Seguidores do Perfil
              </label>
              <input
                type="number"
                value={seguidores}
                onChange={(e) => setSeguidores(e.target.value)}
                required
                placeholder="Ex: 15000"
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
                Curtidas (Likes) do post
              </label>
              <input
                type="number"
                value={curtidas}
                onChange={(e) => setCurtidas(e.target.value)}
                placeholder="Ex: 1200"
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
                Comentários do post
              </label>
              <input
                type="number"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Ex: 45"
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
              className="btn btn-instagram"
              style={{ marginTop: "1rem", justifyContent: "center" }}
            >
              Calcular Engajamento
            </button>
          </form>

          {taxa && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "rgba(0, 255, 204, 0.1)",
                borderLeft: "4px solid var(--primary-color)",
                borderRadius: "0 8px 8px 0",
                textAlign: "center",
              }}
            >
              <p
                style={{ marginBottom: "5px", color: "var(--text-secondary)" }}
              >
                Taxa de Engajamento:
              </p>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--primary-color)",
                }}
              >
                {taxa}%
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
