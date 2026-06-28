"use client";

import Card from "@/components/Card";
import Link from "next/link";
import { useState, useMemo } from "react";
import { trackEvent } from "@/lib/analytics";

interface Tool {
  href: string;
  title: string;
  desc: string;
  emoji: string;
  category: string;
}

const tools: Tool[] = [
  { href: "/ferramentas/gerador-bio-instagram", title: "Gerador de Bio (IA)", desc: "Crie bios criativas e otimizadas para Instagram usando inteligência artificial.", emoji: "📝", category: "redes" },
  { href: "/ferramentas/engajamento", title: "Engajamento Instagram", desc: "Calcule a taxa real de engajamento de uma publicação no Instagram ou TikTok.", emoji: "📊", category: "redes" },
  { href: "/ferramentas/contador-caracteres", title: "Contador de Caracteres", desc: "Conte caracteres, palavras e veja frequência com limites de cada rede social.", emoji: "🔤", category: "redes" },
  { href: "/ferramentas/whatsapp", title: "Gerador de WhatsApp", desc: "Crie links diretos com mensagens pré-programadas para WhatsApp.", emoji: "🔗", category: "redes" },
  { href: "/ferramentas/roi", title: "Calculadora de ROI", desc: "Calcule o lucro e a porcentagem de retorno de publis e campanhas de anúncios.", emoji: "💰", category: "financas" },
  { href: "/ferramentas/calculadora-freelance", title: "Calculadora de Freelance", desc: "Descubra seu valor por hora, dia e projeto como freelancer de tecnologia.", emoji: "💼", category: "financas" },
  { href: "/ferramentas/calculadora-salario-liquido", title: "Calculadora Salário Líquido", desc: "Saiba quanto vai sobrar com as tabelas de INSS e IRRF atualizadas.", emoji: "💸", category: "financas" },
  { href: "/ferramentas/calculadora-juros-compostos", title: "Juros Compostos", desc: "Simule investimentos com juros compostos. Veja evolução e rentabilidade.", emoji: "📈", category: "financas" },
  { href: "/ferramentas/gerador-paleta-cores", title: "Gerador de Paleta de Cores", desc: "Gere combinações de cores harmoniosas para design e UI com um clique.", emoji: "🎨", category: "dev" },
  { href: "/ferramentas/box-shadow", title: "Gerador de Box-Shadow CSS", desc: "Ferramenta visual para gerar e copiar sombras CSS com sliders interativos.", emoji: "🖼️", category: "dev" },
  { href: "/ferramentas/gerador-senhas", title: "Gerador de Senhas Fortes", desc: "Crie senhas seguras com criptografia do navegador. Personalize tamanho e caracteres.", emoji: "🔐", category: "dev" },
  { href: "/ferramentas/formatador-json", title: "Formatador JSON", desc: "Formate, valide e minifique JSON. Essencial para devs depurando APIs.", emoji: "{ }", category: "dev" },
  { href: "/ferramentas/gerador-qrcode", title: "Gerador de QR Code", desc: "QR Codes personalizados: cores, tamanho, templates WhatsApp/Wi-Fi. Download PNG/SVG.", emoji: "📱", category: "utilidades" },
  { href: "/ferramentas/gerador-cpf-cnpj", title: "Gerador de CPF/CNPJ", desc: "Gere CPF e CNPJ com dígitos verificadores válidos para testes de software.", emoji: "🪪", category: "dev" },
  { href: "/ferramentas/gerador-hashtags", title: "Gerador de Hashtags (IA)", desc: "Hashtags otimizadas por IA para Instagram e TikTok: populares, nichadas e tendências.", emoji: "#️⃣", category: "redes" },
  { href: "/ferramentas/gerador-story", title: "Gerador de Story", desc: "Crie stories com frases reais de autores consagrados. Fontes, cores e download 1080×1920.", emoji: "📱", category: "redes" },
  { href: "/ferramentas/conversor-moedas", title: "Conversor de Moedas", desc: "Converta 160+ moedas com cotação em tempo real. Inclui Bitcoin e Ethereum.", emoji: "💱", category: "financas" },
  { href: "/ferramentas/calculadora-imc", title: "Calculadora de IMC", desc: "Calcule seu Índice de Massa Corporal e veja a classificação da OMS.", emoji: "⚖️", category: "calculadoras" },
  { href: "/ferramentas/calculadora-ferias", title: "Calculadora de Férias", desc: "Calcule férias CLT com 1/3, abono pecuniário, INSS, IRRF e adiantamento 13º.", emoji: "🏖️", category: "calculadoras" },
  { href: "/ferramentas/removedor-fundo", title: "Removedor de Fundo (IA)", desc: "Remova fundo de imagens com IA no navegador. Download em PNG transparente.", emoji: "✂️", category: "imagem" },
  { href: "/ferramentas/compressor-imagem", title: "Compressor de Imagem", desc: "Reduza o tamanho de JPG e WebP. Ajuste qualidade e formato de saída.", emoji: "🗜️", category: "imagem" },
  { href: "/ferramentas/tmb", title: "Calculadora de TMB", desc: "Descubra seu gasto calórico basal e diário para ajustar sua dieta.", emoji: "🔥", category: "calculadoras" },
  { href: "/ferramentas/1rm", title: "Carga Máxima (1RM)", desc: "Calcule seu limite de força em exercícios de musculação (supino, agacho, etc).", emoji: "🏋️", category: "calculadoras" },
  { href: "/ferramentas/como-calcular-churrasco", title: "Calculadora de Churrasco", desc: "Descubra a quantidade exata de carne, bebidas e carvão para seu evento.", emoji: "🥩", category: "calculadoras" },
  { href: "/ferramentas/como-passar-whitelist-gta-rp", title: "Gerador de História (GTA RP)", desc: "Crie a história do seu personagem na hora para passar na Whitelist de GTA RP.", emoji: "🎮", category: "games" },
  { href: "/ferramentas/quiz-ia", title: "Quiz IA Infinito", desc: "Gere um quiz de 15 perguntas inéditas sobre qualquer assunto na hora.", emoji: "🧠", category: "games" },
  { href: "/ferramentas/gerenciador-de-racha", title: "Racha Manager Pro", desc: "Organize seu futebol com sorteio justo, fila de espera e contador de partidas.", emoji: "⚽", category: "games" },
];

const categories = [
  { key: "todas", label: "Todas" },
  { key: "redes", label: "Redes Sociais" },
  { key: "financas", label: "Finanças" },
  { key: "calculadoras", label: "Calculadoras" },
  { key: "dev", label: "Dev / Design" },
  { key: "imagem", label: "Imagem" },
  { key: "utilidades", label: "Utilidades" },
  { key: "games", label: "Games" },
];

export default function FerramentasHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = category === "todas" || t.category === category;
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Ferramentas Gratuitas</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "700px",
        }}
      >
        Coleção de utilitários práticos para o dia a dia. Busque ou filtre por
        categoria:
      </p>

      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ferramenta..."
          style={{
            padding: "10px 18px",
            borderRadius: "30px",
            border: "1px solid var(--surface-border)",
            background: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "0.9rem",
            outline: "none",
            minWidth: "220px",
            backdropFilter: "blur(10px)",
          }}
        />
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border:
                category === cat.key
                  ? "1px solid var(--accent-color)"
                  : "1px solid var(--surface-border)",
              background:
                category === cat.key
                  ? "rgba(99, 102, 241, 0.12)"
                  : "transparent",
              color:
                category === cat.key
                  ? "var(--accent-color)"
                  : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", padding: "3rem 0", textAlign: "center" }}>
          Nenhuma ferramenta encontrada. Tente outro termo.
        </p>
      ) : (
        <div className="grid-container">
          {filtered.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => trackEvent({ action: "click_ferramenta", category: "navegacao", label: tool.title })}
            >
              <Card type="tech" title={`${tool.emoji} ${tool.title}`} description={tool.desc} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
