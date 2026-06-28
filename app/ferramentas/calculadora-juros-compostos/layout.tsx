import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Juros Compostos | Leandro Silva",
  description: "Simule investimentos com juros compostos. Calcule valor futuro, aporte mensal e veja gráfico de evolução do seu dinheiro.",
  keywords: ["juros compostos","calculadora juros","simulador investimento","juros sobre juros","calcular rendimento","investimento calculadora"],
  openGraph: { title: "Calculadora de Juros Compostos | Leandro Silva", description: "Simule investimentos com juros compostos. Calcule valor futuro e evolução.", url: "https://leandrosof.com.br/ferramentas/calculadora-juros-compostos", type: "website" },
  twitter: { card: "summary_large_image", title: "Calculadora de Juros Compostos | Leandro Silva", description: "Simule investimentos com juros compostos." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/calculadora-juros-compostos" },
};

export default function JurosLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
