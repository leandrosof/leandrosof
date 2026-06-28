"use client";

import { useReducer, useEffect, useRef, useState } from "react";
import { trackToolUsage } from "@/lib/analytics";

type Status = "timeA" | "timeB" | "fila" | "fora";

type Player = {
  id: string;
  name: string;
  status: Status;
  order: number;
  matches: number;
  wins: number;
  losses: number;
};

type MatchRecord = {
  id: string;
  date: string;
  timeANames: string[];
  timeBNames: string[];
  winner: "timeA" | "timeB";
};

type State = {
  players: Player[];
  history: MatchRecord[];
  teamSize: number;
  totalMatches: number;
  pastStates: { players: Player[]; history: MatchRecord[]; totalMatches: number }[];
};

type Action =
  | { type: "LOAD"; state: State }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "MOVE_PLAYER"; id: string; status: Status }
  | { type: "SWAP_PLAYERS"; teamPlayerId: string; queuePlayerId: string }
  | { type: "SET_TEAM_SIZE"; size: number }
  | { type: "RECORD_MATCH"; winner: "timeA" | "timeB" }
  | { type: "SHUFFLE_TEAMS" }
  | { type: "RESET" }
  | { type: "UNDO" };

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function maxOrder(players: Player[]) {
  return players.reduce((max, p) => Math.max(max, p.order), 0);
}

function snapshot(state: State): State {
  return {
    ...state,
    pastStates: [
      ...state.pastStates,
      {
        players: [...state.players],
        history: [...state.history],
        totalMatches: state.totalMatches,
      },
    ].slice(-30),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return {
        ...initialState,
        ...action.state,
        players: Array.isArray(action.state.players) ? action.state.players : [],
        history: Array.isArray(action.state.history) ? action.state.history : [],
        pastStates: Array.isArray(action.state.pastStates) ? action.state.pastStates : [],
      };

    case "ADD_PLAYER": {
      const name = action.name.trim();
      if (!name || state.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        return state;
      }
      const player: Player = {
        id: uid(), name, status: "fila", order: maxOrder(state.players) + 1,
        matches: 0, wins: 0, losses: 0,
      };
      return { ...snapshot(state), players: [...state.players, player] };
    }

    case "REMOVE_PLAYER":
      return { ...snapshot(state), players: state.players.filter((p) => p.id !== action.id) };

    case "RENAME_PLAYER": {
      const newName = action.name.trim();
      if (!newName) return state;
      if (state.players.some((p) => p.id !== action.id && p.name.toLowerCase() === newName.toLowerCase())) {
        return state;
      }
      return {
        ...snapshot(state),
        players: state.players.map((p) => (p.id === action.id ? { ...p, name: newName } : p)),
      };
    }

    case "MOVE_PLAYER": {
      const teamA = state.players.filter((p) => p.status === "timeA");
      const teamB = state.players.filter((p) => p.status === "timeB");
      if (action.status === "timeA" && teamA.length >= state.teamSize) return state;
      if (action.status === "timeB" && teamB.length >= state.teamSize) return state;
      return {
        ...snapshot(state),
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, status: action.status, order: maxOrder(state.players) + 1 } : p
        ),
      };
    }

    case "SWAP_PLAYERS": {
      const teamPlayer = state.players.find((p) => p.id === action.teamPlayerId);
      const queuePlayer = state.players.find((p) => p.id === action.queuePlayerId);
      if (!teamPlayer || !queuePlayer) return state;
      if (teamPlayer.status !== "timeA" && teamPlayer.status !== "timeB") return state;
      if (queuePlayer.status !== "fila") return state;

      const base = maxOrder(state.players);
      return {
        ...snapshot(state),
        players: state.players.map((p) => {
          if (p.id === action.teamPlayerId) return { ...p, status: "fila", order: base + 1 };
          if (p.id === action.queuePlayerId) return { ...p, status: teamPlayer.status, order: base + 2 };
          return p;
        }),
      };
    }

    case "SET_TEAM_SIZE":
      return { ...state, teamSize: Math.max(1, action.size) };

    case "RECORD_MATCH": {
      const loserSide = action.winner === "timeA" ? "timeB" : "timeA";
      const losers = state.players.filter((p) => p.status === loserSide).sort((a, b) => a.order - b.order);
      const fila = state.players.filter((p) => p.status === "fila").sort((a, b) => a.order - b.order);
      const qtyIn = Math.min(fila.length, state.teamSize);
      const maxStay = Math.max(0, state.teamSize - qtyIn);
      const qtyOut = Math.max(0, losers.length - maxStay);
      const inPlayers = fila.slice(0, qtyIn);
      const outPlayers = [...losers.slice(0, qtyOut)].sort((a, b) => a.order - b.order);
      const inIds = new Set(inPlayers.map((p) => p.id));
      const outIds = new Set(outPlayers.map((p) => p.id));
      const base = maxOrder(state.players);

      const match: MatchRecord = {
        id: uid(),
        date: new Date().toLocaleString("pt-BR"),
        timeANames: state.players.filter((p) => p.status === "timeA").sort((a, b) => a.order - b.order).map((p) => p.name),
        timeBNames: state.players.filter((p) => p.status === "timeB").sort((a, b) => a.order - b.order).map((p) => p.name),
        winner: action.winner,
      };

      return {
        ...snapshot(state),
        totalMatches: state.totalMatches + 1,
        history: [match, ...state.history].slice(0, 50),
        players: state.players.map((p) => {
          const played = p.status === "timeA" || p.status === "timeB";
          const newMatches = p.matches + (played ? 1 : 0);
          const newWins = p.wins + (played && p.status === action.winner ? 1 : 0);
          const newLosses = p.losses + (played && p.status !== action.winner ? 1 : 0);
          if (inIds.has(p.id)) return { ...p, status: loserSide, order: base + 1 + inPlayers.indexOf(p), matches: newMatches, wins: newWins, losses: newLosses };
          if (outIds.has(p.id)) return { ...p, status: "fila", order: base + 100 + outPlayers.indexOf(p), matches: newMatches, wins: newWins, losses: newLosses };
          return { ...p, matches: newMatches, wins: newWins, losses: newLosses };
        }),
      };
    }

    case "SHUFFLE_TEAMS": {
      const active = state.players.filter((p) => p.status !== "fora");
      if (active.length < 2) return state;
      const sorted = [...active].sort((a, b) => a.order - b.order);
      const spots = Math.min(state.teamSize * 2, sorted.length);
      const inTeams = sorted.slice(0, spots);
      const inQueue = sorted.slice(spots);
      if (inTeams.length < 2) return state;
      const shuffled = [...inTeams].sort(() => Math.random() - 0.5);
      const base = maxOrder(state.players);
      const teamAIds = new Set(shuffled.slice(0, state.teamSize).map((p) => p.id));
      const teamBIds = new Set(shuffled.slice(state.teamSize, state.teamSize * 2).map((p) => p.id));
      const queueIds = new Set(inQueue.map((p) => p.id));

      return {
        ...snapshot(state),
        players: state.players.map((p, i) => {
          if (p.status === "fora") return p;
          if (teamAIds.has(p.id)) return { ...p, status: "timeA", order: base + i + 1, matches: 0, wins: 0, losses: 0 };
          if (teamBIds.has(p.id)) return { ...p, status: "timeB", order: base + i + 1, matches: 0, wins: 0, losses: 0 };
          if (queueIds.has(p.id)) return { ...p, status: "fila", order: p.order, matches: 0, wins: 0, losses: 0 };
          return { ...p, status: "fila", order: p.order, matches: 0, wins: 0, losses: 0 };
        }),
      };
    }

    case "RESET":
      return { ...snapshot(state), players: [], history: [], totalMatches: 0 };

    case "UNDO": {
      if (state.pastStates.length === 0) return state;
      const prev = state.pastStates[state.pastStates.length - 1];
      return {
        ...state,
        players: prev.players,
        history: prev.history,
        totalMatches: prev.totalMatches,
        pastStates: state.pastStates.slice(0, -1),
      };
    }

    default:
      return state;
  }
}

const initialState: State = {
  players: [], history: [], teamSize: 7, totalMatches: 0, pastStates: [],
};

const LS_KEY = "@racha-pro-v3";

export default function GerenciadorRacha() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [nameInput, setNameInput] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showSubPicker, setShowSubPicker] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShuffleConfirm, setShowShuffleConfirm] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [showFullReset, setShowFullReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const toggleTimer = () => setTimerRunning((r) => !r);
  const resetTimer = () => { setTimerRunning(false); setTimerSeconds(0); };
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.players)) {
          dispatch({ type: "LOAD", state: { ...initialState, ...parsed } });
        } else {
          localStorage.removeItem(LS_KEY);
        }
      }
    } catch { localStorage.removeItem(LS_KEY); }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (loadedRef.current) localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const teamA = state.players.filter((p) => p.status === "timeA").sort((a, b) => a.order - b.order);
  const teamB = state.players.filter((p) => p.status === "timeB").sort((a, b) => a.order - b.order);
  const queue = state.players.filter((p) => p.status === "fila").sort((a, b) => a.order - b.order);
  const bench = state.players.filter((p) => p.status === "fora").sort((a, b) => a.order - b.order);
  const activeCount = state.players.filter((p) => p.status !== "fora").length;

  const addPlayer = () => {
    if (!nameInput.trim()) return;
    dispatch({ type: "ADD_PLAYER", name: nameInput });
    setNameInput("");
  };

  const canUndo = state.pastStates.length > 0;
  const canShuffle = state.players.filter((p) => p.status !== "fora").length >= 2;
  const teamsFull = teamA.length === state.teamSize && teamB.length === state.teamSize;

  return (
    <>
      <style>{`
        .racha-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 1.5rem 1.2rem 6rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .racha-teams {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .racha-container {
            max-width: 900px;
            padding: 2rem 2rem 6rem;
          }
          .racha-teams {
            flex-direction: row;
            gap: 1.25rem;
          }
          .racha-teams > * {
            flex: 1;
            min-width: 0;
          }
          .racha-header h1 {
            font-size: 2rem !important;
          }
        }
        @media (min-width: 1100px) {
          .racha-container {
            max-width: 1100px;
          }
        }
      `}</style>

    <div className="racha-container">
      {/* HEADER */}
      <div className="racha-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.5px", margin: 0 }}>RACHA PRO ⚽</h1>
          <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "2px 0 0" }}>
            {state.players.length} jogadores · {activeCount} ativos · {state.totalMatches} partidas
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={() => setShowSettings(true)} style={iconBtnStyle} title="Configurações">⚙️</button>
          <button onClick={canShuffle ? () => setShowShuffleConfirm(true) : undefined} style={{ ...iconBtnStyle, opacity: canShuffle ? 1 : 0.4, cursor: canShuffle ? "pointer" : "default" }} title="Sortear times">🎲</button>
        </div>
      </div>

      {/* TIMER */}
      <div className="card" style={{ padding: "1rem 1.5rem", opacity: 1, transform: "none", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 900, letterSpacing: "2px", fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(timerSeconds)}
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={toggleTimer} style={{ padding: "0.6rem 1.2rem", borderRadius: "30px", border: "none", background: timerRunning ? "#f59e0b" : "#22c55e", color: "#fff", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", minWidth: "80px" }}>
              {timerRunning ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button onClick={resetTimer} style={{ padding: "0.6rem 1.2rem", borderRadius: "30px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              ↺ Zerar
            </button>
          </div>
        </div>
      </div>

      {/* TEAMS */}
      <div className="racha-teams">
        <TeamBlock label="Time A · Colete Azul" color="#3b82f6" players={teamA} teamSize={state.teamSize} onSelect={setSelectedPlayer} canEndGame={teamsFull} onEndGame={() => setShowEndGame(true)} />
        <TeamBlock label="Time B · Colete Vermelho" color="#ef4444" players={teamB} teamSize={state.teamSize} onSelect={setSelectedPlayer} canEndGame={teamsFull} onEndGame={() => setShowEndGame(true)} />
      </div>

      {/* ADD PLAYER */}
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <input type="text" placeholder="Nome do jogador..." value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPlayer()} style={inputStyle} />
        <button onClick={addPlayer} style={{ padding: "0.9rem 1.5rem", borderRadius: "30px", border: "none", background: "var(--accent-color)", color: "#fff", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer" }}>+</button>
      </div>

      {/* QUEUE */}
      <div className="card" style={{ padding: "1.5rem", opacity: 1, transform: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: queue.length > 0 ? "1rem" : 0 }}>
          <h3 style={{ margin: 0, fontSize: "0.75rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Fila de Espera · {queue.length}</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {queue.map((p, i) => (
            <PlayerRow key={p.id} player={p} index={i} onSelect={setSelectedPlayer} />
          ))}
        </div>
        {queue.length === 0 && <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.8rem", padding: "1.5rem 0", margin: 0 }}>Ninguém na fila. Adicione jogadores acima.</p>}
      </div>

      {/* BENCH */}
      {bench.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.5rem", opacity: 1, transform: "none" }}>
          <h3 style={{ margin: "0 0 0.6rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Fora · {bench.length}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {bench.map((p) => (
              <button key={p.id} onClick={() => setSelectedPlayer(p)} style={chipStyle}>{p.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Player actions (context-aware) */}
      {selectedPlayer && !showSubPicker && (
        <PlayerModal
          player={selectedPlayer}
          teamSize={state.teamSize}
          teamACount={teamA.length}
          teamBCount={teamB.length}
          queueCount={queue.length}
          onMove={(id, status) => { dispatch({ type: "MOVE_PLAYER", id, status }); setSelectedPlayer(null); }}
          onSubstitute={() => setShowSubPicker(true)}
          onRename={() => { setEditingPlayer(selectedPlayer); setEditName(selectedPlayer.name); setSelectedPlayer(null); }}
          onRemove={() => {
            if (confirm(`Remover ${selectedPlayer.name}?`)) {
              dispatch({ type: "REMOVE_PLAYER", id: selectedPlayer.id });
              setSelectedPlayer(null);
            }
          }}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* MODAL: Substitution picker */}
      {selectedPlayer && showSubPicker && (
        <SubPickerModal
          teamPlayer={selectedPlayer}
          queuePlayers={queue}
          onSwap={(queueId) => {
            dispatch({ type: "SWAP_PLAYERS", teamPlayerId: selectedPlayer.id, queuePlayerId: queueId });
            setSelectedPlayer(null);
            setShowSubPicker(false);
          }}
          onBack={() => setShowSubPicker(false)}
          onClose={() => { setSelectedPlayer(null); setShowSubPicker(false); }}
        />
      )}

      {/* MODAL: Rename */}
      {editingPlayer && (
        <Modal onClose={() => setEditingPlayer(null)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 1.5rem" }}>Renomear</h2>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { dispatch({ type: "RENAME_PLAYER", id: editingPlayer.id, name: editName }); setEditingPlayer(null); } }} autoFocus style={{ ...inputStyle, textAlign: "center" }} />
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
            <button onClick={() => setEditingPlayer(null)} style={secondaryBtn}>Cancelar</button>
            <button onClick={() => { dispatch({ type: "RENAME_PLAYER", id: editingPlayer.id, name: editName }); setEditingPlayer(null); }} style={primaryBtn}>Salvar</button>
          </div>
        </Modal>
      )}

      {/* MODAL: End game */}
      {showEndGame && (
        <Modal onClose={() => setShowEndGame(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 0.5rem" }}>Fim de Jogo</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
            Qual time venceu?<br />
            <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>O time perdedor será rotacionado com a fila.</span>
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => { trackToolUsage("gerenciador-de-racha", "registrar_partida"); dispatch({ type: "RECORD_MATCH", winner: "timeA" }); setShowEndGame(false); }} style={{ flex: 1, padding: "1.2rem", borderRadius: "20px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}>🔵 Time A Venceu</button>
            <button onClick={() => { trackToolUsage("gerenciador-de-racha", "registrar_partida"); dispatch({ type: "RECORD_MATCH", winner: "timeB" }); setShowEndGame(false); }} style={{ flex: 1, padding: "1.2rem", borderRadius: "20px", border: "none", background: "#ef4444", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}>🔴 Time B Venceu</button>
          </div>
        </Modal>
      )}

      {/* MODAL: Full Reset */}
      {showFullReset && (
        <Modal onClose={() => setShowFullReset(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 0.5rem" }}>Resetar tudo?</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
            <span style={{ color: "#ef4444", fontWeight: 700 }}>Todos os jogadores, times, fila, histórico de partidas e estatísticas serão apagados permanentemente.</span>
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setShowFullReset(false)} style={secondaryBtn}>Cancelar</button>
            <button onClick={() => { dispatch({ type: "RESET" }); setShowFullReset(false); }} style={{ ...primaryBtn, background: "#ef4444" }}>Resetar Tudo</button>
          </div>
        </Modal>
      )}

      {/* MODAL: Confirm Sortear */}
      {showShuffleConfirm && (
        <Modal onClose={() => setShowShuffleConfirm(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 0.5rem" }}>Sortear times?</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
            Os times serão sorteados aleatoriamente com {state.teamSize} jogadores cada.<br />
            <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>⚠️ As estatísticas de todos os jogadores serão zeradas.</span>
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setShowShuffleConfirm(false)} style={secondaryBtn}>Cancelar</button>
            <button onClick={() => { trackToolUsage("gerenciador-de-racha", "sortear"); dispatch({ type: "SHUFFLE_TEAMS" }); setShowShuffleConfirm(false); }} style={primaryBtn}>Sortear</button>
          </div>
        </Modal>
      )}

      {/* MODAL: Settings */}
      {showSettings && (
        <Modal onClose={() => setShowSettings(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 1.5rem" }}>⚙️ Configurações</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {/* Team Size */}
            <div className="card" style={{ padding: "1rem 1.2rem", opacity: 1, transform: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text-secondary)" }}>Jogadores por time</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <button onClick={() => dispatch({ type: "SET_TEAM_SIZE", size: state.teamSize - 1 })} style={counterBtn}>−</button>
                  <span style={{ fontWeight: 900, fontSize: "1.1rem", minWidth: "1.2rem", textAlign: "center" }}>{state.teamSize}</span>
                  <button onClick={() => dispatch({ type: "SET_TEAM_SIZE", size: state.teamSize + 1 })} style={counterBtn}>+</button>
                </div>
              </div>
            </div>

            {/* History */}
            <button onClick={() => { setShowSettings(false); setShowHistory(true); }} style={settingsOptionBtn}>
              📋 Histórico de Partidas
              <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>{state.history.length} registros</span>
            </button>

            {/* Undo */}
            <button
              onClick={() => { setShowSettings(false); if (canUndo) setShowUndoConfirm(true); }}
              disabled={!canUndo}
              style={{ ...settingsOptionBtn, opacity: canUndo ? 1 : 0.4, cursor: canUndo ? "pointer" : "default" }}
            >
              ↩ Desfazer última ação
              <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>{state.pastStates.length} disponíveis</span>
            </button>

            {/* Full Reset */}
            <button
              onClick={() => { setShowSettings(false); setShowFullReset(true); }}
              disabled={state.players.length === 0}
              style={{ ...settingsOptionBtn, color: "#ef4444", opacity: state.players.length > 0 ? 1 : 0.4, cursor: state.players.length > 0 ? "pointer" : "default" }}
            >
              🗑️ Resetar tudo
              <span style={{ color: "#ef4444", fontSize: "0.7rem" }}>Jogadores, times, histórico</span>
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Confirm Undo */}
      {showUndoConfirm && (
        <Modal onClose={() => setShowUndoConfirm(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 0.5rem" }}>Desfazer última ação?</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
            A última alteração será revertida. Você pode desfazer ações anteriores repetindo este comando.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setShowUndoConfirm(false)} style={secondaryBtn}>Cancelar</button>
            <button onClick={() => { dispatch({ type: "UNDO" }); setShowUndoConfirm(false); }} style={primaryBtn}>Desfazer</button>
          </div>
        </Modal>
      )}

      {/* MODAL: History */}
      {showHistory && (
        <Modal onClose={() => setShowHistory(false)}>
          <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.2rem", margin: "0 0 1.5rem" }}>Histórico de Partidas</h2>
          {state.history.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Nenhuma partida registrada.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: "50vh", overflowY: "auto" }}>
              {state.history.map((m) => (
                <div key={m.id} className="card" style={{ padding: "1rem", opacity: 1, transform: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", color: m.winner === "timeA" ? "#3b82f6" : "#ef4444" }}>{m.winner === "timeA" ? "🔵 Time A" : "🔴 Time B"} venceu</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>{m.date}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    <strong style={{ color: "#3b82f6" }}>Time A:</strong> {m.timeANames.join(", ") || "—"}<br />
                    <strong style={{ color: "#ef4444" }}>Time B:</strong> {m.timeBNames.join(", ") || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
    </>
  );
}

/* ── Sub-components ── */

function TeamBlock({ label, color, players, teamSize, onSelect, canEndGame, onEndGame }: {
  label: string; color: string; players: Player[]; teamSize: number;
  onSelect: (p: Player) => void; canEndGame: boolean; onEndGame: () => void;
}) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}`, padding: "1.2rem", opacity: 1, transform: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: players.length > 0 ? "0.8rem" : 0 }}>
        <h3 style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: "var(--text-color)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label} <span style={{ color: "var(--text-secondary)" }}>({players.length}/{teamSize})</span>
        </h3>
        {canEndGame && (
          <button onClick={onEndGame} style={{ fontSize: "0.65rem", fontWeight: 800, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "6px 14px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fim de Jogo</button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {players.map((p, i) => (
          <PlayerRow key={p.id} player={p} index={i} onSelect={onSelect} />
        ))}
        {players.length === 0 && <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.75rem", padding: "0.8rem 0", margin: 0, fontStyle: "italic" }}>Time vazio</p>}
      </div>
    </div>
  );
}

function PlayerRow({ player, index, onSelect }: { player: Player; index: number; onSelect: (p: Player) => void }) {
  const winRate = player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0;
  return (
    <div onClick={() => onSelect(player)} style={playerRowStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-secondary)", minWidth: "1.2rem" }}>{index + 1}º</span>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        {player.matches > 0 && (
          <>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-secondary)" }}>{player.matches} jogos</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 800, color: winRate >= 50 ? "#22c55e" : "#f59e0b", background: winRate >= 50 ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: "8px" }}>{winRate}%</span>
          </>
        )}
      </div>
    </div>
  );
}

function PlayerModal({ player, teamSize, teamACount, teamBCount, queueCount, onMove, onSubstitute, onRename, onRemove, onClose }: {
  player: Player; teamSize: number; teamACount: number; teamBCount: number; queueCount: number;
  onMove: (id: string, status: Status) => void; onSubstitute: () => void;
  onRename: () => void; onRemove: () => void; onClose: () => void;
}) {
  const isInTeam = player.status === "timeA" || player.status === "timeB";
  const teamALabel = player.status === "timeA" ? `Time A (atual)` : `Time A${teamACount >= teamSize ? " 🔒" : ""}`;
  const teamBLabel = player.status === "timeB" ? `Time B (atual)` : `Time B${teamBCount >= teamSize ? " 🔒" : ""}`;
  const canMoveA = player.status !== "timeA" && teamACount < teamSize;
  const canMoveB = player.status !== "timeB" && teamBCount < teamSize;

  return (
    <Modal onClose={onClose}>
      <h2 style={{ textAlign: "center", fontWeight: 900, fontSize: "1.3rem", margin: "0 0 0.3rem", wordBreak: "break-word" }}>{player.name}</h2>
      <p style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-secondary)", margin: "0 0 1.2rem" }}>
        {player.matches} jogos · {player.wins}V / {player.losses}D
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* Team buttons - only show if NOT in that team and NOT full */}
        {!isInTeam && (
          <>
            <button onClick={() => canMoveA ? onMove(player.id, "timeA") : null} disabled={!canMoveA} style={{ ...actionBtn, background: canMoveA ? "#3b82f6" : "rgba(59,130,246,0.15)", color: canMoveA ? "#fff" : "rgba(59,130,246,0.4)", cursor: canMoveA ? "pointer" : "default" }}>🔵 {teamALabel}</button>
            <button onClick={() => canMoveB ? onMove(player.id, "timeB") : null} disabled={!canMoveB} style={{ ...actionBtn, background: canMoveB ? "#ef4444" : "rgba(239,68,68,0.15)", color: canMoveB ? "#fff" : "rgba(239,68,68,0.4)", cursor: canMoveB ? "pointer" : "default" }}>🔴 {teamBLabel}</button>
            {player.status === "fila" ? null : (
              <button onClick={() => onMove(player.id, "fila")} style={{ ...actionBtn, background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>🟡 Mover para Fila</button>
            )}
          </>
        )}

        {/* If player IS in a team, show substitute option */}
        {isInTeam && queueCount > 0 && (
          <button onClick={onSubstitute} style={{ ...actionBtn, background: "rgba(99,102,241,0.15)", color: "var(--accent-color)" }}>🔄 Substituir por alguém da fila</button>
        )}

        {isInTeam && (
          <>
            <button onClick={() => onMove(player.id, "fila")} style={{ ...actionBtn, background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>🟡 Mover para Fila</button>
            <button onClick={() => onMove(player.id, "fora")} style={{ ...actionBtn, background: "rgba(107,114,128,0.15)", color: "#9ca3af" }}>⚫ Mandar pro Banco</button>
          </>
        )}

        {player.status === "fora" && (
          <>
            <button onClick={() => canMoveA ? onMove(player.id, "timeA") : null} disabled={!canMoveA} style={{ ...actionBtn, background: canMoveA ? "#3b82f6" : "rgba(59,130,246,0.15)", color: canMoveA ? "#fff" : "rgba(59,130,246,0.4)", cursor: canMoveA ? "pointer" : "default" }}>🔵 {teamALabel}</button>
            <button onClick={() => canMoveB ? onMove(player.id, "timeB") : null} disabled={!canMoveB} style={{ ...actionBtn, background: canMoveB ? "#ef4444" : "rgba(239,68,68,0.15)", color: canMoveB ? "#fff" : "rgba(239,68,68,0.4)", cursor: canMoveB ? "pointer" : "default" }}>🔴 {teamBLabel}</button>
            <button onClick={() => onMove(player.id, "fila")} style={{ ...actionBtn, background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>🟡 Voltar pra Fila</button>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid var(--surface-border)", paddingTop: "1rem" }}>
        <button onClick={onRename} style={secondaryBtn}>✏️ Renomear</button>
        <button onClick={onRemove} style={{ ...secondaryBtn, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>🗑️ Remover</button>
      </div>
    </Modal>
  );
}

function SubPickerModal({ teamPlayer, queuePlayers, onSwap, onBack, onClose }: {
  teamPlayer: Player; queuePlayers: Player[];
  onSwap: (queueId: string) => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer", padding: 0 }}>←</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem" }}>Substituir</h2>
          <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "var(--text-secondary)" }}>
            <strong style={{ color: teamPlayer.status === "timeA" ? "#3b82f6" : "#ef4444" }}>{teamPlayer.name}</strong> sai · quem entra?
          </p>
        </div>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: "0 0 0.8rem", textAlign: "center" }}>
        Primeiro da fila aparece no topo — ordem justa de chegada
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "45vh", overflowY: "auto" }}>
        {queuePlayers.map((p, i) => (
          <div key={p.id} onClick={() => onSwap(p.id)} style={{ ...playerRowStyle, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#f59e0b", minWidth: "1.2rem" }}>{i + 1}º</span>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-color)" }}>Entrar →</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={overlayStyle}>
      <div style={modalStyle}>
        {children}
        <button onClick={onClose} style={{ width: "100%", marginTop: "0.8rem", padding: "0.6rem", borderRadius: "14px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer" }}>Fechar</button>
      </div>
    </div>
  );
}

/* ── Styles ── */

const inputStyle: React.CSSProperties = {
  flex: 1, padding: "0.9rem 1.2rem", borderRadius: "30px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "0.95rem", outline: "none",
  backdropFilter: "blur(10px)",
};

const playerRowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "0.6rem 1rem", borderRadius: "14px",
  background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)",
  cursor: "pointer",
};

const iconBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid var(--surface-border)",
  borderRadius: "14px", padding: "8px 12px", fontSize: "0.9rem",
  cursor: "pointer", color: "var(--text-color)", fontWeight: 700,
};

const counterBtn: React.CSSProperties = {
  background: "transparent", border: "none", color: "var(--text-secondary)",
  fontSize: "1.4rem", fontWeight: 800, cursor: "pointer", padding: "0 0.5rem", lineHeight: 1,
};

const settingsOptionBtn: React.CSSProperties = {
  width: "100%", padding: "0.9rem 1.2rem", borderRadius: "16px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontWeight: 700, fontSize: "0.85rem",
  cursor: "pointer", textAlign: "left" as const,
  display: "flex", justifyContent: "space-between", alignItems: "center",
};

const chipStyle: React.CSSProperties = {
  padding: "6px 14px", borderRadius: "20px",
  background: "rgba(255,255,255,0.04)", border: "1px solid var(--surface-border)",
  color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
};

const actionBtn: React.CSSProperties = {
  width: "100%", padding: "0.9rem", borderRadius: "16px", border: "none",
  fontWeight: 800, fontSize: "0.9rem", textAlign: "left" as const,
};

const secondaryBtn: React.CSSProperties = {
  flex: 1, padding: "0.7rem", borderRadius: "14px",
  border: "1px solid var(--surface-border)", background: "transparent",
  color: "var(--text-secondary)", fontWeight: 700, cursor: "pointer",
};

const primaryBtn: React.CSSProperties = {
  flex: 1, padding: "0.7rem", borderRadius: "14px", border: "none",
  background: "var(--accent-color)", color: "#fff", fontWeight: 700, cursor: "pointer",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 200,
  display: "flex", alignItems: "flex-end", justifyContent: "center",
  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", padding: "1rem",
};

const modalStyle: React.CSSProperties = {
  background: "var(--bg-color)", border: "1px solid var(--surface-border)",
  borderRadius: "28px", padding: "2rem 1.5rem",
  width: "100%", maxWidth: "420px", maxHeight: "85vh", overflowY: "auto",
};
