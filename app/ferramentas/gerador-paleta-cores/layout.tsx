import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Paleta de Cores | Leandro Silva",
  description:
    "Gere paletas de cores harmoniosas para seus projetos de design e UI. Combinações complementares, análogas, triádicas e mais.",
  keywords: [
    "gerador de paleta de cores",
    "paleta de cores CSS",
    "combinação de cores",
    "cores para UI",
    "harmonia de cores",
  ],
  openGraph: {
    title: "Gerador de Paleta de Cores | Leandro Silva",
    description:
      "Gere paletas de cores harmoniosas para seus projetos de design e UI.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/gerador-paleta-cores",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gerador de Paleta de Cores | Leandro Silva",
    description: "Gere paletas de cores harmoniosas para seus projetos de design e UI.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas/gerador-paleta-cores",
  },
};

export default function PaletaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
