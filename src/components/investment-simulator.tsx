"use client";

import { useMemo, useState } from "react";
import type { Opportunity } from "./platform-data";

export function InvestmentSimulator({ opportunity }: { opportunity: Opportunity }) {
  const [amount, setAmount] = useState(5000);

  const projection = useMemo(() => {
    const monthly = (amount / 1000) * opportunity.monthlyReturnPer1000;
    const yearly = monthly * 12;
    const fiveYear = yearly * 5;
    return { monthly, yearly, fiveYear };
  }, [amount, opportunity.monthlyReturnPer1000]);

  return (
    <div className="simulator-card" id="simulador">
      <div>
        <p className="eyebrow">Simulador</p>
        <h2>Cuanto podria retornarte mes a mes</h2>
        <p>
          Mueve el monto y mira una estimacion simple. No es promesa de retorno:
          sirve para entender ordenes de magnitud antes de leer la tesis completa.
        </p>
      </div>
      <div className="simulator-control">
        <label htmlFor="amount">Monto a invertir</label>
        <strong>USD {amount.toLocaleString("en-US")}</strong>
        <input
          id="amount"
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
        />
        <div className="quick-amounts">
          {[1000, 5000, 10000].map((value) => (
            <button key={value} type="button" onClick={() => setAmount(value)}>
              USD {value.toLocaleString("en-US")}
            </button>
          ))}
        </div>
      </div>
      <div className="projection-grid">
        <span>
          <strong>USD {projection.monthly.toFixed(0)}</strong>
          estimado mensual
        </span>
        <span>
          <strong>USD {projection.yearly.toFixed(0)}</strong>
          estimado anual
        </span>
        <span>
          <strong>USD {projection.fiveYear.toFixed(0)}</strong>
          horizonte 5 anos
        </span>
      </div>
    </div>
  );
}
