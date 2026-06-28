import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Removedor de Fundo de Imagem | Leandro Silva",
  description: "Remova o fundo de imagens online grátis. Faça upload da sua foto e baixe em PNG com fundo transparente. Simples e rápido.",
  keywords: ["remover fundo imagem","removedor de fundo","background remover","fundo transparente","png sem fundo","remover bg"],
  openGraph: { title: "Removedor de Fundo de Imagem | Leandro Silva", description: "Remova o fundo de imagens online grátis. Upload e download em PNG.", url: "https://leandrosof.com.br/ferramentas/removedor-fundo", type: "website" },
  twitter: { card: "summary_large_image", title: "Removedor de Fundo de Imagem | Leandro Silva", description: "Remova o fundo de imagens online grátis." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/removedor-fundo" },
};

export default function RemoveBgLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
