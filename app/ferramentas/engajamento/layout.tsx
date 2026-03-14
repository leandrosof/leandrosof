import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Engajamento | Instagram e TikTok",
  description: "Calcule rapidamente a taxa de engajamento dos seus posts no Instagram ou TikTok. Ferramenta grátis ideal para montar mídia kits, relatórios e fechar propostas de publis.",
  keywords: [
    "calculadora de engajamento",
    "calcular taxa de engajamento",
    "engajamento instagram",
    "engajamento tiktok",
    "como calcular engajamento",
    "calculadora para influencers",
    "ferramentas para social media",
    "mídia kit"
  ],
  openGraph: {
    title: "Calculadora de Engajamento | Grátis e Online",
    description: "Descubra a taxa de engajamento real das suas publicações em segundos. Perfeito para criadores de conteúdo e agências.",
    type: "website",
    // url: "https://leandrosof.com.br/ferramentas/calculadora-engajamento", // Ajuste para a URL real
  },
};

export default function EngagementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}