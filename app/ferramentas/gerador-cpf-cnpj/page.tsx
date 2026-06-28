"use client";

import { useState, useCallback } from "react";

function gerarCPF(): string {
  const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  nums.push(calcDigito(nums, 10));
  nums.push(calcDigito(nums, 11));
  const cpf = nums.join("");
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}

function gerarCNPJ(): string {
  const nums = [1, 0, 0, 0].concat(Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)));
  nums.push(calcDigitoCNPJ(nums));
  nums.push(calcDigitoCNPJ(nums));
  const cnpj = nums.join("");
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

function calcDigito(nums: number[], fator: number): number {
  let soma = 0;
  for (let i = 0; i < nums.length; i++) soma += nums[i] * (fator - i);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function calcDigitoCNPJ(nums: number[]): number {
  const pesos = nums.length === 12
    ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < nums.length; i++) soma += nums[i] * pesos[i];
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export default function GeradorCPFCNPJ() {
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [copiedCpf, setCopiedCpf] = useState(false);
  const [copiedCnpj, setCopiedCnpj] = useState(false);
  const [ponto, setPonto] = useState(true);

  const gerar = useCallback(() => {
    let c = gerarCPF();
    let j = gerarCNPJ();
    if (!ponto) { c = c.replace(/\D/g, ""); j = j.replace(/\D/g, ""); }
    setCpf(c);
    setCnpj(j);
    setCopiedCpf(false);
    setCopiedCnpj(false);
  }, [ponto]);

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Gerador de CPF e CNPJ Válido</h2>
      <p style={{ marginBottom: "1rem", fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "700px" }}>
        Gere CPF e CNPJ com dígitos verificadores válidos para testes de software. Uso exclusivo para desenvolvimento.
      </p>
      <p style={{ marginBottom: "2rem", fontSize: "0.8rem", color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "0.8rem 1rem", borderRadius: "12px", maxWidth: "700px" }}>
        ⚠️ Estes números são fictícios e passam na validação matemática. Não correspondem a pessoas ou empresas reais.
      </p>

      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <Check label="Com pontuação" checked={ponto} onChange={setPonto} />
        <button onClick={gerar} style={{ padding: "12px 28px", borderRadius: "30px", border: "none", background: "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
          Gerar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="card" style={{ padding: "1.5rem", textAlign: "center", opacity: 1, transform: "none" }}>
          <h3 style={{ marginTop: 0, fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>CPF</h3>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "monospace", letterSpacing: "1px", margin: "1rem 0", color: cpf ? "var(--accent-color)" : "var(--text-secondary)", minHeight: "2.5rem" }}>
            {cpf || "---.---.---.--"}
          </div>
          <button onClick={() => { if (cpf) { navigator.clipboard.writeText(cpf); setCopiedCpf(true); setTimeout(() => setCopiedCpf(false), 2000); } }}
            style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: copiedCpf ? "#22c55e" : "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", opacity: cpf ? 1 : 0.4 }}>
            {copiedCpf ? "Copiado!" : "Copiar CPF"}
          </button>
        </div>

        <div className="card" style={{ padding: "1.5rem", textAlign: "center", opacity: 1, transform: "none" }}>
          <h3 style={{ marginTop: 0, fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>CNPJ</h3>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "monospace", letterSpacing: "1px", margin: "1rem 0", color: cnpj ? "var(--accent-color)" : "var(--text-secondary)", minHeight: "2.5rem" }}>
            {cnpj || "--.---.---/----.--"}
          </div>
          <button onClick={() => { if (cnpj) { navigator.clipboard.writeText(cnpj); setCopiedCnpj(true); setTimeout(() => setCopiedCnpj(false), 2000); } }}
            style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: copiedCnpj ? "#22c55e" : "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", opacity: cnpj ? 1 : 0.4 }}>
            {copiedCnpj ? "Copiado!" : "Copiar CNPJ"}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem", padding: "1.5rem", maxWidth: "700px", opacity: 1, transform: "none" }}>
        <h3 style={{ marginTop: 0 }}>Gere em lote</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>Selecione o tipo e a quantidade:</p>
        <GenLote />
      </div>
    </section>
  );
}

function GenLote() {
  const [qtd, setQtd] = useState(10);
  const [tipo, setTipo] = useState<"cpf" | "cnpj">("cpf");
  const [lista, setLista] = useState<string[]>([]);
  const [ponto, setPonto] = useState(true);

  function gerarLote() {
    const arr: string[] = [];
    for (let i = 0; i < qtd; i++) {
      let val = tipo === "cpf" ? gerarCPF() : gerarCNPJ();
      if (!ponto) val = val.replace(/\D/g, "");
      arr.push(val);
    }
    setLista(arr);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as "cpf" | "cnpj")} style={{ padding: "8px 14px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.85rem", outline: "none" }}>
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
        </select>
        <input type="number" value={qtd} onChange={(e) => setQtd(Math.min(100, Math.max(1, Number(e.target.value))))} min={1} max={100} style={{ width: "70px", padding: "8px", borderRadius: "12px", border: "1px solid var(--surface-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.85rem", outline: "none" }} />
        <Check label="Pontuação" checked={ponto} onChange={setPonto} />
        <button onClick={gerarLote} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", background: "var(--accent-color)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Gerar</button>
        {lista.length > 0 && (
          <button onClick={() => { navigator.clipboard.writeText(lista.join("\n")); }} style={{ padding: "8px 18px", borderRadius: "20px", border: "1px solid var(--surface-border)", background: "transparent", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Copiar tudo</button>
        )}
      </div>
      {lista.length > 0 && (
        <div style={{ fontFamily: "monospace", fontSize: "0.8rem", maxHeight: "200px", overflowY: "auto", background: "var(--card-bg)", borderRadius: "12px", padding: "1rem", color: "var(--text-secondary)", lineHeight: "1.8" }}>
          {lista.map((item, i) => <div key={i}>{item}</div>)}
        </div>
      )}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "var(--accent-color)", cursor: "pointer" }} />
      <label style={{ fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => onChange(!checked)}>{label}</label>
    </div>
  );
}
