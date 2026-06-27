import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de ROI para Publis | Leandro Silva",
  description:
    "Calcule o Retorno sobre Investimento (ROI) de campanhas de marketing de influência e anúncios pagos. Ferramenta gratuita.",
  keywords: [
    "calculadora ROI",
    "retorno sobre investimento",
    "ROI publis",
    "marketing de influência",
    "calcular ROI campanha",
    "ROI anúncios",
  ],
  openGraph: {
    title: "Calculadora de ROI para Publis | Leandro Silva",
    description:
      "Calcule o retorno sobre investimento de campanhas de marketing e publis.",
    url: "https://leandrosof.com.br/ferramentas/roi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de ROI para Publis | Leandro Silva",
    description:
      "Calcule o retorno sobre investimento de campanhas de marketing e publis.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas/roi",
  },
};

export default function RoiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
