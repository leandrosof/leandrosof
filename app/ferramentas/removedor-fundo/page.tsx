"use client";

import { useState, useRef, useCallback } from "react";
import { trackToolUsage } from "@/lib/analytics";

export default function RemovedorFundo() {
  const [original, setOriginal] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("sem-fundo.png");
  const fileRef = useRef<File | null>(null);
  const bgRemovalRef = useRef<{ removeBackground: (file: File, opts?: Record<string, unknown>) => Promise<Blob> } | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem (PNG, JPG, WebP).");
      return;
    }
    setError("");
    setProcessed(null);
    setProgress(0);
    fileRef.current = file;
    setFileName(file.name.replace(/\.[^.]+$/, "") + "-sem-fundo.png");
    const reader = new FileReader();
    reader.onload = (ev) => setOriginal(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const processar = useCallback(async () => {
    if (!fileRef.current) return;
    setLoading(true);
    setError("");
    setProgress(5);

    try {
      if (!bgRemovalRef.current) {
        trackToolUsage("removedor-fundo", "baixar_modelo");
        setProgress(10);
        const mod = await import("@imgly/background-removal");
        bgRemovalRef.current = mod;
        setModelLoaded(true);
      }
      setProgress(20);
      trackToolUsage("removedor-fundo", "processar");

      const blob = await bgRemovalRef.current.removeBackground(fileRef.current, {
        progress: (_key: string, current: number, total: number) => {
          const pct = 20 + Math.round((current / total) * 75);
          setProgress(Math.min(pct, 99));
        },
      });

      setProgress(100);

      const url = URL.createObjectURL(blob);
      setProcessed(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar imagem.";
      setError(msg.includes("model") || msg.includes("fetch") || msg.includes("network")
        ? "Erro ao baixar o modelo de IA. Verifique sua conexão e tente novamente."
        : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  function baixar() {
    if (!processed) return;
    const a = document.createElement("a");
    a.href = processed;
    a.download = fileName;
    a.click();
  }

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Removedor de Fundo de Imagem</h2>
      <p style={{ marginBottom: "1rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Remova o fundo de fotos automaticamente com IA. 100% no navegador, sem envio para servidores.
        Arraste ou clique para fazer upload.
      </p>
      <p style={{ marginBottom: "2rem", fontSize: "0.8rem", color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "0.8rem 1rem", borderRadius: "12px", maxWidth: "700px" }}>
        🧠 O modelo de IA será baixado na primeira execução (~10MB). As próximas vezes serão instantâneas.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div>
          <label
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.8rem", padding: "3rem 1rem", borderRadius: "16px", border: `2px dashed ${original ? "var(--surface-border)" : "var(--accent-color)"}`, cursor: "pointer", minHeight: "280px", background: original ? "transparent" : "var(--card-bg)", opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                fileRef.current = file;
                setFileName(file.name.replace(/\.[^.]+$/, "") + "-sem-fundo.png");
                const reader = new FileReader();
                reader.onload = (ev) => setOriginal(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          >
            {original ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={original} alt="Original" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", objectFit: "contain" }} />
            ) : (
              <>
                <span style={{ fontSize: "2.5rem" }}>🖼️</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Clique ou arraste uma imagem</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>PNG, JPG, WebP — até 20MB</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} id="file-upload" />
          </label>
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
            <label htmlFor="file-upload" style={{ flex: 1, padding: "0.8rem", borderRadius: "30px", border: "1px solid var(--surface-border)", textAlign: "center", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              Escolher imagem
            </label>
            <button onClick={processar} disabled={!original || loading} style={{ flex: 1, padding: "0.8rem", borderRadius: "30px", border: "none", background: original && !loading ? "var(--accent-color)" : "rgba(99,102,241,0.2)", color: original && !loading ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.85rem", cursor: original && !loading ? "pointer" : "default" }}>
              {loading ? `Processando ${progress}%` : "Remover Fundo"}
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
          {loading && !processed && (
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>⏳</span>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>{modelLoaded ? "Processando imagem..." : "Baixando modelo de IA..."}</p>
              <div style={{ height: "4px", borderRadius: "2px", background: "var(--surface-border)", marginTop: "1rem", overflow: "hidden", width: "200px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent-color)", borderRadius: "2px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}
          {processed ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%" }}>
              <div style={{
                background: "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 20px 20px",
                borderRadius: "12px", padding: "1rem", width: "100%", display: "flex", justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={processed} alt="Sem fundo" style={{ maxWidth: "100%", maxHeight: "350px", borderRadius: "8px" }} />
              </div>
              <button onClick={baixar} style={{ padding: "0.8rem 2rem", borderRadius: "30px", border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                ⬇ Baixar PNG
              </button>
            </div>
          ) : !loading && (
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>✨</span>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Resultado aparece aqui</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
