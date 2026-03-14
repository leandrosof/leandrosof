import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Box Shadow CSS | Crie Sombras Online",
  description: "Crie sombras CSS perfeitas visualmente. Ajuste eixo X, Y, blur, spread e cor com nosso Gerador de Box Shadow. Copie o código pronto para seus projetos front-end.",
  keywords: [
    "gerador de box shadow",
    "gerador de sombra css",
    "box shadow css",
    "css shadow generator",
    "ferramenta box shadow",
    "sombra css gerador online",
    "ferramentas para front-end",
    "ui design tools"
  ],
  openGraph: {
    title: "Gerador de Box Shadow CSS | Ferramenta para Devs e UI",
    description: "Ajuste os parâmetros da sombra visualmente e copie o código CSS na hora. Ideal para agilizar o desenvolvimento front-end e prototipação de interfaces.",
    type: "website",
    // url: "https://leandrosof.com.br/ferramentas/gerador-box-shadow", // Lembre-se de ajustar para a URL real da sua rota
  },
};

export default function BoxShadowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}