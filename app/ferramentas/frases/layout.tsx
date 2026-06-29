import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banco de Frases | Leandro Silva",
  description: "Mais de 2.000 frases prontas para copiar e usar nos seus stories, posts e legendas. Organizadas por categorias: motivação, zueira, amor, futebol, tech e muito mais.",
  keywords: ["frases","banco de frases","frases para story","frases prontas","copiar frases","frases motivacionais","frases de amor","frases engraçadas","frases curtas"],
  openGraph: { title: "Banco de Frases | Leandro Silva", description: "+2.000 frases organizadas por categorias para copiar e usar.", url: "https://leandrosof.com.br/ferramentas/frases", type: "website" },
  twitter: { card: "summary_large_image", title: "Banco de Frases | Leandro Silva", description: "+2.000 frases prontas para copiar." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/frases" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
