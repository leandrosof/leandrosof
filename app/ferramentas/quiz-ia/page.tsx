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
  const [erroLimite, setErroLimite] = useState(false);

  const gerarQuiz = async () => {
    if (!tema) return;
    setLoading(true);
    setErroLimite(false);
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

      if (response.status === 429) {
        setErroLimite(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.perguntas) setPerguntas(data.perguntas);
    } catch (error) {
      console.error("Erro ao gerar quiz:", error);
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
    setErroLimite(false);
  };

  const progresso = perguntas.length > 0 ? ((indiceAtual + 1) / perguntas.length) * 100 : 0;

  return (
    // Adicionado padding vertical (py-12) para o conteúdo não colar no topo/rodapé da tela
    <div className="max-w-3xl mx-auto p-6 py-12 min-h-screen font-sans">
      
      {!jogoFinalizado && perguntas.length === 0 && !loading && (
        <>
          {/* Aumentado a margem superior (mt-12) e o gap interno (gap-10) */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-10 text-center mt-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quiz IA Infinito 🧠</h1>
              <p className="text-slate-500 font-medium text-lg px-4">Desafie a inteligência artificial com perguntas exclusivas sobre QUALQUER assunto.</p>
            </div>

            {erroLimite && (
              // Adicionado margem negativa (my-2) para equilibrar o gap do container
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl text-left animate-in fade-in slide-in-from-top-2 duration-300 my-2">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1">🚨</span>
                  <div>
                    <h3 className="text-red-800 font-black text-lg">Servidor em Capacidade Máxima</h3>
                    <p className="text-red-700 font-medium leading-relaxed">
                      Esgotamos a cota gratuita de hoje. 
                      O sistema reinicia à meia-noite (UTC). Tente novamente amanhã!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <input
                type="text"
                disabled={erroLimite}
                className="w-full p-6 text-center text-xl border-2 border-gray-200 rounded-2xl outline-none font-bold text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all placeholder:text-gray-300 disabled:opacity-50 disabled:bg-gray-50"
                placeholder={erroLimite ? "Limite diário atingido" : "Ex: Hardware, ReactJS, GTA RP..."}
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && gerarQuiz()}
              />

              <button 
                onClick={gerarQuiz} 
                disabled={erroLimite}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-5 rounded-2xl hover:opacity-90 transition-all text-xl shadow-lg shadow-cyan-200 active:scale-[0.98] disabled:grayscale disabled:opacity-50 mt-10"
              >
                {erroLimite ? "VOLTE AMANHÃ" : "GERAR MEU QUIZ"}
              </button>
            </div>
          </div>

          {/* Seção "Como funciona" com espaçamento superior generoso (mt-24) */}
          <div className="mt-24 text-left space-y-8 text-slate-300 max-w-2xl mx-auto pb-20">
            <h2 className="text-2xl font-black text-white border-b border-white/10 pb-4">Como funciona o Gerador de Quiz por IA?</h2>
            
            <p className="font-medium leading-relaxed">
              O <strong className="text-cyan-400">Quiz IA Infinito</strong> é uma ferramenta gratuita que gera questionários exclusivos de perguntas em tempo real.
            </p>

            {/* Adicionado padding interno (p-6) e margem vertical (my-6) no box de cota */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
              <p className="font-medium leading-relaxed">
                <span className="text-yellow-400 mr-2">⚠️</span> 
                <strong className="text-white">Sobre a cota diária:</strong> Se o aviso de limite aparecer, significa que a cota gratuita da API de hoje foi atingida. O limite é resetado todas as noites.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Exemplos de temas para testar:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <ul className="list-disc list-inside space-y-3 font-medium text-slate-400 ml-2">
                  <li><strong className="text-cyan-400">Tecnologia:</strong> ReactJS, Python.</li>
                  <li><strong className="text-cyan-400">Games:</strong> GTA RP, Minecraft.</li>
                </ul>
                <ul className="list-disc list-inside space-y-3 font-medium text-slate-400 ml-2">
                  <li><strong className="text-cyan-400">Esportes:</strong> F1, Futebol.</li>
                  <li><strong className="text-cyan-400">Gerais:</strong> Geografia, Cinema.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TELA DE LOADING */}
      {loading && (
        <div className="py-40 text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Criando perguntas inéditas...</h2>
            <p className="text-slate-400 italic">Pesquisando sobre "{tema}"...</p>
          </div>
        </div>
      )}

      {/* TELA DO JOGO */}
      {perguntas.length > 0 && !jogoFinalizado && !loading && (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 mt-8 animate-in zoom-in-95 duration-300">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-cyan-600 text-sm uppercase tracking-widest">{tema}</span>
              <div className="flex items-center gap-4">
                {/* O contador agora reflete dinamicamente o array  */}
                <span className="font-black text-slate-400 text-lg">{indiceAtual + 1} de {perguntas.length}</span>
                <button 
                  onClick={() => window.confirm('Abandonar quiz?') && resetarJogo()}
                  className="text-xs font-black text-slate-400 bg-slate-100 hover:bg-red-100 hover:text-red-600 px-4 py-2 rounded-xl transition-all uppercase tracking-tighter"
                >
                  Sair
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-10">
            {perguntas[indiceAtual].pergunta}
          </h2>

          <div className="flex flex-col gap-4">
            {perguntas[indiceAtual].opcoes.map((opcao, index) => {
              let cor = "bg-white border-gray-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 shadow-sm";
              if (respostaSelecionada) {
                if (opcao === perguntas[indiceAtual].resposta_correta) cor = "bg-green-50 border-green-500 text-green-700 shadow-none";
                else if (opcao === respostaSelecionada) cor = "bg-red-50 border-red-500 text-red-700 shadow-none";
                else cor = "opacity-40 grayscale border-gray-100 shadow-none";
              }
              return (
                <button
                  key={index}
                  onClick={() => responder(opcao)}
                  disabled={!!respostaSelecionada}
                  className={`p-6 rounded-2xl border-2 font-bold text-lg text-left transition-all duration-200 ${cor}`}
                >
                  {opcao}
                </button>
              );
            })}
          </div>

          {respostaSelecionada && (
            <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8">
                <p className="font-black text-slate-400 uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                  <span>💡</span> Curiosidade
                </p>
                <p className="text-slate-800 font-medium leading-relaxed">{perguntas[indiceAtual].curiosidade}</p>
              </div>
              <button 
                onClick={proximaPergunta}
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
              >
                {indiceAtual + 1 === perguntas.length ? "VER RESULTADO FINAL" : "PRÓXIMA PERGUNTA"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TELA DE RESULTADO */}
      {jogoFinalizado && (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 text-center flex flex-col items-center gap-8 mt-12 animate-in fade-in duration-500">
          <h2 className="text-3xl font-black text-slate-900">Quiz Finalizado! 🎮</h2>
          <div className="bg-slate-50 w-full p-10 rounded-[2rem] border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Sua Pontuação</p>
            <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {pontuacao} <span className="text-4xl text-slate-300">/ {perguntas.length}</span>
            </div>
          </div>
          <p className="text-xl font-bold text-slate-600 px-6 leading-relaxed">
            {pontuacao >= 12 ? "Você é um mestre absoluto! 🏆" : pontuacao >= 7 ? "Mandou muito bem! 🔥" : "Vale a pena tentar de novo! 👀"}
          </p>
          <button onClick={resetarJogo} className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-slate-800 transition-all text-xl shadow-lg active:scale-[0.98]">
            JOGAR OUTRO TEMA
          </button>
        </div>
      )}
    </div>
  );
}