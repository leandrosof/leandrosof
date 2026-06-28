import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de CPF e CNPJ Válido | Leandro Silva",
  description: "Gere CPF e CNPJ válidos para testes de software. Os números passam na validação dos dígitos verificadores. Uso exclusivo para desenvolvimento.",
  keywords: ["gerar cpf","cpf valido","gerar cnpj","cnpj valido","cpf teste","cnpj teste","gerador cpf cnpj"],
  openGraph: { title: "Gerador de CPF e CNPJ Válido | Leandro Silva", description: "Gere CPF e CNPJ válidos para testes de software.", url: "https://leandrosof.com.br/ferramentas/gerador-cpf-cnpj", type: "website" },
  twitter: { card: "summary_large_image", title: "Gerador de CPF e CNPJ Válido | Leandro Silva", description: "Gere CPF e CNPJ válidos para testes de software." },
  alternates: { canonical: "https://leandrosof.com.br/ferramentas/gerador-cpf-cnpj" },
};

export default function CPFLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
