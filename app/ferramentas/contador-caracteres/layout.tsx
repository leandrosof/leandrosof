import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contador de Caracteres Avançado | Leandro Silva",
  description:
    "Conte caracteres, palavras e linhas com limites específicos para Instagram, Twitter, TikTok, LinkedIn e YouTube.",
  keywords: [
    "contador de caracteres",
    "contador de palavras",
    "limite instagram",
    "limite twitter",
    "contador online",
  ],
  openGraph: {
    title: "Contador de Caracteres Avançado | Leandro Silva",
    description:
      "Conte caracteres, palavras e linhas com limites por rede social.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/contador-caracteres",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contador de Caracteres Avançado | Leandro Silva",
    description: "Conte caracteres, palavras e linhas com limites por rede social.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas/contador-caracteres",
  },
};

export default function ContadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
