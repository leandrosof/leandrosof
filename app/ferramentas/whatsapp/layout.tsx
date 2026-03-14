import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerador de Link de WhatsApp | Crie com Mensagem Personalizada",
  description: "Crie um link direto para o seu WhatsApp com mensagem pré-definida em segundos. Ferramenta grátis ideal para a bio do Instagram, links de vendas e anúncios.",
  keywords: [
    "gerador de link whatsapp",
    "criar link whatsapp",
    "link whatsapp com mensagem",
    "gerador wa.me",
    "link para bio instagram",
    "link direto whatsapp",
    "ferramentas de marketing",
    "api whatsapp link"
  ],
  openGraph: {
    title: "Gerador de Link do WhatsApp | Grátis e Rápido",
    description: "Facilite o contato com seus clientes. Crie seu link personalizado do WhatsApp em 1 clique e coloque nas suas redes sociais.",
    type: "website",
    // url: "https://leandrosof.com.br/ferramentas/gerador-link-whatsapp", // Ajuste para a URL real
  },
};

export default function WhatsAppLinkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}