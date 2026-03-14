import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { pergunta } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um jogador de GTA RP viciado, respondendo no Discord.
          REGRAS DE ESTILO:
          - Seja extremamente direto e preguiçoso.
          - Use gírias: vc, pq, ta, q, pro, pra, tbm.
          - NUNCA use acentos (eh, ja, so, tbm).
          - NÃO use letras maiúsculas (escreva tudo em minúsculo).
          - Proibido explicar siglas em inglês.
          - No máximo 1 frase curta.`,
        },
        {
          role: "user",
          content: `Responde ai: ${pergunta}`,
        },
      ],
      model: "llama-3.3-70b-versatile", // O brabo que a gente já testou
      temperature: 0.6, // Temperatura mais baixa pra ele não inventar moda
    });

    let respostaText = completion.choices[0]?.message?.content || "";

    // Limpeza final pra garantir que não venha aspas ou pontos desnecessários
    respostaText = respostaText
      .replace(/[".]/g, "") // Remove pontos e aspas pro estilo "chat"
      .trim()
      .toLowerCase();

    return NextResponse.json({ resposta: respostaText });
  } catch (error) {
    console.error("Erro na Groq (Glossário):", error);
    return NextResponse.json({ error: "deu ruim na ia" }, { status: 500 });
  }
}
