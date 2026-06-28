"use client";

import { useState, useEffect, useRef } from "react";
import { trackToolUsage } from "@/lib/analytics";

const MOEDAS = [
  "BRL", "USD", "EUR", "GBP", "JPY", "CNY", "ARS", "BTC", "ETH",
  "CAD", "AUD", "CHF", "MXN", "KRW", "INR", "RUB", "ZAR", "TRY",
];

type Rates = Record<string, number>;

export default function ConversorMoedas() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BRL");
  const [amount, setAmount] = useState("1");
  const [lastUpdate, setLastUpdate] = useState("");
  const trackedRef = useRef(false);

  useEffect(() => {
    fetch("/api/cotacoes")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setRates(data.rates);
        setLastUpdate(new Date(data.updated).toLocaleString("pt-BR"));
        setLoading(false);
        if (!trackedRef.current) {
          trackedRef.current = true;
          trackToolUsage("conversor-moedas", "converter");
        }
      })
      .catch(() => { setError("Erro ao carregar cotações. Tente novamente."); setLoading(false); });
  }, []);

  const convert = () => {
    if (!rates) return 0;
    const val = parseFloat(amount || "0");
    if (!val) return 0;
    const inUsd = val / (rates[from] || 1);
    return inUsd * (rates[to] || 1);
  };

  const result = convert();
  const fmt = (v: number | undefined) => {
    if (v === undefined || v === null || isNaN(v)) return "0";
    if (v >= 100) return v.toFixed(2);
    if (v >= 1) return v.toFixed(4);
    return v.toFixed(6);
  };

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Conversor de Moedas</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Converta entre 160+ moedas com cotação em tempo real. Inclui criptomoedas (BTC, ETH).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
        <div className="card" style={{ opacity: 1, transform: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>Valor</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1" style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.5rem", alignItems: "end" }}>
              <div>
                <label style={lbl}>De</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} style={sel}>
                  {MOEDAS.map((m) => <option key={m} value={m}>{flag(m)} {m} — {nomeMoeda(m)}</option>)}
                </select>
              </div>
              <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }} style={{ padding: "8px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontWeight: 700, fontSize: "1.2rem", cursor: "pointer", marginBottom: "2px" }}>⇄</button>
              <div>
                <label style={lbl}>Para</label>
                <select value={to} onChange={(e) => setTo(e.target.value)} style={sel}>
                  {MOEDAS.map((m) => <option key={m} value={m}>{flag(m)} {m} — {nomeMoeda(m)}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ opacity: 1, transform: "none", textAlign: "center" }}>
          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Carregando cotações...</p>
          ) : error ? (
            <p style={{ color: "#ef4444" }}>{error}</p>
          ) : (
            <>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{flag(from)} {amount || "0"} {from} =</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#22c55e", wordBreak: "break-all" }}>{flag(to)} {fmt(result)} {to}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                1 {from} = {fmt((rates?.[to] || 0) / (rates?.[from] || 1))} {to}
              </div>
              {lastUpdate && <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginTop: "1rem" }}>Atualizado: {lastUpdate}</div>}
            </>
          )}
        </div>
      </div>

      {/* Tabela rápida */}
      {rates && (
        <div className="card" style={{ marginTop: "2rem", opacity: 1, transform: "none" }}>
          <h3 style={{ marginTop: 0, fontSize: "0.85rem", marginBottom: "1rem" }}>💱 Cotações rápidas (base USD)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
            {MOEDAS.filter((m) => m !== "USD").slice(0, 12).map((m) => (
              <div key={m} style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>{flag(m)} {m}</span>
                <span style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{fmt(rates[m])}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function flag(code: string) {
  const flags: Record<string, string> = { BRL: "🇧🇷", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CNY: "🇨🇳", ARS: "🇦🇷", BTC: "🪙", ETH: "💎", CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭", MXN: "🇲🇽", KRW: "🇰🇷", INR: "🇮🇳", RUB: "🇷🇺", ZAR: "🇿🇦", TRY: "🇹🇷" };
  return flags[code] || "🌐";
}

function nomeMoeda(code: string) {
  const nomes: Record<string, string> = { BRL: "Real", USD: "Dólar", EUR: "Euro", GBP: "Libra", JPY: "Iene", CNY: "Yuan", ARS: "Peso AR", BTC: "Bitcoin", ETH: "Ethereum", CAD: "Dólar CA", AUD: "Dólar AU", CHF: "Franco", MXN: "Peso MX", KRW: "Won", INR: "Rúpia", RUB: "Rublo", ZAR: "Rand", TRY: "Lira" };
  return nomes[code] || "";
}

const inp: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1.2rem", outline: "none", backdropFilter: "blur(10px)", fontWeight: 700 };
const sel: React.CSSProperties = { width: "100%", padding: "10px 8px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.8rem", outline: "none", cursor: "pointer" };
const lbl: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" };
