import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formatador e Validador JSON | Leandro Silva",
  description: "Formate, valide e minifique JSON online grátis. Ideal para desenvolvedores. Detecta erros de sintaxe e formata com indentação.",
  keywords: ["formatar json","json formatter","validador json","json validator","minify json","beautify json","json online","json prettier"],
  openGraph: { title: "Formatador e Validador JSON | Leandro Silva", description: "Formate, valide e minifique JSON online grátis.", url: "https://leandrosof.com.br/ferramentas/formatador-json", type: "website" },
  twitter: { card: "summary_large_image", title: "Formatador e Validador JSON | Leandro Silva", description: "Formate, valide e minifique JSON online grátis." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/formatador-json" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
