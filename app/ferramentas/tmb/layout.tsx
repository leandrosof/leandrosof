import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de TMB e Gasto Calórico | Emagrecer ou Ganhar Massa",
  description: "Calcule sua Taxa Metabólica Basal (TMB) e descubra seu gasto calórico diário. Veja na hora a quantidade exata de calorias para déficit (emagrecer) ou superávit (hipertrofia).",
  keywords: [
    "calculadora tmb",
    "calcular tmb",
    "taxa metabólica basal",
    "gasto calórico diário",
    "calculadora de calorias",
    "déficit calórico",
    "superávit calórico",
    "calorias para emagrecer",
    "calorias para hipertrofia",
    "fórmula de mifflin-st jeor"
  ],
  openGraph: {
    title: "Calculadora de TMB | Descubra suas metas de calorias",
    description: "Quer secar ou focar no ganho de massa? Descubra exatamente quantas calorias você precisa consumir por dia com nossa calculadora.",
    type: "website",
    // url: "https://leandrosof.com.br/ferramentas/calculadora-tmb", // Lembre-se de ajustar para a URL real
  },
};

export default function TMBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}