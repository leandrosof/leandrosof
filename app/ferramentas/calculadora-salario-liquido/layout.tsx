import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Salário Líquido 2026 | Descontos INSS e IRRF",
  description: "Calcule seu salário líquido online com as novas tabelas de 2026. Saiba exatamente quanto será descontado de INSS e Imposto de Renda (IRRF) no seu holerite.",
  keywords: [
    "calculadora de salário líquido",
    "calcular salario liquido 2026",
    "calculo inss 2026",
    "calculo irrf 2026",
    "desconto salario",
    "quanto sobra do salario",
    "salario liquido clt",
    "tabela inss 2026",
    "tabela irrf 2026"
  ],
  openGraph: {
    title: "Calculadora de Salário Líquido Atualizada (2026)",
    description: "Recebeu uma proposta de emprego? Coloque o salário bruto aqui e descubra na hora quanto vai cair na sua conta depois dos impostos.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/calculadora-salario-liquido",
  },
};

export default function NetSalaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}