import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compressor de Imagem | Leandro Silva",
  description: "Comprima imagens PNG, JPG e WebP online grátis. Reduza o tamanho do arquivo sem perder qualidade. Ajuste qualidade e formato.",
  keywords: ["comprimir imagem","reduzir tamanho imagem","compressor jpg","compressor png","otimizar imagem","compress image","compressor foto"],
  openGraph: { title: "Compressor de Imagem | Leandro Silva", description: "Comprima imagens online grátis. Reduza o tamanho sem perder qualidade.", url: "https://leandrosof.com.br/ferramentas/compressor-imagem", type: "website" },
  twitter: { card: "summary_large_image", title: "Compressor de Imagem | Leandro Silva", description: "Comprima imagens online grátis." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/compressor-imagem" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
