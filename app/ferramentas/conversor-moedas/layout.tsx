import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversor de Moedas | Leandro Silva",
  description: "Converta Dólar, Euro, Real, Bitcoin e 160+ moedas com cotação em tempo real. Conversor de moedas online grátis e atualizado.",
  keywords: ["conversor moedas","dolar hoje","euro real","converter dolar","cotacao dolar","btc real","conversor cambio","dolar para real"],
  openGraph: { title: "Conversor de Moedas | Leandro Silva", description: "Converta 160+ moedas com cotação em tempo real.", url: "https://leandrosof.com.br/ferramentas/conversor-moedas", type: "website" },
  twitter: { card: "summary_large_image", title: "Conversor de Moedas | Leandro Silva", description: "Converta 160+ moedas com cotação em tempo real." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/conversor-moedas" },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
