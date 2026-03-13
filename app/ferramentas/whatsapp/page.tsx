"use client"; // Necessário pois usamos estados (useState) no Next.js App Router

import { useState } from "react";
import Card from "@/components/Card";

export default function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Limpa caracteres especiais do número
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    setGeneratedLink(link);
  };

  return (
    <section id="ferramenta" style={{ paddingTop: "2rem" }}>
      <h2>Gerador de Link de WhatsApp</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
        Crie um link direto para o seu WhatsApp com uma mensagem pré-programada.
        Ideal para colocar na bio do Instagram ou campanhas.
      </p>

      <div
        className="grid-container"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Card title="Crie seu link grátis" description="" type="tech">
          <form
            onSubmit={handleGenerate}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label
                htmlFor="phone"
                style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
              >
                Número (com DDD)
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 61999999999"
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
              }}
            >
              <label
                htmlFor="message"
                style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
              >
                Mensagem Inicial (Opcional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Olá Leandro, vim pelo seu site!"
                rows={4}
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
              className="btn btn-tiktok"
              style={{
                marginTop: "1.5rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Gerar Link
            </button>
          </form>

          {generatedLink && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "rgba(0, 255, 204, 0.1)",
                borderLeft: "4px solid var(--primary-color)",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                Seu link está pronto:
              </p>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--primary-color)",
                  wordBreak: "break-all",
                }}
              >
                {generatedLink}
              </a>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
