"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { trackToolUsage } from "@/lib/analytics";

/* ── Fontes ── */
const FONTES = [
  { name: "Serif", cat: "elegante", family: "Georgia, 'Times New Roman', serif" },
  { name: "Cursiva", cat: "elegante", family: "'Brush Script MT', 'Comic Sans MS', cursive" },
  { name: "Impact", cat: "impacto", family: "Impact, 'Arial Black', sans-serif" },
  { name: "Arial Black", cat: "impacto", family: "'Arial Black', Gadget, sans-serif" },
  { name: "Trebuchet", cat: "moderna", family: "'Trebuchet MS', Helvetica, sans-serif" },
  { name: "Verdana", cat: "moderna", family: "Verdana, Geneva, sans-serif" },
  { name: "Comic Sans", cat: "zueira", family: "'Comic Sans MS', 'Comic Neue', cursive" },
  { name: "Courier New", cat: "zueira", family: "'Courier New', monospace" },
  { name: "Tahoma", cat: "clean", family: "Tahoma, Geneva, sans-serif" },
  { name: "Palatino", cat: "clean", family: "'Palatino Linotype', 'Book Antiqua', serif" },
  { name: "Lucida Console", cat: "mono", family: "'Lucida Console', Monaco, monospace" },
  { name: "Consolas", cat: "mono", family: "Consolas, 'Courier New', monospace" },
];

const FONT_CATS = [
  { key: "elegante", label: "Elegante" },
  { key: "impacto", label: "Impacto" },
  { key: "moderna", label: "Moderna" },
  { key: "zueira", label: "Zueira" },
  { key: "clean", label: "Clean" },
  { key: "mono", label: "Mono" },
];

/* ── Estilos de fundo ── */
const ESTILOS = [
  {
    key: "neon",
    label: "🌈 Neon",
    bg: ["#6c00ff", "#ff00cc"],
    textColor: "#fff",
  },
  {
    key: "dark",
    label: "🖤 Dark",
    bg: ["#1a1a2e", "#0f0f1a"],
    textColor: "#fff",
  },
  {
    key: "tropical",
    label: "🌴 Tropical",
    bg: ["#f97316", "#facc15"],
    textColor: "#1a1a2e",
  },
  {
    key: "clean",
    label: "⚪ Clean",
    bg: ["#f8fafc", "#e2e8f0"],
    textColor: "#1e293b",
  },
  {
    key: "sunset",
    label: "🌅 Sunset",
    bg: ["#ef4444", "#f59e0b"],
    textColor: "#fff",
  },
  {
    key: "ocean",
    label: "🌊 Ocean",
    bg: ["#0ea5e9", "#06b6d4"],
    textColor: "#fff",
  },
];

/* ── Types ── */
type TextLayer = {
  text: string;
  font: string;
  size: number;
  color: string;
  x: number;
  y: number;
  shadow: boolean;
  bold: boolean;
};

type SavedPrefs = {
  estilo: string;
  cor1: string;
  cor2: string;
  tituloFonte: string;
  corpoFonte: string;
};

/* ── Util ── */
function loadPrefs(): SavedPrefs {
  try {
    const raw = localStorage.getItem("@story-prefs");
    return raw ? JSON.parse(raw) : ({} as SavedPrefs);
  } catch {
    return {} as SavedPrefs;
  }
}
function savePrefs(p: Partial<SavedPrefs>) {
  const current = loadPrefs();
  localStorage.setItem("@story-prefs", JSON.stringify({ ...current, ...p }));
}

const W = 1080;
const H = 1920;
const SAFE_TOP = 280;
const SAFE_BOT = 1640;
const SAFE_LR = 100;
const PREVIEW_SCALE = 0.14;

export default function GeradorStory() {
  const prefs = loadPrefs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLCanvasElement>(null);
  const [estilo, setEstilo] = useState(prefs.estilo || "neon");
  const [cor1, setCor1] = useState(prefs.cor1 || ESTILOS[0].bg[0]);
  const [cor2, setCor2] = useState(prefs.cor2 || ESTILOS[0].bg[1]);
  const [uploadBg, setUploadBg] = useState<string | null>(null);

  const [frases, setFrases] = useState<string[]>([]);
  const [todasFrases, setTodasFrases] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [fraseIdx, setFraseIdx] = useState(0);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState("todas");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Carrega TODAS as frases uma vez
  useEffect(() => {
    fetch("/api/gerar-frases-story", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tom: "todas", assunto: "" }),
    }).then(r => r.json()).then(d => {
      if (d.frases) { setTodasFrases(d.frases); setFrases(d.frases); }
    });
  }, []);

  // Filtro client-side instantaneo
  useEffect(() => {
    let pool = [...todasFrases];
    const busca = filtroBusca.trim().toLowerCase();
    if (busca.length >= 2) {
      const termos = busca.split(/\s+/).filter(w => w.length > 1);
      pool = pool.filter(f => termos.some(t => f.toLowerCase().includes(t)));
    }
    if (filtroCat !== "todas") {
      const catKeywords: Record<string, string[]> = {
        motivacao: ["senna","jobs","jordan","ganhar","vencer","campeão","sonho","garra","foco","disciplina","superação","persistência","sucesso","determinação","coragem","atitude","resultado","excelência"],
        zueira: ["palmeiras","segunda","café","academia","netflix","whatsapp","preguiça","golpe","brasil","sextou","cerveja","bolsa","beleza","cansado","surto"],
        empreendedor: ["dinheiro","trabalho","empreendedor","sucesso","negócio","vender","mercado","cliente","risco","investimento","lucro","salário","chefe","empresa"],
        romance: ["amor","saudade","coração","beijo","abraço","paixão","namoro","casal","romance","amar","te amo","você","sentimento","carinho"],
        reflexao: ["vida","tempo","mundo","paz","alma","felicidade","existência","sabedoria","pensamento","reflexão","verdade","essência","passado","futuro"],
        musicas: ["cantar","música","canção","melodia","samba","rock","mpb","legião","tim maia","raul","cazuza","chico","caetano","gil","roberto carlos"],
        filmes: ["filme","cena","cinema","star wars","batman","vingadores","harry potter","forrest","matrix","guerra","galáxia","herói"],
      };
      const keywords = catKeywords[filtroCat];
      if (keywords) pool = pool.filter(f => keywords.some(k => f.toLowerCase().includes(k)));
    }
    setFrases(pool);
    if (filtroCat !== "todas") {
      fetch("/api/gerar-frases-story", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tom: filtroCat, assunto: "" }),
      }).then(r => r.json()).then(d => { if (d.hashtags) setHashtags(d.hashtags); });
    } else { setHashtags([]); }
  }, [todasFrases, filtroCat, filtroBusca]);

  function buscarPorCategoria(cat: string) { setFiltroCat(cat); setFiltroBusca(""); }
  function buscarPorTexto(txt: string) { setFiltroBusca(txt); }

  const [titulo, setTitulo] = useState<TextLayer>({
    text: "",
    font: prefs.tituloFonte || "Impact, 'Arial Black', sans-serif",
    size: 120,
    color: "#ffffff",
    x: W / 2,
    y: H / 2 - 120,
    shadow: true,
    bold: true,
  });
  const [corpo, setCorpo] = useState<TextLayer>({
    text: "",
    font: prefs.corpoFonte || "'Trebuchet MS', Helvetica, sans-serif",
    size: 64,
    color: "#ffffff",
    x: W / 2,
    y: H / 2 + 40,
    shadow: false,
    bold: false,
  });

  const [showSafeZone, setShowSafeZone] = useState(true);
  const [dragging, setDragging] = useState<"titulo" | "corpo" | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<"titulo" | "corpo">(
    "titulo",
  );
  const [fontCat, setFontCat] = useState("impacto");
  const [showMockup, setShowMockup] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [firstTrack, setFirstTrack] = useState(false);

  // Contexto automático
  const now = new Date();
  const diaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ][now.getDay()];
  const hora = now.getHours();
  const momento =
    hora >= 5 && hora < 12
      ? "☀️ Manhã"
      : hora >= 12 && hora < 18
        ? "🌤️ Tarde"
        : "🌙 Noite";

  const estiloAtual = ESTILOS.find((e) => e.key === estilo) || ESTILOS[0];

  /* ── Carregar fonte Google ── */
  useEffect(() => {
    const fontsToLoad = new Set([titulo.font, corpo.font]);
    const loaded = new Set(
      Array.from(document.querySelectorAll("link[data-font]")).map((l) =>
        l.getAttribute("data-font"),
      ),
    );
    fontsToLoad.forEach((f) => {
      if (!loaded.has(f)) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}&display=swap`;
        link.rel = "stylesheet";
        link.setAttribute("data-font", f);
        document.head.appendChild(link);
      }
    });
  }, [titulo.font, corpo.font]);

  /* ── Helpers ── */
  function drawLayer(
    ctx: CanvasRenderingContext2D,
    layer: TextLayer,
    defaultColor: string,
  ) {
    const color =
      layer.color === "#fff" || layer.color === "#ffffff"
        ? defaultColor
        : layer.color;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${layer.bold ? "bold " : ""}${layer.size}px ${layer.font}`;
    ctx.fillStyle = color;

    if (layer.shadow) {
      ctx.shadowColor =
        color === "#1e293b" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    }

    const lines = wrapText(ctx, layer.text, W - SAFE_LR * 2);
    const lineH = layer.size * 1.3;
    const startY = layer.y - ((lines.length - 1) * lineH) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, layer.x, startY + i * lineH);
    });

    ctx.restore();
  }

  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = w;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [text];
  }

  /* ── Render Canvas ── */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render no preview (1080x1920 interno)
    canvas.width = W;
    canvas.height = H;
    drawFrame(ctx, false);

    // Render no oculto (download)
    const dlCanvas = downloadRef.current;
    if (dlCanvas) {
      dlCanvas.width = W;
      dlCanvas.height = H;
      const dlCtx = dlCanvas.getContext("2d");
      if (dlCtx) drawFrame(dlCtx, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, corpo, cor1, cor2, estilo, uploadBg, showSafeZone, estiloAtual]);

  function drawFrame(ctx: CanvasRenderingContext2D, isDownload: boolean) {
    if (uploadBg) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.max(W / img.width, H / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        const ix = (W - iw) / 2;
        const iy = (H - ih) / 2;
        ctx.drawImage(img, ix, iy, iw, ih);
        // Overlay escuro pra legibilidade
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, W, H);
        drawText();
      };
      img.src = uploadBg;
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, cor1);
      grad.addColorStop(1, cor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      drawText();
    }

    function drawText() {
      const textColor = uploadBg ? "#fff" : estiloAtual.textColor;
      drawLayer(ctx!, titulo, textColor);
      drawLayer(ctx!, corpo, textColor);

      // Safe zone
      if (showSafeZone && !isDownload) {
        ctx!.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = isDownload ? 4 : 2;
        ctx!.setLineDash([20, 10]);
        ctx!.strokeRect(
          SAFE_LR,
          SAFE_TOP,
          W - SAFE_LR * 2,
          SAFE_BOT - SAFE_TOP,
        );
        ctx!.setLineDash([]);
      }
    }
  }

  useEffect(() => {
    render();
  }, [render]);

  /* ── Frases ── */
  function selecionarFrase(frase: string) {
    const f = frase.trim();
    const words = f.split(/\s+/);
    // Só divide em título+corpo se for muito longa (> 18 palavras)
    if (words.length > 18) {
      const mid = Math.ceil(words.length * 0.55);
      setTitulo((t) => ({ ...t, text: words.slice(0, mid).join(" ") }));
      setCorpo((c) => ({ ...c, text: words.slice(mid).join(" ") }));
    } else {
      setTitulo((t) => ({ ...t, text: f }));
      setCorpo((c) => ({ ...c, text: "" }));
    }
    if (!firstTrack) {
      trackToolUsage("gerador-story", "primeira_frase");
      setFirstTrack(true);
    }
  }

  /* ── Drag & Drop ── */
  const handleMouseDown = (e: React.MouseEvent, layer: "titulo" | "corpo") => {
    setSelectedLayer(layer);
    setDragging(layer);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (dragging === "titulo") setTitulo((t) => ({ ...t, x, y }));
    else setCorpo((c) => ({ ...c, x, y }));
  };
  const handleMouseUp = () => setDragging(null);

  /* ── Download ── */
  function baixar() {
    trackToolUsage("gerador-story", "download");
    const canvas = downloadRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "story-1080x1920.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function compartilhar() {
    trackToolUsage("gerador-story", "compartilhar");
    const canvas = downloadRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return;
    const file = new File([blob], "story.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ title: "Meu Story", text: titulo.text, files: [file] }); return; }
      catch { /* cancelou */ }
    }
    baixar();
  }

  /* ── Aplicar estilo ── */
  function aplicarEstilo(key: string) {
    const est = ESTILOS.find((e) => e.key === key);
    if (!est) return;
    setEstilo(key);
    setCor1(est.bg[0]);
    setCor2(est.bg[1]);
    savePrefs({ estilo: key, cor1: est.bg[0], cor2: est.bg[1] });
  }

  const layer = selectedLayer === "titulo" ? titulo : corpo;
  const setLayer = selectedLayer === "titulo" ? setTitulo : setCorpo;

  if (!mounted) {
    return (
      <section style={{ paddingTop: "2rem", minHeight: "100vh" }}>
        <h2>Gerador de Story com Frase</h2>
        <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
      </section>
    );
  }

  return (
    <section
      style={{ paddingTop: "2rem", minHeight: "100vh", paddingBottom: "4rem" }}
      suppressHydrationWarning
    >
      <h2>Gerador de Story com Frase</h2>
      <p
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "800px",
        }}
      >
        Crie stories profissionais em 1080×1920. Escolha o tom, busque frases
        reais de autores consagrados e personalize o visual.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* ── PAINEL ESQUERDO: Frases + Config ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Frases */}
          <div
            className="card"
            style={{ padding: "1.2rem", opacity: 1, transform: "none" }}
          >
            <h3
              style={{
                margin: "0 0 0.8rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
              }}
            >
              📖 Frases ({frases.length})
            </h3>

            {/* Search */}
            <input
              value={filtroBusca}
              onChange={(e) => buscarPorTexto(e.target.value)}
              placeholder="Buscar por palavra-chave..."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid var(--surface-border)",
                background: "var(--card-bg)",
                color: "var(--text-color)",
                fontSize: "0.8rem",
                outline: "none",
                marginBottom: "0.6rem",
              }}
            />

            {/* Category tabs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginBottom: "0.6rem",
              }}
            >
              {[
                ["todas", "Todas"],
                ["motivacao", "🔥 Motivação"],
                ["zueira", "😂 Zueira"],
                ["empreendedor", "💼 Empreendedor"],
                ["romance", "❤️ Romance"],
                ["reflexao", "🧘 Reflexão"],
                ["musicas", "🎵 Músicas"],
                ["filmes", "🎬 Filmes"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => buscarPorCategoria(key)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "14px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border:
                      filtroCat === key
                        ? "1px solid var(--accent-color)"
                        : "1px solid var(--surface-border)",
                    background:
                      filtroCat === key
                        ? "rgba(99,102,241,0.1)"
                        : "transparent",
                    color:
                      filtroCat === key
                        ? "var(--accent-color)"
                        : "var(--text-secondary)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Phrase list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {frases.map((f, i) => {
                const ativo = fraseIdx === i && titulo.text === f;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button
                      onClick={() => { setFraseIdx(i); selecionarFrase(f); }}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: "10px", textAlign: "left", cursor: "pointer", fontSize: "0.78rem",
                        fontWeight: ativo ? 700 : 400, lineHeight: 1.4,
                        border: ativo ? "1px solid var(--accent-color)" : "1px solid transparent",
                        background: ativo ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                        color: ativo ? "var(--text-color)" : "var(--text-secondary)",
                      }}
                    >{f}</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(f.replace(/\s*\(.*?\)\s*$/, "")); }}
                      title="Copiar frase"
                      style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >📋</button>
                  </div>
                );
              })}
              {frases.length === 0 && (
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  Nenhuma frase encontrada.
                </p>
              )}
            </div>

            {/* Hashtags */}
            {hashtags.length > 0 && filtroCat !== "todas" && (
              <div
                style={{
                  marginTop: "0.6rem",
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "0.6rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                    }}
                  >
                    🏷️ Hashtags
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hashtags.join(" "));
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "8px",
                      border: "none",
                      background: copiedHash
                        ? "#22c55e"
                        : "rgba(99,102,241,0.1)",
                      color: copiedHash ? "#fff" : "var(--accent-color)",
                      cursor: "pointer",
                    }}
                  >
                    {copiedHash ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {hashtags.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.65rem",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--accent-color)",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Estilo visual */}
          <div
            className="card"
            style={{ padding: "1.2rem", opacity: 1, transform: "none" }}
          >
            <h3
              style={{
                margin: "0 0 0.8rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
              }}
            >
              Estilo visual
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                marginBottom: "0.8rem",
              }}
            >
              {ESTILOS.map((est) => (
                <button
                  key={est.key}
                  onClick={() => aplicarEstilo(est.key)}
                  suppressHydrationWarning
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border:
                      estilo === est.key
                        ? "2px solid var(--accent-color)"
                        : "1px solid var(--surface-border)",
                    background: `linear-gradient(135deg, ${est.bg[0]}, ${est.bg[1]})`,
                    color: est.textColor,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {est.label}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div>
                <label
                  style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}
                >
                  Cor 1
                </label>
                <input
                  type="color"
                  value={cor1}
                  onChange={(e) => {
                    setCor1(e.target.value);
                    savePrefs({ cor1: e.target.value });
                  }}
                  style={{
                    width: "100%",
                    height: "36px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}
                >
                  Cor 2
                </label>
                <input
                  type="color"
                  value={cor2}
                  onChange={(e) => {
                    setCor2(e.target.value);
                    savePrefs({ cor2: e.target.value });
                  }}
                  style={{
                    width: "100%",
                    height: "36px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <label
                htmlFor="bg-upload"
                style={{ flex: 1, padding: "10px", borderRadius: "14px", border: "2px dashed var(--accent-color)", background: "rgba(99,102,241,0.06)", color: "var(--accent-color)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", textAlign: "center" }}
              >
                📷 Upload imagem de fundo
              </label>
              <input
                id="bg-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onload = (ev) => setUploadBg(ev.target?.result as string);
                    r.readAsDataURL(f);
                    trackToolUsage("gerador-story", "upload_fundo");
                  }
                }}
              />
              {uploadBg && (
                <button
                  onClick={() => setUploadBg(null)}
                  style={{
                    marginTop: "0.4rem",
                    fontSize: "0.7rem",
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  Remover fundo
                </button>
              )}
            </div>
          </div>

          {/* Camadas de texto */}
          <div
            className="card"
            style={{ padding: "1.2rem", opacity: 1, transform: "none" }}
          >
            <h3
              style={{
                margin: "0 0 0.6rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
              }}
            >
              ✏️ Texto {selectedLayer === "titulo" ? "(Título)" : "(Corpo)"}
            </h3>
            <div
              style={{ display: "flex", gap: "6px", marginBottom: "0.8rem" }}
            >
              <button
                onClick={() => setSelectedLayer("titulo")}
                style={layerBtn(selectedLayer === "titulo")}
              >
                Título
              </button>
              <button
                onClick={() => setSelectedLayer("corpo")}
                style={layerBtn(selectedLayer === "corpo")}
              >
                Corpo
              </button>
            </div>

            {/* Editar texto */}
            <textarea
              value={layer.text}
              onChange={(e) => setLayer({ ...layer, text: e.target.value })}
              rows={2}
              placeholder="Digite o texto aqui..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid var(--surface-border)",
                background: "var(--card-bg)",
                color: "var(--text-color)",
                fontSize: "0.85rem",
                outline: "none",
                resize: "vertical",
                marginBottom: "0.8rem",
                fontFamily: "inherit",
              }}
            />

            {/* Fonte */}
            <div style={{ marginBottom: "0.8rem" }}>
              <label
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                Fonte
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginBottom: "0.4rem",
                }}
              >
                {FONT_CATS.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFontCat(cat.key)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border:
                        fontCat === cat.key
                          ? "1px solid var(--accent-color)"
                          : "1px solid var(--surface-border)",
                      background:
                        fontCat === cat.key
                          ? "rgba(99,102,241,0.1)"
                          : "transparent",
                      color:
                        fontCat === cat.key
                          ? "var(--accent-color)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {FONTES.filter((f) => f.cat === fontCat).map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setLayer({ ...layer, font: f.family });
                      if (selectedLayer === "titulo")
                        savePrefs({ tituloFonte: f.family });
                      else savePrefs({ corpoFonte: f.family });
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border:
                        layer.font === f.family
                          ? "1px solid var(--accent-color)"
                          : "1px solid var(--surface-border)",
                      background:
                        layer.font === f.family
                          ? "rgba(99,102,241,0.1)"
                          : "transparent",
                      color:
                        layer.font === f.family
                          ? "var(--accent-color)"
                          : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: f.family,
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Controles de estilo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5rem",
                marginBottom: "0.8rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Tamanho
                </label>
                <input
                  type="range"
                  min="40"
                  max="280"
                  value={layer.size}
                  onChange={(e) =>
                    setLayer({ ...layer, size: Number(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: "var(--accent-color)" }}
                />
                <span
                  style={{ fontSize: "0.6rem", color: "var(--text-secondary)" }}
                >
                  {Math.round(layer.size)}px
                </span>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Cor
                </label>
                <input
                  type="color"
                  value={layer.color}
                  onChange={(e) =>
                    setLayer({ ...layer, color: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "30px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  justifyContent: "flex-end",
                }}
              >
                <label
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={layer.shadow}
                    onChange={(e) =>
                      setLayer({ ...layer, shadow: e.target.checked })
                    }
                    style={{ accentColor: "var(--accent-color)" }}
                  />{" "}
                  Sombra
                </label>
                <label
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={layer.bold}
                    onChange={(e) =>
                      setLayer({ ...layer, bold: e.target.checked })
                    }
                    style={{ accentColor: "var(--accent-color)" }}
                  />{" "}
                  Bold
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAINEL DIREITO: Preview ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "sticky",
            top: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setShowSafeZone(!showSafeZone)}
              className="btn"
              style={{
                fontSize: "0.7rem",
                padding: "6px 14px",
                background: showSafeZone
                  ? "rgba(99,102,241,0.1)"
                  : "transparent",
                border: "1px solid var(--surface-border)",
                color: showSafeZone
                  ? "var(--accent-color)"
                  : "var(--text-secondary)",
              }}
            >
              {showSafeZone ? "📐 Safe Zone ON" : "📐 Safe Zone OFF"}
            </button>
            <button
              onClick={() => setShowMockup(!showMockup)}
              className="btn"
              style={{
                fontSize: "0.7rem",
                padding: "6px 14px",
                background: showMockup ? "rgba(99,102,241,0.1)" : "transparent",
                border: "1px solid var(--surface-border)",
                color: showMockup
                  ? "var(--accent-color)"
                  : "var(--text-secondary)",
              }}
            >
              📱 Mockup
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              userSelect: "none",
            }}
          >
            {showMockup && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 5,
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: "14%",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "3px 6px",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #f09433, #bc1888)",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "5px",
                      fontWeight: 600,
                      lineHeight: "12px",
                    }}
                  >
                    leandrosof
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "4px",
                      lineHeight: "12px",
                    }}
                  >
                    2 h
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    height: "10%",
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "3px 6px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 6px",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "4px",
                      }}
                    >
                      Enviar mensagem...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              style={{
                width: `${W * PREVIEW_SCALE}px`,
                height: `${H * PREVIEW_SCALE}px`,
                borderRadius: "12px",
                border: "1px solid var(--surface-border)",
                cursor: dragging ? "grabbing" : "crosshair",
                background: "#000",
              }}
              onMouseDown={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const sx = W / rect.width;
                const sy = H / rect.height;
                const x = (e.clientX - rect.left) * sx;
                const y = (e.clientY - rect.top) * sy;
                const distTitulo = Math.hypot(x - titulo.x, y - titulo.y) / sx;
                const distCorpo = Math.hypot(x - corpo.x, y - corpo.y) / sx;
                if (distTitulo < 80 && titulo.text)
                  handleMouseDown(e, "titulo");
                else if (distCorpo < 80 && corpo.text)
                  handleMouseDown(e, "corpo");
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <canvas ref={downloadRef} style={{ display: "none" }} />
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            🖐️ Arraste os textos no preview para posicionar
          </p>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button onClick={baixar} disabled={!titulo.text && !corpo.text} style={{
              flex: 1, padding: "14px", borderRadius: "30px", border: "none",
              background: titulo.text || corpo.text ? "#22c55e" : "rgba(34,197,94,0.2)",
              color: titulo.text || corpo.text ? "#fff" : "rgba(255,255,255,0.4)",
              fontWeight: 800, fontSize: "1rem", cursor: titulo.text || corpo.text ? "pointer" : "default",
            }}>⬇ Baixar Story</button>
            <button onClick={compartilhar} disabled={!titulo.text && !corpo.text} style={{
              flex: 1, padding: "14px", borderRadius: "30px", border: "none",
              background: titulo.text || corpo.text ? "var(--accent-color)" : "rgba(99,102,241,0.2)",
              color: titulo.text || corpo.text ? "#fff" : "rgba(255,255,255,0.4)",
              fontWeight: 800, fontSize: "1rem", cursor: titulo.text || corpo.text ? "pointer" : "default",
            }}>📤 Compartilhar</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function layerBtn(active: boolean): React.CSSProperties {
  return {
    padding: "6px 16px",
    borderRadius: "14px",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
    border: active
      ? "1px solid var(--accent-color)"
      : "1px solid var(--surface-border)",
    background: active ? "rgba(99,102,241,0.1)" : "transparent",
    color: active ? "var(--accent-color)" : "var(--text-secondary)",
  };
}
