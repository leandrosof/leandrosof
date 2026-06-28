import { NextRequest, NextResponse } from "next/server";
import frasesData from "@/data/frases.json";

interface FrasesDB {
  motivacao: string[];
  zueira: string[];
  empreendedor: string[];
  romance: string[];
  reflexao: string[];
  musicas: string[];
  filmes: string[];
  diasemana: { segunda: string[]; sexta: string[]; fimdesemana: string[]; };
}
const frases = frasesData as unknown as FrasesDB;

const DIAS: Record<number, keyof FrasesDB["diasemana"] | null> = {
  0: "fimdesemana", 1: "segunda", 2: null, 3: null, 4: null, 5: "sexta", 6: "fimdesemana"
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export async function POST(req: NextRequest) {
  try {
    const { tom, assunto } = await req.json();

    // 1. Frases da categoria escolhida (ou todas)
    let pool: string[];
    if (tom === "todas") {
      pool = [
        ...frases.motivacao, ...frases.zueira, ...frases.empreendedor,
        ...frases.romance, ...frases.reflexao, ...frases.musicas, ...frases.filmes,
      ];
    } else {
      const categoria = (frases[tom as keyof typeof frases] as string[]) || frases.motivacao;
      pool = [...categoria];
    }

    // 2. Se digitou assunto, filtra por palavras-chave
    const tema = assunto?.trim();
    if (tema) {
      const termos = tema.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      pool = pool.filter((f) =>
        termos.some((t: string) => f.toLowerCase().includes(t))
      );
    }

    // 3. Contexto do dia da semana (exceto quando tem busca específica)
    const dia = new Date().getDay();
    const diaKey = DIAS[dia];
    if (diaKey && !tema) {
      const diaFrases = frases.diasemana[diaKey] || [];
      pool = [...new Set([...diaFrases, ...pool])];
    }

    // 4. Remove duplicatas e retorna TUDO (sem limitar)
    const selecionadas = [...new Set(pool)];

    // 5. Hashtags por categoria

    // 6. Hashtags genéricas baseadas no tom
    const hashMap: Record<string, string[]> = {
      motivacao: ["#motivação", "#foco", "#disciplina", "#evolução", "#mindset"],
      zueira: ["#zueira", "#humor", "#meme", "#brasil", "#sextou"],
      empreendedor: ["#empreendedorismo", "#negócios", "#trabalho", "#sucesso", "#dinheiro"],
      romance: ["#amor", "#romance", "#casal", "#saudade", "#frasesdeamor"],
      reflexao: ["#reflexão", "#pensamento", "#filosofia", "#vida", "#sabedoria"],
    };
    const hashtags = hashMap[tom] || ["#frases", "#story", "#instagram"];

    return NextResponse.json({
      frases: selecionadas,
      hashtags,
      todas: tom === "todas" ? pool : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar frases." }, { status: 500 });
  }
}
