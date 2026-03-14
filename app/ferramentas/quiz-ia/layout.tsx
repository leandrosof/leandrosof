import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz IA Infinito | Gerador de Perguntas por Inteligência Artificial",
  description: "Desafie a IA e teste seus conhecimentos! Gere um quiz exclusivo com 15 perguntas sobre QUALQUER assunto (tecnologia, GTA RP, história, esportes e mais). Jogue online e grátis.",
  keywords: [
    "quiz ia", 
    "gerador de quiz", 
    "perguntas e respostas inteligência artificial", 
    "trivia ia", 
    "teste de conhecimentos gerais", 
    "jogo de perguntas online", 
    "gerador de perguntas"
  ],
  openGraph: {
    title: "Quiz IA Infinito | Crie seu Quiz na hora",
    description: "Digite um tema e a Inteligência Artificial cria 15 perguntas inéditas para você testar seus conhecimentos. Vai encarar?",
    type: "website",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}