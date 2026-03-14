"use client";
import { useState } from "react";

type Pergunta = {
    pergunta: string;
    opcoes: string[];
    resposta_correta: string;
    curiosidade: string;
};

export default function QuizIA() {
    const [tema, setTema] = useState("");
    const [loading, setLoading] = useState(false);
    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);

    const [indiceAtual, setIndiceAtual] = useState(0);
    const [pontuacao, setPontuacao] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
    const [jogoFinalizado, setJogoFinalizado] = useState(false);

    const gerarQuiz = async () => {
        if (!tema) return alert("Digite um tema primeiro!");
        setLoading(true);

        setPerguntas([]);
        setJogoFinalizado(false);
        setIndiceAtual(0);
        setPontuacao(0);
        setRespostaSelecionada(null);

        try {
            const response = await fetch("/api/gerar-quiz", {
                method: "POST",
                body: JSON.stringify({ tema }),
            });
            const data = await response.json();
            if (data.perguntas) setPerguntas(data.perguntas);
        } catch (error) {
            alert("Erro ao gerar as perguntas. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const responder = (opcao: string) => {
        if (respostaSelecionada) return;
        setRespostaSelecionada(opcao);
        if (opcao === perguntas[indiceAtual].resposta_correta) {
            setPontuacao(pontuacao + 1);
        }
    };

    const proximaPergunta = () => {
        if (indiceAtual + 1 < perguntas.length) {
            setIndiceAtual(indiceAtual + 1);
            setRespostaSelecionada(null);
        } else {
            setJogoFinalizado(true);
        }
    };

    const resetarJogo = () => {
        setPerguntas([]);
        setTema("");
        setJogoFinalizado(false);
        setIndiceAtual(0);
        setPontuacao(0);
        setRespostaSelecionada(null);
    };

    const progresso = perguntas.length > 0 ? ((indiceAtual + 1) / perguntas.length) * 100 : 0;

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen font-sans">

            {/* TELA 1: DIGITAR O TEMA */}
            {!jogoFinalizado && perguntas.length === 0 && !loading && (
                <>
                    <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-8 text-center mt-10">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quiz IA Infinito 🧠</h1>
                            <p className="text-slate-500 font-medium text-lg">Desafie a inteligência artificial com 15 perguntas exclusivas sobre QUALQUER assunto do mundo.</p>
                        </div>

                        <input
                            type="text"
                            className="w-full p-6 text-center text-xl border-2 border-gray-200 rounded-2xl outline-none font-bold text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="Ex: Hardware, ReactJS, GTA RP..."
                            value={tema}
                            onChange={(e) => setTema(e.target.value)}
                        />

                        <button
                            onClick={gerarQuiz}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-5 rounded-2xl hover:opacity-90 transition-all text-xl shadow-lg shadow-cyan-200 active:scale-[0.98]"
                        >
                            GERAR MEU QUIZ
                        </button>
                    </div>

                    {/* TEXTO DE SEO PARA O GOOGLE (Só aparece na tela inicial) */}
                    <div className="mt-16 text-left space-y-6 text-slate-300 max-w-2xl mx-auto pb-10">
                        <h2 className="text-2xl font-black text-white">Como funciona o Gerador de Quiz por IA?</h2>
                        <p className="font-medium leading-relaxed">
                            O <strong className="text-cyan-400">Quiz IA Infinito</strong> é uma ferramenta gratuita alimentada por Inteligência Artificial que permite testar seus conhecimentos sobre qualquer assunto. Diferente de jogos de trivia comuns, aqui as perguntas não são pré-programadas. A IA gera um questionário exclusivo no momento em que você digita o tema.
                        </p>

                        <h3 className="text-xl font-bold text-white mt-4">Exemplos de temas para testar:</h3>
                        <ul className="list-disc list-inside space-y-2 font-medium ml-2">
                            <li><strong className="text-cyan-400">Tecnologia:</strong> ReactJS, Lógica de Programação, Hardware.</li>
                            <li><strong className="text-cyan-400">Games e RP:</strong> Regras de GTA RP, História dos Videogames.</li>
                            <li><strong className="text-cyan-400">Esportes:</strong> História do Flamengo, São Paulo FC, Fórmula 1.</li>
                            <li><strong className="text-cyan-400">Conhecimentos Gerais:</strong> Geografia, Mitologia, Cinema.</li>
                        </ul>
                    </div>
                </>
            )}

            {/* TELA DE LOADING */}
            {loading && (
                <div className="py-32 text-center flex flex-col items-center gap-6 mt-10">
                    <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin"></div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Criando 15 perguntas inéditas...</h2>
                    <p className="text-slate-500">A IA está revirando os arquivos sobre "{tema}".</p>
                </div>
            )}

            {/* TELA DO JOGO */}
            {perguntas.length > 0 && !jogoFinalizado && !loading && (
                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 mt-6">

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-cyan-600 text-sm uppercase tracking-wider">{tema}</span>

                            <div className="flex items-center gap-4">
                                <span className="font-black text-slate-400 text-lg">{indiceAtual + 1} de {perguntas.length}</span>

                                <button
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja abandonar este quiz? Todo o progresso será perdido.')) {
                                            resetarJogo();
                                        }
                                    }}
                                    className="text-xs font-black text-slate-400 bg-slate-100 hover:bg-red-100 hover:text-red-600 px-4 py-2 rounded-xl transition-all uppercase tracking-widest active:scale-[0.95]"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>

                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progresso}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
                        {perguntas[indiceAtual].pergunta}
                    </h2>

                    <div className="flex flex-col gap-4">
                        {perguntas[indiceAtual].opcoes.map((opcao, index) => {
                            let corBotao = "bg-white border-gray-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50";

                            if (respostaSelecionada) {
                                if (opcao === perguntas[indiceAtual].resposta_correta) {
                                    corBotao = "bg-green-50 border-green-500 text-green-700";
                                } else if (opcao === respostaSelecionada) {
                                    corBotao = "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    corBotao = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => responder(opcao)}
                                    disabled={!!respostaSelecionada}
                                    className={`p-5 rounded-2xl border-2 font-bold text-lg text-left transition-all duration-200 active:scale-[0.99] ${corBotao}`}
                                >
                                    {opcao}
                                </button>
                            );
                        })}
                    </div>

                    {respostaSelecionada && (
                        <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                                <p className="font-black text-slate-400 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                                    <span>💡</span> Curiosidade
                                </p>
                                <p className="text-slate-800 font-medium leading-relaxed">{perguntas[indiceAtual].curiosidade}</p>
                            </div>

                            <button
                                onClick={proximaPergunta}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                            >
                                {indiceAtual + 1 === perguntas.length ? "VER MEU RESULTADO FINAL" : "PRÓXIMA PERGUNTA"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TELA DE RESULTADO */}
            {jogoFinalizado && (
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center flex flex-col items-center gap-6 mt-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Fim de Jogo! 🎮</h2>

                    <div className="bg-slate-50 w-full p-8 rounded-3xl border border-slate-100 my-4">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Sua Pontuação</p>
                        <div className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                            {pontuacao} <span className="text-4xl text-slate-300">/ {perguntas.length}</span>
                        </div>
                    </div>

                    <p className="text-xl font-bold text-slate-600">
                        {pontuacao >= 12 ? "Você é um mestre absoluto! 🏆" :
                            pontuacao >= 7 ? "Mandou bem, mas dá pra melhorar! 🔥" :
                                "Hoje não foi seu dia de sorte... 👀"}
                    </p>

                    <button
                        onClick={resetarJogo}
                        className="mt-6 w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all text-lg shadow-lg shadow-slate-200 active:scale-[0.98]"
                    >
                        JOGAR OUTRO TEMA
                    </button>
                </div>
            )}
        </div>
    );
}