"use client";
import { useState, useEffect, useRef } from "react";

type Jogador = {
    id: string;
    nome: string;
    partidas: number;
    status: "timeA" | "timeB" | "fila" | "fora";
    dataAdd: number;
    posicao: number;
};

export default function GerenciadorRacha() {
    const [nomeInput, setNomeInput] = useState("");
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    const [historico, setHistorico] = useState<Jogador[][]>([]);
    const [jogadorSelecionado, setJogadorSelecionado] = useState<Jogador | null>(null);
    const [tamanhoTime, setTamanhoTime] = useState(7);

    // Trava de segurança para não salvar lista vazia por cima dos dados reais no refresh
    const carregadoRef = useRef(false);

    // 1. CARREGAR DADOS (Roda ao abrir a página)
    useEffect(() => {
        const chave = "@racha-persistente-vfinal";
        const dadosSalvos = localStorage.getItem(chave);

        if (dadosSalvos) {
            try {
                const { lista, hist, tamanho } = JSON.parse(dadosSalvos);
                if (lista) setJogadores(lista);
                if (hist) setHistorico(hist);
                if (tamanho) setTamanhoTime(tamanho);
            } catch (e) {
                console.error("Erro ao carregar dados");
            }
        }
        carregadoRef.current = true;
    }, []);

    // 2. SALVAR DADOS (Roda sempre que algo muda)
    useEffect(() => {
        if (carregadoRef.current) {
            const chave = "@racha-persistente-vfinal";
            localStorage.setItem(chave, JSON.stringify({ lista: jogadores, hist: historico, tamanho: tamanhoTime }));
        }
    }, [jogadores, historico, tamanhoTime]);

    // Listas Filtradas
    const filaEspera = jogadores.filter(j => j.status === "fila").sort((a, b) => a.posicao - b.posicao);
    const timeA = jogadores.filter(j => j.status === "timeA").sort((a, b) => a.posicao - b.posicao);
    const timeB = jogadores.filter(j => j.status === "timeB").sort((a, b) => a.posicao - b.posicao);
    const jogadoresFora = jogadores.filter(j => j.status === "fora").sort((a, b) => a.dataAdd - b.dataAdd);

    const salvarHistorico = () => {
        setHistorico(prev => [...prev, jogadores].slice(-20));
    };

    const desfazerAcao = () => {
        if (historico.length === 0) return;
        setJogadores(historico[historico.length - 1]);
        setHistorico(prev => prev.slice(0, -1));
    };

    const adicionarJogador = () => {
        const nome = nomeInput.trim();
        if (!nome) return;
        if (jogadores.some(j => j.nome.toLowerCase() === nome.toLowerCase())) {
            alert(`⚠️ O jogador "${nome}" já está na lista!`);
            return;
        }
        salvarHistorico();
        const agora = Date.now();
        setJogadores([...jogadores, { id: agora.toString(), nome, partidas: 0, status: "fila", dataAdd: agora, posicao: agora }]);
        setNomeInput("");
    };

    const registrarFimDeJogo = (timeDerrotadoId: "timeA" | "timeB") => {
        salvarHistorico();
        const timeVencedorId = timeDerrotadoId === "timeA" ? "timeB" : "timeA";
        const perdedores = jogadores.filter(j => j.status === timeDerrotadoId).sort((a, b) => a.posicao - b.posicao);

        const qtdEntra = Math.min(filaEspera.length, tamanhoTime);
        const quemEntra = filaEspera.slice(0, qtdEntra);
        const quemFica = perdedores.slice(0, Math.max(0, perdedores.length - qtdEntra));
        const quemSai = perdedores.slice(Math.max(0, perdedores.length - qtdEntra));

        const novoTimeIds = [...quemEntra, ...quemFica].map(t => t.id);
        const novaFilaIds = quemSai.map(j => j.id);
        const agora = Date.now();

        setJogadores(lista => lista.map(j => {
            let part = j.partidas + (j.status === "timeA" || j.status === "timeB" ? 1 : 0);
            if (novoTimeIds.includes(j.id)) return { ...j, status: timeDerrotadoId, posicao: agora + novoTimeIds.indexOf(j.id), partidas: part };
            if (novaFilaIds.includes(j.id)) return { ...j, status: "fila", posicao: agora + 1000000 + novaFilaIds.indexOf(j.id), partidas: part };
            if (j.status === timeVencedorId) return { ...j, partidas: part };
            return j;
        }));
    };

    const mudarStatus = (id: string, novoStatus: "timeA" | "timeB" | "fila" | "fora") => {
        salvarHistorico();
        const agora = Date.now();
        setJogadores(lista => lista.map(j => j.id === id ? { ...j, status: novoStatus, posicao: agora } : j));
        setJogadorSelecionado(null);
    };

    const sortearIniciais = () => {
        const ativos = jogadores.filter(j => j.status !== "fora");
        if (ativos.length < 2) return;
        salvarHistorico();
        const titulares = ativos.sort((a, b) => a.dataAdd - b.dataAdd).slice(0, tamanhoTime * 2);
        const embaralhado = [...titulares].sort(() => Math.random() - 0.5);
        const agora = Date.now();
        setJogadores(lista => lista.map(j => {
            if (j.status === "fora") return j;
            const idxSorteio = embaralhado.findIndex(t => t.id === j.id);
            if (idxSorteio !== -1) return { ...j, status: idxSorteio < tamanhoTime ? "timeA" : "timeB", posicao: agora + idxSorteio, partidas: 0 };
            return { ...j, status: "fila", posicao: agora + 2000 + j.dataAdd, partidas: 0 };
        }));
    };

    const injetarTeste = () => {
        const nomes = ["Leandro", "João", "Pedrinho", "Lucas", "Gabriel", "Thiago", "Marcos", "Rafael", "Bruno", "Carlos", "Diego", "Fernando", "Rodrigo", "Alex", "Marcelo", "Felipe", "Zé Goleiro"];
        const agora = Date.now();
        setJogadores(nomes.map((n, i) => ({ id: (agora + i).toString(), nome: n, partidas: 0, status: "fila", dataAdd: agora + i, posicao: agora + i })));
    };

    const renderTime = (titulo: string, timeId: "timeA" | "timeB", jogadoresTime: Jogador[], corBg: string, corBorda: string, corTxt: string) => (
        <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm ${corBg} ${corBorda}`}>
            <div className="flex justify-between items-center mb-5">
                <h2 className={`font-black uppercase text-xs tracking-widest ${corTxt}`}>{titulo} ({jogadoresTime.length}/{tamanhoTime})</h2>
                <button onClick={() => registrarFimDeJogo(timeId)} className="bg-red-600 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase active:scale-95 shadow-md">🚨 PERDEU</button>
            </div>
            <div className="flex flex-col gap-2">
                {jogadoresTime.map((j, i) => (
                    <div key={j.id} className="bg-white p-3.5 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-300">{i + 1}</span>
                            <span className="text-sm font-bold text-slate-800">{j.nome}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {j.partidas > 0 && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">🔥{j.partidas}</span>}
                            <button onClick={() => setJogadorSelecionado(j)} className="bg-slate-50 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-100 active:scale-90 transition-all">⇄</button>
                        </div>
                    </div>
                ))}
                {jogadoresTime.length === 0 && <p className="text-center text-slate-400 text-[10px] py-4 italic font-bold uppercase tracking-widest">Time Vazio</p>}
            </div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto p-6 pb-24 bg-slate-50 min-h-screen font-sans text-slate-900 flex flex-col gap-8">

            {/* HEADER */}
            <div className="mt-4 flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tighter italic text-slate-900">RACHA PRO ⚽</h1>
                <div className="flex gap-2">
                    {historico.length > 0 && <button onClick={desfazerAcao} className="text-[10px] font-bold bg-white border px-4 py-2 rounded-xl active:scale-95 shadow-sm">↩ DESFAZER</button>}
                    <button onClick={sortearIniciais} className="text-[10px] font-bold bg-slate-900 text-white px-4 py-2 rounded-xl active:scale-95 shadow-lg">🎲 SORTEAR</button>
                </div>
            </div>

            {/* CONFIG */}
            <div className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Time de {tamanhoTime}</span>
                <div className="flex gap-6 items-center">
                    <button onClick={() => setTamanhoTime(t => Math.max(1, t - 1))} className="font-black text-2xl px-2 text-slate-300">-</button>
                    <span className="font-black text-lg w-4 text-center">{tamanhoTime}</span>
                    <button onClick={() => setTamanhoTime(t => t + 1)} className="font-black text-2xl px-2 text-slate-300">+</button>
                </div>
            </div>

            {/* TIMES */}
            <div className="flex flex-col gap-6">
                {renderTime("Time A (Colete Azul)", "timeA", timeA, "bg-green-50/50", "border-green-500", "text-green-800")}
                {renderTime("Time B (Colete Vermelho)", "timeB", timeB, "bg-blue-50/50", "border-blue-500", "text-blue-800")}
            </div>

            {/* ADICIONAR - PRÓXIMO DA FILA */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                    <input type="text" placeholder="Novo jogador..." className="flex-1 p-5 rounded-[1.5rem] border-none shadow-md font-bold outline-none focus:ring-2 focus:ring-slate-900 bg-white" value={nomeInput} onChange={e => setNomeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && adicionarJogador()} />
                    <button onClick={adicionarJogador} className="bg-slate-900 text-white px-7 rounded-[1.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all">+</button>
                </div>
                {/* {jogadores.length === 0 && <button onClick={injetarTeste} className="bg-indigo-600 text-white p-4 rounded-3xl text-[10px] font-black uppercase shadow-lg active:scale-95">🧪 Injetar 17 nomes</button>} */}
            </div>

            {/* PRÓXIMOS A JOGAR */}
            <div className="bg-white p-7 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col gap-6">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Próximos a Jogar ({filaEspera.length})</h2>
                    {jogadores.length > 0 && <button onClick={() => { if (confirm("Limpar racha?")) setJogadores([]) }} className="text-[10px] font-black text-red-400 uppercase tracking-widest">Limpar 🗑️</button>}
                </div>
                <div className="flex flex-col gap-3">
                    {filaEspera.map((j, i) => (
                        <div key={j.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-200 w-4">{i + 1}º</span>
                                <span className="font-bold text-slate-700">{j.nome}</span>
                                {j.partidas > 0 && <span className="text-[10px] font-black text-orange-400 bg-orange-50 px-2 py-1 rounded-lg">🔥 {j.partidas}</span>}
                            </div>
                            <button onClick={() => setJogadorSelecionado(j)} className="bg-white w-10 h-10 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center font-bold text-slate-400 active:scale-90 transition-all">⇄</button>
                        </div>
                    ))}
                </div>
                {jogadoresFora.length > 0 && (
                    <div className="mt-4 pt-8 border-t border-dashed border-slate-200 text-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {jogadoresFora.map(j => (
                                <button key={j.id} onClick={() => setJogadorSelecionado(j)} className="px-5 py-2 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200 active:scale-95">{j.nome}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="h-12"></div>

            {/* MODAL */}
            {jogadorSelecionado && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl animate-in slide-in-from-bottom-20">
                        <h3 className="text-center font-black text-2xl mb-10 text-slate-800 tracking-tighter uppercase">{jogadorSelecionado.nome}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button onClick={() => mudarStatus(jogadorSelecionado.id, "timeA")} className="bg-green-600 text-white p-6 rounded-3xl font-black shadow-lg shadow-green-100 active:scale-95">TIME A</button>
                            <button onClick={() => mudarStatus(jogadorSelecionado.id, "timeB")} className="bg-blue-600 text-white p-6 rounded-3xl font-black shadow-lg shadow-blue-100 active:scale-95">TIME B</button>
                            <button onClick={() => mudarStatus(jogadorSelecionado.id, "fila")} className="bg-yellow-400 text-white p-6 rounded-3xl font-black shadow-lg shadow-yellow-100 active:scale-95">FILA</button>
                            <button onClick={() => mudarStatus(jogadorSelecionado.id, "fora")} className="bg-slate-200 text-slate-600 p-6 rounded-3xl font-black active:scale-95">SAIR</button>
                        </div>
                        <button onClick={() => setJogadorSelecionado(null)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}