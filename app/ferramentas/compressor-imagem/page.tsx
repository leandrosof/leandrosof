"use client";

import { useState, useRef } from "react";

export default function CompressorImagem() {
  const [original, setOriginal] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [error, setError] = useState("");
  const fileRef = useRef<File | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Selecione uma imagem."); return; }
    setError("");
    setCompressed(null);
    setCompressedSize(0);
    setOriginalSize(file.size);
    fileRef.current = file;
    const r = new FileReader();
    r.onload = (ev) => setOriginal(ev.target?.result as string);
    r.readAsDataURL(file);
  }

  function compress() {
    if (!fileRef.current) return;
    setError("");
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setCompressedSize(blob.size);
        setCompressed(URL.createObjectURL(blob));
      }, `image/${format}`, quality / 100);
    };
    img.src = URL.createObjectURL(fileRef.current);
  }

  function fmtSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const reduction = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(0)
    : null;

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Compressor de Imagem</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Reduza o tamanho das suas imagens sem perder qualidade. Arraste ou clique para começar.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.8rem", padding: "3rem 1rem", borderRadius: "16px", border: `2px dashed ${original ? "var(--surface-border)" : "var(--accent-color)"}`, cursor: "pointer", minHeight: "220px", background: original ? "var(--card-bg)" : "transparent" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { fileRef.current = f; setOriginalSize(f.size); const r = new FileReader(); r.onload = (ev) => setOriginal(ev.target?.result as string); r.readAsDataURL(f); } }}>
            {original ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={original} alt="Original" style={{ maxWidth: "100%", maxHeight: "220px", borderRadius: "12px", objectFit: "contain" }} />
            ) : (
              <>
                <span style={{ fontSize: "2rem" }}>📷</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Clique ou arraste uma imagem</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} id="img-upload" />
          </label>
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
            <label htmlFor="img-upload" style={{ flex: 1, padding: "0.8rem", borderRadius: "30px", border: "1px solid var(--surface-border)", textAlign: "center", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>Escolher imagem</label>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card" style={{ opacity: 1, transform: "none" }}>
            <div className="flex flex-col gap-3" style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div>
                <label style={labelStyle}>Qualidade: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
              </div>
              <div>
                <label style={labelStyle}>Formato de saída</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["jpeg", "webp"] as const).map((f) => (
                    <button key={f} onClick={() => setFormat(f)} style={{
                      flex: 1, padding: "8px", borderRadius: "12px", textTransform: "uppercase",
                      border: format === f ? "1px solid var(--accent-color)" : "1px solid var(--surface-border)",
                      background: format === f ? "rgba(99,102,241,0.1)" : "transparent",
                      color: format === f ? "var(--accent-color)" : "var(--text-secondary)",
                      fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                    }}>{f === "jpeg" ? "JPEG" : "WebP"}</button>
                  ))}
                </div>
              </div>
              <button onClick={compress} disabled={!original} style={{ padding: "0.8rem", borderRadius: "30px", border: "none", background: original ? "var(--accent-color)" : "rgba(99,102,241,0.2)", color: original ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.9rem", cursor: original ? "pointer" : "default" }}>
                Comprimir
              </button>
            </div>
          </div>

          {compressed && (
            <div className="card" style={{ opacity: 1, transform: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                  <div><div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Original</div><div style={{ fontWeight: 900, fontSize: "1rem" }}>{fmtSize(originalSize)}</div></div>
                  <div><div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Comprimido</div><div style={{ fontWeight: 900, fontSize: "1rem", color: "#22c55e" }}>{fmtSize(compressedSize)}</div></div>
                </div>
                {reduction && (
                  <div style={{ textAlign: "center", padding: "0.5rem", background: "rgba(34,197,94,0.1)", borderRadius: "12px", color: "#22c55e", fontWeight: 800, fontSize: "1.1rem" }}>
                    {reduction}% menor
                  </div>
                )}
                <button onClick={() => { const a = document.createElement("a"); a.href = compressed!; a.download = `comprimido.${format}`; a.click(); }} style={{ padding: "0.8rem", borderRadius: "30px", border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                  ⬇ Baixar {format.toUpperCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.3rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" };
