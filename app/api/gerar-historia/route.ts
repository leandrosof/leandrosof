import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { nome, idade, genero, alinhamento } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prompt ajustado para soar como um jovem digitando no Discord
    const prompt = `
      Você é um jovem brasileiro preenchendo a história do seu personagem para uma Whitelist de GTA RP.
      
      INSTRUÇÕES DE ESTILO:
      - Escreva em PRIMEIRA PESSOA ("Eu...").
      - Use um vocabulário SIMPLES e DIRETO. 
      - PROIBIDO: Palavras literárias como "perspectivas", "diante de", "estabilidade", "recomeço", "tranquilidade".
      - PROIBIDO: Gírias forçadas como "coroa", "grana", "tá ligado", "mermão".
      - Estilo: Pense em alguém explicando por que mudou de cidade para um conhecido. 
      
      Parâmetros:
      Nome: ${nome || "Nome comum brasileiro"}
      Idade: ${idade || "Entre 18 e 25"}
      Gênero: ${genero}
      Objetivo: ${alinhamento} (Se Ilegal: faliu, perdeu emprego ou quer dinheiro rápido. Se Legal: quer um emprego de mecânico, motorista ou entrar para a polícia).

      Exemplo de tom: "Eu morava no interior e trabalhava com meu pai, mas as coisas ficaram difíceis lá e a oficina fechou. Decidi vir para cá para tentar arrumar um emprego de mecânico e conseguir me manter sozinho."

      RETORNE APENAS JSON:
      {
        "nome": "O nome",
        "idade": "A idade",
        "historia": "A história em 2 parágrafos curtos"
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
