"use client";

import { useState, useCallback } from "react";

type Template = "livre" | "whatsapp" | "wifi" | "email" | "url";

export default function GeradorQRCode() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("000000");
  const [bgColor, setBgColor] = useState("ffffff");
  const [ecc, setEcc] = useState("M");
  const [margin, setMargin] = useState(10);
  const [template, setTemplate] = useState<Template>("livre");

  // Templates
  const applyTemplate = useCallback((t: Template) => {
    setTemplate(t);
    switch (t) {
      case "whatsapp":
        setText(""); setFgColor("25d366"); setBgColor("ffffff"); setMargin(4); break;
      case "wifi":
        setText("WIFI:S:MinhaRede;T:WPA;P:senha123;;"); setFgColor("000000"); setBgColor("ffffff"); setMargin(4); break;
      case "email":
        setText(""); setFgColor("ea4335"); setBgColor("ffffff"); setMargin(4); break;
      case "url":
        setFgColor("6366f1"); setBgColor("ffffff"); setMargin(4); break;
      case "livre":
        setFgColor("00ffcc"); setBgColor("0a0a0f"); setMargin(10); break;
    }
  }, []);

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text.trim())}&bgcolor=${bgColor}&color=${fgColor}&ecc=${ecc}&margin=${margin}&format=png`
    : "";

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de QR Code</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Gere QR Codes personalizados para links, WhatsApp, Wi-Fi e muito mais. Cores, tamanho e templates prontos.
      </p>

      {/* Quick Templates */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {([
          ["livre", "📝 Livre"],
          ["url", "🔗 Link"],
          ["whatsapp", "💬 WhatsApp"],
          ["wifi", "📶 Wi-Fi"],
          ["email", "✉️ Email"],
        ] as [Template, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => applyTemplate(key)}
            style={{
              padding: "6px 16px", borderRadius: "20px",
              border: template === key ? "1px solid var(--accent-color)" : "1px solid var(--surface-border)",
              background: template === key ? "rgba(99,102,241,0.12)" : "transparent",
              color: template === key ? "var(--accent-color)" : "var(--text-secondary)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
            }}
          >{label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>
              {template === "whatsapp" ? "Número (com DDD)" : template === "wifi" ? "Configuração Wi-Fi" : template === "email" ? "Endereço de email" : "Texto ou link"}
            </label>
            {template === "whatsapp" ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="55999999999" style={{ ...inputStyle, flex: 1 }}
                  onBlur={() => { const v = text.replace(/\D/g, ""); if (v) setText(`https://wa.me/${v}`); }} />
              </div>
            ) : template === "wifi" ? (
              <WifiForm onChange={setText} />
            ) : (
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={template === "email" ? "exemplo@email.com" : template === "url" ? "https://seusite.com" : "Digite o conteúdo..."} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={labelStyle}>Cor do QR</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="color" value={`#${fgColor}`} onChange={(e) => setFgColor(e.target.value.replace("#", ""))} style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, background: "none" }} />
                <input value={fgColor} onChange={(e) => setFgColor(e.target.value.replace("#", "").slice(0, 6))} style={{ ...inputStyle, flex: 1, fontSize: "0.8rem", padding: "8px", fontFamily: "monospace" }} maxLength={6} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Cor do fundo</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="color" value={`#${bgColor}`} onChange={(e) => setBgColor(e.target.value.replace("#", ""))} style={{ width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, background: "none" }} />
                <input value={bgColor} onChange={(e) => setBgColor(e.target.value.replace("#", "").slice(0, 6))} style={{ ...inputStyle, flex: 1, fontSize: "0.8rem", padding: "8px", fontFamily: "monospace" }} maxLength={6} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={labelStyle}>Tamanho: {size}px</label>
              <input type="range" min="100" max="600" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>
            <div>
              <label style={labelStyle}>Margem: {margin}</label>
              <input type="range" min="0" max="20" value={margin} onChange={(e) => setMargin(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-color)" }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Resistência a erros</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["L", "M", "Q", "H"] as const).map((level) => (
                <button key={level} onClick={() => setEcc(level)} style={{
                  flex: 1, padding: "8px", borderRadius: "12px",
                  border: ecc === level ? "1px solid var(--accent-color)" : "1px solid var(--surface-border)",
                  background: ecc === level ? "rgba(99,102,241,0.1)" : "transparent",
                  color: ecc === level ? "var(--accent-color)" : "var(--text-secondary)",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: "0.75rem" }}>{level === "L" ? "Baixa" : level === "M" ? "Média" : level === "Q" ? "Alta" : "Máxima"}</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{level === "L" ? "~7%" : level === "M" ? "~15%" : level === "Q" ? "~25%" : "~30%"}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          {qrUrl ? (
            <>
              <div style={{ background: `#${bgColor}`, padding: "1rem", borderRadius: "16px", border: bgColor === "ffffff" || bgColor === "fff" ? "1px solid var(--surface-border)" : "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code" style={{ display: "block", maxWidth: "100%", borderRadius: "8px" }} />
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
                <a href={qrUrl} download="qrcode.png" className="btn" style={{ background: "var(--accent-color)", color: "#fff", textDecoration: "none", fontSize: "0.85rem" }}>
                  ⬇ PNG ({size}px)
                </a>
                <a href={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text.trim())}&bgcolor=${bgColor}&color=${fgColor}&ecc=${ecc}&margin=${margin}&format=svg`} download="qrcode.svg" className="btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--surface-border)", color: "var(--text-color)", textDecoration: "none", fontSize: "0.85rem" }}>
                  ⬇ SVG
                </a>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", opacity: 1, transform: "none", width: "100%", minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Digite algo e o QR Code aparece aqui</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WifiForm({ onChange }: { onChange: (v: string) => void }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encType, setEncType] = useState("WPA");

  function update(ssidVal: string, passVal: string, encVal: string) {
    onChange(`WIFI:S:${ssidVal};T:${encVal};P:${passVal};;`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <input value={ssid} onChange={(e) => { setSsid(e.target.value); update(e.target.value, password, encType); }} placeholder="Nome da rede (SSID)" style={inputStyle} />
      <input value={password} onChange={(e) => { setPassword(e.target.value); update(ssid, e.target.value, encType); }} placeholder="Senha da rede" style={inputStyle} />
      <select value={encType} onChange={(e) => { setEncType(e.target.value); update(ssid, password, e.target.value); }} style={{ ...inputStyle, padding: "10px 12px" }}>
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="nopass">Sem senha</option>
      </select>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: "12px",
  border: "1px solid var(--surface-border)", background: "var(--card-bg)",
  color: "var(--text-color)", fontSize: "0.9rem", outline: "none",
  backdropFilter: "blur(10px)",
};

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: "0.4rem",
  fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)",
};
