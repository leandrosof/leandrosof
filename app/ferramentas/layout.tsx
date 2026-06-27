import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Ferramentas Gratuitas para Criadores de Conteúdo e Devs | Leandro Silva",
  description:
    "Coleção de ferramentas gratuitas: gerador de bio para Instagram, calculadora de engajamento, ROI, freelance, paleta de cores, contador de caracteres e muito mais.",
  keywords: [
    "ferramentas gratuitas",
    "ferramentas para criadores",
    "calculadora engajamento",
    "gerador de bio",
    "calculadora freelance",
    "paleta de cores",
    "contador de caracteres",
    "ferramentas dev",
  ],
  openGraph: {
    title:
      "Ferramentas Gratuitas para Criadores de Conteúdo e Devs | Leandro Silva",
    description:
      "15+ ferramentas gratuitas para criadores de conteúdo, devs e freelancers.",
    url: "https://leandrosof.com.br/ferramentas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ferramentas Gratuitas para Criadores de Conteúdo e Devs | Leandro Silva",
    description:
      "15+ ferramentas gratuitas para criadores de conteúdo, devs e freelancers.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas",
  },
};

export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header
        style={{
          minHeight: "auto",
          padding: "1rem 10%",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid var(--surface-border)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          <span style={{ color: "var(--text-color)" }}>Leandro</span>
          <span style={{ color: "var(--accent-color)" }}>Silva</span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/ferramentas" className="btn" style={{ fontSize: "0.85rem", padding: "7px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>
            Ver Todas
          </Link>
          <Link
            href="/"
            className="btn"
            style={{
              fontSize: "0.85rem",
              padding: "7px 16px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "var(--accent-color)",
            }}
          >
            ← Portfólio
          </Link>
        </nav>
      </header>

      {children}
    </>
  );
}
