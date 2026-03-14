import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { tema } = await req.json();

    // Data dinâmica para a IA saber exatamente em que ano estamos
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um criador de quiz rigorosamente factual e super atualizado.
          CONTEXTO: Hoje é dia ${dataAtual}. 
          
          REGRAS CRÍTICAS DE PRECISÃO:
          1. Baseie-se APENAS em fatos reais, históricos e comprovados.
          2. NUNCA invente leis, eventos, datas ou lançamentos fictícios.
          3. SE VOCÊ NÃO TIVER 100% DE CERTEZA SOBRE UM FATO, NÃO CRIE A PERGUNTA. Escolha outro fato sobre o tema.
          4. Não faça perguntas sobre o futuro ou especulações.
          5. Evite usar a palavra 'atual' para perguntar sobre cargos políticos (presidentes, ministros), prefira perguntar sobre fatos históricos e mandatos que já terminaram.
          5. Para perguntas sobre história e cultura do Brasil, redobre a atenção para não reproduzir mitos populares. Priorize o rigor e o consenso histórico oficial.

          Gere um quiz de EXATAMENTE 10 perguntas sobre o tema solicitado. As curiosidades devem ser objetivas (máximo 2 frases).
          
          Você DEVE retornar APENAS um JSON estrito no seguinte formato:
          {
            "perguntas": [
              {
                "pergunta": "Frase da pergunta?",
                "opcoes": ["A", "B", "C", "D"],
                "resposta_correta": "Texto da correta",
                "curiosidade": "Curiosidade real e comprovada."
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Tema: ${tema}. Gere as 15 perguntas factuais.`
        }
      ],
      // O motor V8 da Groq: inteligente, culto e menos propenso a inventar moda
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Temperatura fria = foco na verdade e na lógica
      max_tokens: 2000, // Espaço de sobra para as 15 perguntas e boas curiosidades
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || "{}";

    try {
      const data = JSON.parse(content);
      return NextResponse.json(data);
    } catch (e) {
      // Se por algum milagre o texto for cortado, o site não quebra
      return NextResponse.json({ error: "Conteúdo muito extenso para o limite de tokens." }, { status: 422 });
    }

  } catch (error: any) {
    if (error?.status === 429) {
      return NextResponse.json({ error: "Limite atingido" }, { status: 429 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}