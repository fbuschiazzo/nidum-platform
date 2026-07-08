"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { opportunities } from "./platform-data";

const goals = [
  { value: "renta", label: "Quiero recibir renta" },
  { value: "balance", label: "Quiero algo balanceado" },
  { value: "retorno", label: "Busco mayor retorno" },
] as const;

const amounts = [1000, 3000, 5000, 10000] as const;

function pickOpportunity(goal: string) {
  if (goal === "retorno") return opportunities[2];
  if (goal === "balance") return opportunities[1];
  return opportunities[0];
}

export function BeginnerInvestmentPlanner({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState(3000);
  const [goal, setGoal] = useState<(typeof goals)[number]["value"]>("renta");

  const result = useMemo(() => {
    const opportunity = pickOpportunity(goal);
    const baseMonthly = (amount / 1000) * opportunity.monthlyReturnPer1000;
    return {
      opportunity,
      conservative: Math.round(baseMonthly * 0.72),
      base: Math.round(baseMonthly),
      optimistic: Math.round(baseMonthly * 1.18),
      yearly: Math.round(baseMonthly * 12),
    };
  }, [amount, goal]);

  return (
    <section className={`beginner-planner ${compact ? "beginner-planner-compact" : ""}`} id="simulador">
      <div>
        <p className="eyebrow">Simula antes de invertir</p>
        <h2>Si tenes algunos miles de dolares, mira que podria pasar.</h2>
        <p>
          Elegi un monto y un objetivo. Nidum te muestra una oportunidad sugerida,
          un flujo estimado y los riesgos principales en palabras simples.
        </p>
      </div>

      <div className="planner-controls">
        <label>
          Tengo para invertir
          <div className="amount-grid">
            {amounts.map((value) => (
              <button
                className={amount === value ? "selected" : ""}
                key={value}
                type="button"
                onClick={() => setAmount(value)}
              >
                USD {value.toLocaleString("en-US")}
              </button>
            ))}
          </div>
        </label>
        <label>
          Mi objetivo
          <select value={goal} onChange={(event) => setGoal(event.target.value as typeof goal)}>
            {goals.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="planner-result">
        <div className="recommendation-card">
          <span className="pill">{result.opportunity.beginnerLabel}</span>
          <h3>{result.opportunity.title}</h3>
          <p>{result.opportunity.bestFor}</p>
          <div className="mini-metrics">
            <span>
              <strong>USD {result.base}</strong>
              estimado mensual base
            </span>
            <span>
              <strong>USD {result.yearly}</strong>
              estimado anual
            </span>
          </div>
          <Link className="button button-dark" href={`/oportunidades/${result.opportunity.slug}`}>
            Ver oportunidad sugerida
          </Link>
        </div>
        <div className="scenario-card">
          <h3>Escenarios mensuales</h3>
          <div className="scenario-list">
            <span>
              Conservador
              <strong>USD {result.conservative}</strong>
            </span>
            <span>
              Base
              <strong>USD {result.base}</strong>
            </span>
            <span>
              Optimista
              <strong>USD {result.optimistic}</strong>
            </span>
          </div>
          <p>
            No es una promesa de retorno. Sirve para entender ordenes de magnitud
            antes de revisar documentos y riesgos.
          </p>
        </div>
      </div>
    </section>
  );
}
