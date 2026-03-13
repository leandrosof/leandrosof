import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { nome, idade, genero, alinhamento } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Você é um jovem brasileiro preenchendo a história do seu personagem para uma Whitelist de GTA RP.
      
      INSTRUÇÕES DE ESTILO:
      - Escreva em PRIMEIRA PESSOA ("Eu...").
      - Use um vocabulário SIMPLES e DIRETO, mas desenvolva BEM a história.
      - PROIBIDO: Palavras literárias como "perspectivas", "diante de", "estabilidade", "recomeço", "tranquilidade".
      - PROIBIDO: Gírias forçadas como "coroa", "grana", "tá ligado", "mermão".
      - Estilo: Pense em alguém explicando o passado e os motivos para se mudar de cidade.
      
      Parâmetros:
      Nome: ${nome || "Nome comum brasileiro"}
      Idade: ${idade || "Entre 18 e 25"}
      Gênero: ${genero}
      Objetivo: ${alinhamento} (Se Ilegal: faliu, tem dívidas na cidade antiga ou quer dinheiro rápido. Se Legal: quer um emprego honesto, ser mecânico ou entrar para a polícia).

      REGRAS DE TAMANHO E CONTEÚDO:
      1. A história DEVE ter entre 3 a 4 parágrafos bem desenvolvidos.
      2. Conte de onde o personagem veio, o que fazia antes e qual foi o problema que o fez sair de lá.
      3. Termine explicando o motivo de estar chegando nesta cidade nova hoje.

      RETORNE APENAS JSON:
      {
        "nome": "O nome",
        "idade": "A idade",
        "historia": "A história completa com 3 a 4 parágrafos (use \\n\\n para separar as quebras de linha)"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const personagem = JSON.parse(cleanJson);

    return NextResponse.json(personagem);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao gerar história" },
      { status: 500 },
    );
  }
}
