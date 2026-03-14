import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de 1RM (Carga Máxima) | One Rep Max Online",
  description: "Descubra sua carga máxima (1RM) na musculação de forma segura. Calcule seu One Rep Max grátis para planejar treinos de força e hipertrofia.",
  keywords: [
    "calculadora 1rm",
    "calcular 1rm",
    "one rep max",
    "carga máxima musculação",
    "cálculo de rm",
    "fórmula de brzycki",
    "calculadora de peso academia",
    "descobrir 1rm",
    "treino de força"
  ],
  openGraph: {
    title: "Calculadora de 1RM | Descubra sua Carga Máxima na Musculação",
    description: "Vai tentar bater seu PR? Descubra o quanto você consegue levantar em 1 repetição máxima (1RM) de forma segura usando nossa calculadora.",
    type: "website",
    // url: "https://leandrosof.com.br/ferramentas/calculadora-1rm", // Ajuste para a URL real
  },
};

export default function OneRepMaxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}