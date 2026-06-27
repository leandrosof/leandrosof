"use client";

import { useState } from "react";

export default function CalculadoraFreelance() {
  const [monthlyGoal, setMonthlyGoal] = useState(8000);
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [vacationWeeks, setVacationWeeks] = useState(4);
  const [expenses, setExpenses] = useState(20);

  const workWeeks = 52 - vacationWeeks;
  const hoursPerMonth = (weeklyHours * workWeeks) / 12;
  const baseRate = monthlyGoal / hoursPerMonth;
  const withExpenses = baseRate / (1 - expenses / 100);
  const dailyRate = withExpenses * 8;
  const project40h = withExpenses * 40;
  const project80h = withExpenses * 80;
  const project160h = withExpenses * 160;

  return (
    <section style={{ paddingTop: "3rem", minHeight: "80vh" }}>
      <h2>Calculadora de Freelance</h2>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          maxWidth: "700px",
        }}
      >
        Descubra quanto cobrar por hora e por projeto para atingir sua meta
        mensal, já considerando impostos e custos operacionais.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <InputGroup
            label="Renda mensal desejada"
            value={monthlyGoal}
            onChange={setMonthlyGoal}
            prefix="R$"
            min={1000}
            max={50000}
            step={100}
          />
          <InputGroup
            label="Horas trabalhadas por semana"
            value={weeklyHours}
            onChange={setWeeklyHours}
            suffix="h"
            min={10}
            max={60}
            step={1}
          />
          <InputGroup
            label="Semanas de férias por ano"
            value={vacationWeeks}
            onChange={setVacationWeeks}
            suffix="sem"
            min={0}
            max={12}
            step={1}
          />
          <InputGroup
            label="Custos operacionais / impostos"
            value={expenses}
            onChange={setExpenses}
            suffix="%"
            min={0}
            max={70}
            step={1}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ResultCard label="Valor por hora" value={withExpenses} color="var(--primary-color)" />
          <ResultCard label="Valor por dia (8h)" value={dailyRate} color="var(--primary-color)" />
          <ResultCard label="Projeto 40h (1 semana)" value={project40h} color="var(--accent-color)" />
          <ResultCard label="Projeto 80h (2 semanas)" value={project80h} color="var(--accent-color)" />
          <ResultCard label="Projeto 160h (1 mês)" value={project160h} color="var(--accent-color)" />
        </div>
      </div>

      <div
        className="card tech-card"
        style={{ marginTop: "2rem", maxWidth: "600px" }}
      >
        <h3>Resumo</h3>
        <p>
          Com {weeklyHours}h/semana e {vacationWeeks} semanas de férias, você
          precisa cobrar <strong>R$ {withExpenses.toFixed(2)}/hora</strong> para
          atingir R$ {monthlyGoal.toLocaleString("pt-BR")} líquidos por mês,
          considerando {expenses}% de custos.
        </p>
      </div>
    </section>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontWeight: 600,
          fontSize: "0.9rem",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {prefix && (
          <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid var(--surface-border)",
            background: "var(--card-bg)",
            color: "var(--text-color)",
            fontSize: "1rem",
            outline: "none",
            backdropFilter: "blur(10px)",
          }}
        />
        {suffix && (
          <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="card tech-card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 1.5rem",
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{label}</span>
      <span
        style={{
          fontWeight: 800,
          fontSize: "1.2rem",
          color,
        }}
      >
        R$ {value.toFixed(2)}
      </span>
    </div>
  );
}
