import type { Metadata } from "next";
import frasesData from "@/data/frases.json";

export const metadata: Metadata = {
  title: "Banco de Frases: +2.000 Frases Prontas para Copiar | Leandro Silva",
  description: "Mais de 2.000 frases organizadas por categorias para copiar e usar nos stories, posts e legendas. Motivação, zueira, amor, futebol, tech e muito mais.",
  keywords: ["frases","banco de frases","frases para story","frases prontas","copiar frases","frases motivacionais","frases de amor","frases engraçadas","frases curtas","frases de filmes","frases de música"],
  openGraph: { title: "Banco de Frases | Leandro Silva", description: "+2.000 frases organizadas por categorias para copiar e usar.", url: "https://leandrosof.com.br/ferramentas/frases", type: "website" },
  twitter: { card: "summary_large_image", title: "Banco de Frases | Leandro Silva", description: "+2.000 frases prontas para copiar." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/frases" },
};

const frases = frasesData as unknown as Record<string, string[] | Record<string, string[]>>;

const CATS: Record<string, { label: string; emoji: string }> = {
  motivacao: { label: "Motivação", emoji: "🔥" },
  visao: { label: "Visão", emoji: "🚀" },
  zueira: { label: "Zueira", emoji: "😂" },
  resenha: { label: "Resenha", emoji: "🤡" },
  indiretas: { label: "Indiretas", emoji: "🐍" },
  empreendedor: { label: "Empreendedor", emoji: "💼" },
  tech: { label: "Tech", emoji: "💻" },
  trampo: { label: "Trampo", emoji: "📱" },
  conteudo: { label: "Conteúdo", emoji: "🎬" },
  romance: { label: "Romance", emoji: "❤️" },
  reflexao: { label: "Reflexão", emoji: "🧘" },
  curtas: { label: "Curtas", emoji: "📸" },
  musicas: { label: "Músicas", emoji: "🎵" },
  futebol: { label: "Futebol", emoji: "⚽" },
  carro: { label: "Carro", emoji: "🏎️" },
  filmes: { label: "Filmes", emoji: "🎬" },
};

export default function BancoFrasesPage() {
  // Renderiza frases no servidor (Google vê!)
  const sections: { cat: string; label: string; emoji: string; frases: string[] }[] = [];
  for (const [key, cat] of Object.entries(CATS)) {
    const arr = frases[key];
    if (Array.isArray(arr) && arr.length > 0) {
      sections.push({ cat: key, label: cat.label, emoji: cat.emoji, frases: arr.slice(0, 15) });
    }
  }

  return (
    <>
      <FraseBrowser sections={sections} allCats={CATS} />
    </>
  );
}

// Client component wrapper para busca/filtro
import FraseBrowserClient from "./FraseBrowser";
function FraseBrowser(props: { sections: { cat: string; label: string; emoji: string; frases: string[] }[]; allCats: typeof CATS }) {
  return <FraseBrowserClient {...props} />;
}
