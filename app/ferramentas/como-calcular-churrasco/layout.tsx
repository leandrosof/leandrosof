import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Churrasco | Quantidade de Carne e Bebida",
  description: "Calcule a quantidade exata de carne, cerveja, refrigerante e carvão para o seu churrasco. Não deixe faltar nem sobrar comida no seu evento!",
  keywords: [
    "calculadora de churrasco",
    "calcular carne churrasco",
    "quantidade de carne por pessoa",
    "calcular churrasco online",
    "quantidade de cerveja por pessoa",
    "churrasco para 20 pessoas",
    "como calcular churrasco",
    "carvão para churrasco"
  ],
  openGraph: {
    title: "Calculadora de Churrasco | Monte sua lista de compras",
    description: "Vai fazer um churras e não sabe o que comprar? Coloque o número de homens, mulheres e crianças e descubra a lista exata do que levar.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/como-calcular-churrasco", 
  },
};

export default function BBQCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}