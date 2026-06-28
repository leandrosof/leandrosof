import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { tema, quantidade, plataforma } = await req.json();
    if (!tema) return NextResponse.json({ error: "Informe um tema." }, { status: 400 });

    const prompt = `Gere ${quantidade || 15} hashtags para redes sociais em português do Brasil.

Tema: ${tema}
Plataforma: ${plataforma || "Instagram"}

Regras:
- Hashtags relevantes e otimizadas para engajamento
- Misture hashtags populares (alto volume) com nichadas (menor concorrência)
- ${plataforma === "TikTok" ? "Foco em tendências virais do TikTok" : "Foco em crescimento no Instagram"}
- Separe por categorias: Populares, Nichadas, Tendências
- Retorne APENAS JSON: { "populares": ["tag1","tag2"...], "nichadas": ["tag1","tag2"...], "tendencias": ["tag1","tag2"...] }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Erro ao gerar hashtags." }, { status: 500 });
  }
}
