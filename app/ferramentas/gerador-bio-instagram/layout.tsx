import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Bio para Instagram | Leandro Silva",
  description:
    "Crie bios profissionais e criativas para Instagram automaticamente. Gerador gratuito com IA.",
  keywords: [
    "gerador de bio instagram",
    "bio para instagram",
    "bio instagram criativa",
    "bio profissional",
    "bio com emojis",
  ],
  openGraph: {
    title: "Gerador de Bio para Instagram | Leandro Silva",
    description:
      "Crie bios profissionais e criativas para Instagram automaticamente com IA.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/gerador-bio-instagram",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gerador de Bio para Instagram | Leandro Silva",
    description: "Crie bios profissionais e criativas para Instagram automaticamente com IA.",
  },
  alternates: {
    canonical: "https://leandrosof.com.br/ferramentas/gerador-bio-instagram",
  },
};

export default function BioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
