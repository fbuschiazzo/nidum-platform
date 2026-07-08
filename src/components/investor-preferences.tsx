"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { opportunities } from "./platform-data";

const riskOptions = [
  { value: "bajo", label: "Prefiero estabilidad" },
  { value: "medio", label: "Acepto algo de variacion" },
  { value: "alto", label: "Busco mayor retorno" },
] as const;

const horizonOptions = [
  { value: "12", label: "Quiero poder salir pronto" },
  { value: "36", label: "Puedo esperar 2 a 3 anos" },
  { value: "48", label: "Puedo dejarlo mas tiempo" },
] as const;

function recommendedIndex(risk: string, horizon: string, amount: number) {
  if (risk === "alto" && amount >= 2500) return 2;
  if (horizon === "48" || risk === "medio") return 1;
  return 0;
}

export function InvestorPreferences() {
  const [amount, setAmount] = useState(3000);
  const [risk, setRisk] = useState<(typeof riskOptions)[number]["value"]>("bajo");
  const [horizon, setHorizon] = useState<(typeof horizonOptions)[number]["value"]>("36");

  const recommendation = useMemo(() => {
    const main = opportunities[recommendedIndex(risk, horizon, amount)];
    const alternatives = opportunities.filter((item) => item.slug !== main.slug);
    const estimated = Math.round((amount / 1000) * main.monthlyReturnPer1000);
    return { main, alternatives, estimated };
  }, [amount, risk, horizon]);

  return (
    <section className="preference-panel">
      <div className="preference-copy">
        <p className="eyebrow">Para vos</p>
        <h2>Contanos como pensas tu plata y ordenamos oportunidades.</h2>
        <p>
          Si estas empezando, no tenes que elegir mirando solo porcentajes. Nidum
          cruza monto, plazo y tolerancia al riesgo para explicar que alternativa
          parece mas razonable.
        </p>
      </div>

      <div className="preference-form card">
        <label>
          Monto inicial
          <input
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value || 0))}
          />
        </label>
        <label>
          Riesgo
          <select value={risk} onChange={(event) => setRisk(event.target.value as typeof risk)}>
            {riskOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Plazo
          <select value={horizon} onChange={(event) => setHorizon(event.target.value as typeof horizon)}>
            {horizonOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <article className="recommendation-detail card">
        <span className="pill">Recomendacion principal</span>
        <h3>{recommendation.main.title}</h3>
        <p>{recommendation.main.bestFor}</p>
        <div className="mini-metrics">
          <span>
            <strong>USD {recommendation.estimated}</strong>
            renta mensual estimada
          </span>
          <span>
            <strong>{recommendation.main.targetReturn}</strong>
            retorno objetivo
          </span>
          <span>
            <strong>{recommendation.main.term}</strong>
            plazo sugerido
          </span>
        </div>
        <div className="plain-explainer">
          <strong>Por que encaja:</strong>
          <p>
            Monto de entrada compatible, riesgo {recommendation.main.risk.toLowerCase()} y
            una tesis que podes seguir desde el portal sin conocer jerga inmobiliaria.
          </p>
        </div>
        <div className="plain-explainer">
          <strong>Que mirar antes de invertir:</strong>
          <p>{recommendation.main.simpleRisk} {recommendation.main.exitPlain}</p>
        </div>
        <Link className="button button-dark" href={`/oportunidades/${recommendation.main.slug}`}>
          Revisar detalle
        </Link>
      </article>
    </section>
  );
}
