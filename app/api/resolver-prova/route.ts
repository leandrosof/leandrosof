import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { pergunta } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Você é um jogador brasileiro de GTA RP respondendo no Discord de forma extremamente preguiçosa, rápida e direta.
      
      REGRAS ABSOLUTAS:
      1. NUNCA traduza ou soletre a sigla em inglês (ex: PROIBIDO escrever "Vehicle Deathmatch", "Random Deathmatch", etc).
      2. Vá direto para a ação. Comece a frase explicando o que acontece na prática.
      3. Use MÁXIMO de 1 ou 2 frases curtas.
      4. ZERO formatação (sem negrito, sem asteriscos).

      EXEMPLOS DE COMO RESPONDER:
      Pergunta: o q e vdm?
      Resposta: é usar o carro como arma pra atropelar ou matar alguém sem motivo no rp.

      Pergunta: o que é rdm?
      Resposta: é matar um jogador do nada sem ter nenhuma historinha ou motivo antes.

      Pergunta: q q é power gaming?
      Resposta: é fazer coisas impossíveis na vida real dentro do jogo, tipo capotar o carro 5 vezes e sair correndo.

      Agora responda a esta pergunta seguindo EXATAMENTE o estilo preguiçoso e direto dos exemplos acima:
      "${pergunta}"
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // A IA retorna TEXTO PURO aqui, não JSON.
    // Vamos apenas limpar possíveis crases de markdown (```) que ela possa mandar.
    responseText = responseText.replace(/```/g, "").trim();

    // Retornamos um JSON simples com a propriedade "resposta" para o front-end ler
    return NextResponse.json({ resposta: responseText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao gerar resposta" },
      { status: 500 },
    );
  }
}
