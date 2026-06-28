import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Senhas Fortes | Leandro Silva",
  description: "Gere senhas seguras e aleatórias online grátis. Personalize tamanho, letras, números e símbolos para máxima segurança.",
  keywords: ["gerador de senhas","criar senha forte","senha segura","password generator","senha aleatoria","gerador senha online"],
  openGraph: { title: "Gerador de Senhas Fortes | Leandro Silva", description: "Gere senhas seguras e aleatórias com um clique.", url: "https://leandrosof.com.br/ferramentas/gerador-senhas", type: "website" },
  twitter: { card: "summary_large_image", title: "Gerador de Senhas Fortes | Leandro Silva", description: "Gere senhas seguras e aleatórias com um clique." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/gerador-senhas" },
};

export default function SenhasLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
