import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Story com Frases | Leandro Silva",
  description: "Crie stories com frases reais de autores consagrados. Filosofia, humor, música e cinema. Personalize fontes, cores e baixe em 1080x1920.",
  keywords: ["gerador de story","criar story instagram","frases para story","story maker","story personalizado","template story","frases famosas","frases de filmes"],
  openGraph: { title: "Gerador de Story com Frases | Leandro Silva", description: "Stories com frases reais de filósofos, humoristas e artistas. Baixe em 1080p.", url: "https://leandrosof.com.br/ferramentas/gerador-story", type: "website" },
  twitter: { card: "summary_large_image", title: "Gerador de Story com Frases | Leandro Silva", description: "Stories com frases reais de filósofos, humoristas e artistas." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/gerador-story" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
