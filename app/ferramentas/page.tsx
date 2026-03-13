import Card from "@/components/Card";
import Link from "next/link";

export default function FerramentasHub() {
  return (
    <section style={{ paddingTop: "4rem", minHeight: "80vh" }}>
      <h2>Ferramentas Gratuitas</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
        }}
      >
        Coleção de utilitários práticos para o dia a dia. Escolha uma ferramenta
        abaixo:
      </p>

      <div className="grid-container">
        <Link
          href="/ferramentas/whatsapp"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="tech"
            title="🔗 Gerador de WhatsApp"
            description="Crie links diretos com mensagens pré-programadas."
          />
        </Link>

        <Link
          href="/ferramentas/engajamento"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="tech"
            title="📊 Engajamento Instagram"
            description="Calcule a taxa real de engajamento de uma publicação."
          />
        </Link>

        <Link
          href="/ferramentas/roi"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="tech"
            title="💰 Calculadora de ROI"
            description="Calcule o lucro e a porcentagem de retorno de publis e anúncios."
          />
        </Link>

        <Link
          href="/ferramentas/tmb"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="creator"
            title="🔥 Calculadora de TMB"
            description="Descubra seu gasto calórico basal e diário para ajustar a dieta."
          />
        </Link>

        <Link
          href="/ferramentas/1rm"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="creator"
            title="🏋️ Carga Máxima (1RM)"
            description="Calcule seu limite de força em exercícios de musculação."
          />
        </Link>

        <Link
          href="/ferramentas/box-shadow"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="tech"
            title="🎨 Gerador de Box-Shadow CSS"
            description="Ferramenta UX/UI visual para gerar e copiar sombras em CSS."
          />
        </Link>

        <Link
          href="/ferramentas/nomes-rp"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            type="creator"
            title="📝 Gerador de História (GTA RP)"
            description="Crie a história do seu personagem na hora para passar na Whitelist."
          />
        </Link>

        {/* Espaço para as próximas ferramentas */}
        <Card
          type="default"
          title="🚧 Em breve..."
          description="Mais ferramentas focadas em engajamento e lifestyle estão sendo desenvolvidas. Fique de olho!"
        />
      </div>
    </section>
  );
}
