import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { tema } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um mestre de quiz super criativo. 
          Gere um quiz de EXATAMENTE 15 perguntas sobre o tema solicitado. Não pare até gerar as 15.
          Você DEVE retornar APENAS um JSON estrito no seguinte formato:
          {
            "perguntas": [
              {
                "pergunta": "Qual é a pergunta?",
                "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
                "resposta_correta": "Texto exato da Opção correta",
                "curiosidade": "Uma curiosidade rápida de 1 linha sobre a resposta."
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Tema do Quiz: ${tema}. Crie 15 perguntas (misture fáceis, médias e difíceis).`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 4000, // Isso garante que ele não corte no meio e entregue as 15!
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar quiz" }, { status: 500 });
  }
}