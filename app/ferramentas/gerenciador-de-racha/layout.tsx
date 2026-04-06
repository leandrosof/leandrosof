import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciador de Racha Pro | Sorteio e Rodízio de Times",
  description: "Organize sua pelada com o sistema de catraca mais justo. Sorteio automático por ordem de chegada, controle de partidas e fila de espera inteligente para futebol e futsal.",
  keywords: [
    "gerenciador de racha",
    "organizador de pelada",
    "sorteio de times futebol",
    "rodízio de jogadores",
    "sistema de catraca racha",
    "calculadora de racha",
    "tabela de pelada online",
    "marcador de racha"
  ],
  openGraph: {
    title: "Racha Pro ⚽ | O Organizador de Pelada Mais Justo",
    description: "Sistema de catraca inteligente: quem perde sai, a fila anda e o racha não para. Calcule partidas e organize times em segundos.",
    type: "website",
    url: "https://leandrosof.com.br/ferramentas/gerenciador-de-racha", 
  },
};

export default function RachaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}