import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { niche, tone, emojis } = await req.json();

    if (!niche || !tone) {
      return NextResponse.json(
        { error: "Preencha o nicho e o tom de voz." },
        { status: 400 }
      );
    }

    const prompt = `Gere 5 opções de bio para Instagram em português do Brasil.

Dados do usuário:
- Nicho/Área: ${niche}
- Tom de voz: ${tone}
- ${emojis ? "Usar emojis" : "Sem emojis"}

Regras:
- Cada bio deve ter no máximo 150 caracteres
- Devem ser criativas, autênticas e otimizadas para engajamento
- Use linguagem natural e direta
- Formato: JSON array com 5 strings, exemplo: ["bio1", "bio2", "bio3", "bio4", "bio5"]
- ${emojis ? "Inclua emojis relevantes no início ou meio da bio" : "Não use emojis"}

Retorne APENAS o JSON array, sem explicações adicionais.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const parsed = JSON.parse(content);

    return NextResponse.json({ bios: parsed });
  } catch (error) {
    console.error("Erro ao gerar bio:", error);
    return NextResponse.json(
      { error: "Erro ao gerar bios. Tente novamente." },
      { status: 500 }
    );
  }
}
