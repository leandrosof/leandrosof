import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { nome, idade, genero, alinhamento } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um escritor de histórias para GTA RP.
          REGRAS DE OURO:
          - Escreva NO MÍNIMO 4 parágrafos detalhados.
          - Use gírias de internet (vc, pq, pra, ta, q) e NUNCA use acento em palavras curtas.
          - O texto deve ser realista, sem palavras difíceis.
          - Respeite o gênero ${genero}.
          - IMPORTANTE: Nunca aperte ENTER dentro das aspas do JSON. Use \\n\\n para parágrafos.`,
        },
        {
          role: "user",
          content: `Crie uma história detalhada para: Nome: ${nome}, Idade: ${idade}, Gênero: ${genero}, Lado: ${alinhamento}. 
          
          ESTRUTURA:
          1. Infância e família na cidade antiga.
          2. O que fazia da vida (profissão ou crime).
          3. O momento exato que deu tudo errado (a grande treta).
          4. A chegada na cidade nova e o sentimento de recomeço.

          Retorne APENAS o JSON: {"nome": "${nome}", "idade": "${idade}", "historia": "texto longo aqui"}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
    });

    let content = completion.choices[0]?.message?.content || "";

    // 1. Extrai apenas o que está entre as chaves para evitar lixo
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON não encontrado");

    let jsonString = jsonMatch[0];

    // 2. BLINDAGEM CONTRA "Bad control character":
    // Remove quebras de linha reais e caracteres de controle que quebram o JSON.parse
    jsonString = jsonString
      .replace(/\n/g, "\\n") // Transforma enter real em símbolo \n
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove caracteres invisíveis

    // 3. Tenta o Parse, se falhar, limpa mais uma vez as aspas duplas internas
    try {
      const validJson = JSON.parse(jsonString);

      // validJson.historia = validJson.historia.replace(/\n{3,}/g, "\n\n").trim();
      return NextResponse.json(validJson);
    } catch (e) {
      console.log("Erro no parse, tentando fallback manual");
      // Se a IA quebrar o JSON, a gente reconstrói o objeto na mão
      return NextResponse.json({
        nome: nome,
        idade: idade,
        historia:
          content.split('"historia":')[1]?.replace(/[{}"]/g, "").trim() ||
          "Erro ao formatar história.",
      });
    }
  } catch (error) {
    console.error("Erro Groq:", error);
    return NextResponse.json({ error: "Erro na API" }, { status: 500 });
  }
}
