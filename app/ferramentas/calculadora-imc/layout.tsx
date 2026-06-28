import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de IMC | Leandro Silva",
  description: "Calcule seu Índice de Massa Corporal (IMC) online grátis. Saiba sua classificação segundo a OMS: abaixo do peso, normal, sobrepeso ou obesidade.",
  keywords: ["calculadora imc","calcular imc","imc online","índice massa corporal","tabela imc","peso ideal","IMC grátis"],
  openGraph: { title: "Calculadora de IMC | Leandro Silva", description: "Calcule seu IMC online grátis com classificação OMS.", url: "https://leandrosof.com.br/ferramentas/calculadora-imc", type: "website" },
  twitter: { card: "summary_large_image", title: "Calculadora de IMC | Leandro Silva", description: "Calcule seu IMC online grátis com classificação OMS." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/calculadora-imc" },
};

export default function IMCLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
