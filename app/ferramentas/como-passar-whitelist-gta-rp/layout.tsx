import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Passar na Whitelist de GTA RP | Gerador de História e Prova",
  description: "Travou na entrevista? Gere o background completo do seu personagem e tire dúvidas das provas de regras (VDM, RDM, Meta Gaming) para passar nas whitelists mais exigentes do Brasil.",
  keywords: [
    "como passar whitelist gta rp", 
    "gerador de história gta rp", 
    "respostas prova gta rp", 
    "background de personagem gta rp", 
    "regras gta rp", 
    "o que é vdm rdm meta gaming", 
    "whitelist complexo",
    "whitelist metrópole",
    "whitelist cidade alta",
    "whitelist nordeste"
  ],
  openGraph: {
    title: "Whitelist Helper GTA RP | Crie sua História e Passe na Prova",
    description: "O melhor gerador de histórias e ajudante de regras para GTA RP. Crie seu background (legal ou ilegal) em segundos e garanta sua vaga na cidade.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/como-passar-whitelist-gta-rp",
    /* Se você tiver uma imagem de capa (og:image), pode adicionar aqui para o link ficar bonito no Discord/WhatsApp */
  },
};

export default function WhitelistHelperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}