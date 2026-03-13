"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function RPGenerator() {
  // Estados para a História
  const [nomeBase, setNomeBase] = useState("");
  const [idadeBase, setIdadeBase] = useState("");
  const [genero, setGenero] = useState("M");
  const [alinhamento, setAlinhamento] = useState("Ilegal");
  const [loading, setLoading] = useState(false);
  const [personagem, setPersonagem] = useState<{
    nome: string;
    idade: string;
    historia: string;
  } | null>(null);

  // Estados para a Prova
  const [pergunta, setPergunta] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [loadingPergunta, setLoadingPergunta] = useState(false);

  // Função Gerar História
  async function gerarPersonagem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/gerar-historia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeBase,
          idade: idadeBase,
          genero,
          alinhamento,
        }),
      });
      const data = await res.json();
      setPersonagem(data);
    } catch (error) {
      alert("Erro ao conectar com a API de história.");
    } finally {
      setLoading(false);
    }
  }

  // Função Resolver Prova
  async function resolverQuestao() {
    if (!pergunta) return;
    setLoadingPergunta(true);
    setRespostaIA("");

    try {
      const res = await fetch("/api/resolver-prova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });

      const data = await res.json();

      // VERIFICAÇÃO CRÍTICA: Se o servidor respondeu erro (400, 500, etc)
      if (!res.ok) {
        console.error("Erro vindo do servidor:", data);
        alert(`Erro do Servidor: ${data.error || "Erro desconhecido"}`);
        return; // Para a execução aqui
      }

      setRespostaIA(data.resposta);
    } catch (e) {
      console.error("Erro na conexão (Network):", e);
      alert(
        "Erro ao conectar com a API de prova. Verifique sua internet ou se o servidor caiu.",
      );
    } finally {
      setLoadingPergunta(false);
    }
  }
  return (
    <section
      style={{ padding: "2rem 1rem", maxWidth: "700px", margin: "0 auto" }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          maxWidth: "800px",
          margin: "0 auto 2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Whitelist Helper (GTA RP)
        </h1>

        <p
          style={{
            color: "#aaa",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            marginBottom: "15px",
          }}
        >
          O melhor <strong>gerador de histórias para GTA RP</strong> e ajudante
          de regras. Está travado na entrevista? Crie o background completo do
          seu personagem (legal ou ilegal) em segundos e tire dúvidas da prova
          escrita.
        </p>

        <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: "1.5" }}>
          Prepare-se para passar nas whitelists mais exigentes (Complexo,
          Metrópole, Nordeste, Cidade Alta, etc). Aprenda na prática o que é
          VDM, RDM, Meta Gaming, Power Gaming e não reprove nas regras da
          cidade.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* CARD 1: FORMULÁRIO DE HISTÓRIA */}
        <Card title="1. Gerar História" type="creator">
          <form
            onSubmit={gerarPersonagem}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Nome"
                value={nomeBase}
                onChange={(e) => setNomeBase(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <input
                type="number"
                placeholder="Idade"
                value={idadeBase}
                onChange={(e) => setIdadeBase(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
              <select
                value={alinhamento}
                onChange={(e) => setAlinhamento(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              >
                <option value="Ilegal">Ilegal</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-twitch"
              style={{ height: "45px", justifyContent: "center" }}
            >
              {loading ? "Escrevendo..." : "Gerar História"}
            </button>

            {/* Resultado da História (Renderizado aqui para evitar erro de escopo) */}
            {personagem && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#111",
                  borderRadius: "8px",
                  borderLeft: "4px solid #9146ff",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#9146ff",
                    fontWeight: "bold",
                  }}
                >
                  {personagem.nome}, {personagem.idade} anos
                </p>
                <div
                  style={{
                    color: "#eee",
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {personagem.historia}
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* CARD 2: AJUDANTE DE PROVA */}
        <Card title="2. Ajudante de Prova" type="tech">
          <textarea
            placeholder="Cole a pergunta da prova aqui..."
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              borderRadius: "8px",
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#fff",
              marginBottom: "1rem",
            }}
          />
          <button
            onClick={resolverQuestao}
            disabled={loadingPergunta}
            className="btn btn-twitch"
            style={{
              width: "100%",
              justifyContent: "center",
              background: "#00ffcc",
              color: "#000",
            }}
          >
            {loadingPergunta ? "Analisando..." : "Ver Resposta"}
          </button>

          {respostaIA && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(0, 255, 204, 0.05)",
                borderRadius: "8px",
                borderLeft: "4px solid #00ffcc",
                color: "#eee",
              }}
            >
              {respostaIA}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
