"use client";

import { useState } from "react";
import type { Opportunity } from "./platform-data";

export function InvestorActions({ opportunity }: { opportunity: Opportunity }) {
  const [message, setMessage] = useState("");

  function fakeSubmit(action: string) {
    setMessage(`${action} registrada para demo. En produccion esto iria a aprobacion y firma.`);
  }

  return (
    <div className="investor-action-grid" id="invertir">
      <form className="action-panel">
        <p className="eyebrow">Invertir</p>
        <h3>Poner dinero en esta propiedad</h3>
        <label>
          Monto
          <input defaultValue="5000" inputMode="numeric" />
        </label>
        <label>
          Perfil
          <select defaultValue="renta">
            <option value="renta">Busco renta mensual</option>
            <option value="crecimiento">Busco valorizacion</option>
            <option value="mixto">Quiero balance</option>
          </select>
        </label>
        <button className="button button-dark" type="button" onClick={() => fakeSubmit("Reserva de inversion")}>
          Reservar participacion
        </button>
      </form>

      <form className="action-panel">
        <p className="eyebrow">Mercado secundario</p>
        <h3>Ofertar por un porcentaje</h3>
        <label>
          Porcentaje deseado
          <input defaultValue="1.0" inputMode="decimal" />
        </label>
        <label>
          Oferta
          <input defaultValue="1200" inputMode="numeric" />
        </label>
        <button className="button button-light" type="button" onClick={() => fakeSubmit("Oferta secundaria")}>
          Enviar oferta
        </button>
      </form>

      <form className="action-panel">
        <p className="eyebrow">Salida</p>
        <h3>Vender tu participacion</h3>
        <label>
          Proyecto
          <input defaultValue={opportunity.title} />
        </label>
        <label>
          % a vender
          <input defaultValue="1.5" inputMode="decimal" />
        </label>
        <button className="button button-light" type="button" onClick={() => fakeSubmit("Publicacion de venta")}>
          Publicar venta
        </button>
      </form>
      {message ? <p className="demo-message">{message}</p> : null}
    </div>
  );
}
