import { NextRequest, NextResponse } from "next/server";
import frasesData from "@/data/frases.json";

interface FrasesDB {
  motivacao: string[]; visao: string[]; zueira: string[]; resenha: string[];
  indiretas: string[]; empreendedor: string[]; tech: string[]; trampo: string[];
  conteudo: string[]; romance: string[]; reflexao: string[]; curtas: string[];
  musicas: string[]; futebol: string[]; carro: string[]; filmes: string[];
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
        ...frases.motivacao, ...frases.visao, ...frases.zueira, ...frases.resenha,
        ...frases.indiretas, ...frases.empreendedor, ...frases.tech, ...frases.trampo,
        ...frases.conteudo, ...frases.romance, ...frases.reflexao, ...frases.curtas,
        ...frases.musicas, ...frases.futebol, ...frases.carro, ...frases.filmes,
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

    // 3. Contexto do dia da semana (só quando é "todas" e sem busca)
    if (tom === "todas" && !tema) {
      const dia = new Date().getDay();
      const diaKey = DIAS[dia];
      if (diaKey) {
        const diaFrases = frases.diasemana[diaKey] || [];
        pool = [...new Set([...diaFrases, ...pool])];
      }
    }

    // 4. Remove duplicatas e retorna TUDO (sem limitar)
    const selecionadas = [...new Set(pool)];

    // 5. Hashtags por categoria

    // 6. Hashtags genéricas baseadas no tom
    const hashMap: Record<string, string[]> = {
      motivacao: ["#motivação","#foco","#disciplina","#evolução","#mindset"],
      visao: ["#visão","#cria","#caminhada","#corre","#atitude"],
      zueira: ["#zueira","#humor","#meme","#brasil","#sextou"],
      resenha: ["#resenha","#humor","#piada","#risos","#brasil"],
      indiretas: ["#indireta","#deboche","#real","#atitude","#blindagem"],
      empreendedor: ["#empreendedorismo","#negócios","#trabalho","#sucesso","#dinheiro"],
      tech: ["#tech","#dev","#programação","#código","#bug"],
      trampo: ["#trampo","#conteúdo","#criador","#work","#bastidor"],
      conteudo: ["#conteúdo","#criador","#vídeo","#edição","#algoritmo"],
      carro: ["#carro","#asfalto","#garagem","#motor","#estrada"],
      romance: ["#amor","#romance","#casal","#saudade","#frasesdeamor"],
      reflexao: ["#reflexão","#pensamento","#filosofia","#vida","#sabedoria"],
      curtas: ["#frases","#curtas","#story","#inspiração","#vibe"],
      musicas: ["#música","#mpb","#rocknacional","#samba","#poesia"],
      futebol: ["#futebol","#bola","#gol","#camisa10","#domingo"],
      filmes: ["#filme","#cinema","#frasesdefilme","#cultura","#pop"],
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
