import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Freelance | Leandro Silva",
  description:
    "Calcule seu valor por hora, dia e projeto como freelancer de tecnologia. Planeje sua renda mensal com precisão.",
  keywords: [
    "calculadora freelancer",
    "valor hora freelancer",
    "como cobrar freela",
    "precificação de projetos",
    "freelance TI",
  ],
  openGraph: {
    title: "Calculadora de Freelance | Leandro Silva",
    description:
      "Calcule seu valor por hora, dia e projeto como freelancer de tecnologia.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/calculadora-freelance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Freelance | Leandro Silva",
    description: "Calcule seu valor por hora, dia e projeto como freelancer de tecnologia.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas/calculadora-freelance",
  },
};

export default function FreelanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
