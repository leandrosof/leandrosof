import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Férias CLT | Leandro Silva",
  description: "Calcule o valor das suas férias com abono de 1/3, adiantamento do 13º e descontos de INSS e IRRF. Atualizado com a legislação trabalhista.",
  keywords: ["calcular ferias","calculadora ferias","ferias clt","valor das ferias","abono pecuniario","1/3 ferias","adiantamento 13","ferias proporcionais"],
  openGraph: { title: "Calculadora de Férias CLT | Leandro Silva", description: "Calcule o valor das férias com 1/3, descontos e adiantamento do 13º.", url: "https://leandrosof.com.br/ferramentas/calculadora-ferias", type: "website" },
  twitter: { card: "summary_large_image", title: "Calculadora de Férias CLT | Leandro Silva", description: "Calcule o valor das férias com 1/3, descontos e adiantamento do 13º." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/calculadora-ferias" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
