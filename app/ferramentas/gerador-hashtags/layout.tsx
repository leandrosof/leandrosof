import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Hashtags com IA | Leandro Silva",
  description: "Gere hashtags otimizadas para Instagram e TikTok com inteligência artificial. Hashtags populares, nichadas e tendências para aumentar o alcance.",
  keywords: ["gerador de hashtags","hashtags instagram","hashtags tiktok","hashtags populares","melhores hashtags","hashtag generator","hashtags para fotos"],
  openGraph: { title: "Gerador de Hashtags com IA | Leandro Silva", description: "Hashtags otimizadas por IA para Instagram e TikTok.", url: "https://leandrosof.com.br/ferramentas/gerador-hashtags", type: "website" },
  twitter: { card: "summary_large_image", title: "Gerador de Hashtags com IA | Leandro Silva", description: "Hashtags otimizadas por IA para Instagram e TikTok." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/gerador-hashtags" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
