"use client";

import { FormEvent, useState } from "react";
import type { Opportunity } from "./platform-data";

export function InvestorActions({ opportunity }: { opportunity: Opportunity }) {
  const [message, setMessage] = useState("");

  async function postAction(endpoint: string, payload: Record<string, unknown>, success: string) {
    setMessage("Procesando...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setMessage(success);
      return;
    }

    const error = await response.json().catch(() => ({ error: "No se pudo completar la accion." }));
    setMessage(error.error ?? "No se pudo completar la accion.");
  }

  async function invest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await postAction(
      "/api/investments",
      {
        userId: "demo-admin",
        opportunityId: opportunity.slug,
        amount: Number(formData.get("amount")),
        simulatePayment: true,
      },
      "Reserva de inversion registrada. Queda pendiente de KYC, firma y conciliacion."
    );
  }

  async function offer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await postAction(
      "/api/participation-offers",
      {
        listingId: `sec-${opportunity.slug === "cordel-pocitos" ? "cordel-01" : "costa-02"}`,
        buyerId: "demo-admin",
        percentage: Number(formData.get("percentage")),
        amount: Number(formData.get("amount")),
        message: `Oferta sobre ${opportunity.title}`,
      },
      "Oferta secundaria registrada. El vendedor puede aceptarla o contraofertar."
    );
  }

  async function sell(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const percentage = Number(formData.get("percentage"));
    await postAction(
      "/api/participation-listings",
      {
        investmentId: `demo-investment-${opportunity.slug}`,
        sellerId: "demo-admin",
        percentage,
        shares: Math.max(1, Math.round(percentage * 10)),
        askingPrice: Number(formData.get("askingPrice")),
      },
      "Participacion publicada en el mercado secundario."
    );
  }

  return (
    <div className="investor-action-grid" id="invertir">
      <form className="action-panel" onSubmit={invest}>
        <p className="eyebrow">Invertir</p>
        <h3>Poner dinero en esta propiedad</h3>
        <label>
          Monto
          <input name="amount" defaultValue="5000" inputMode="numeric" />
        </label>
        <label>
          Perfil
          <select defaultValue="renta">
            <option value="renta">Busco renta mensual</option>
            <option value="crecimiento">Busco valorizacion</option>
            <option value="mixto">Quiero balance</option>
          </select>
        </label>
        <button className="button button-dark" type="submit">
          Reservar participacion
        </button>
      </form>

      <form className="action-panel" onSubmit={offer}>
        <p className="eyebrow">Mercado secundario</p>
        <h3>Ofertar por un porcentaje</h3>
        <label>
          Porcentaje deseado
          <input name="percentage" defaultValue="1.0" inputMode="decimal" />
        </label>
        <label>
          Oferta
          <input name="amount" defaultValue="1200" inputMode="numeric" />
        </label>
        <button className="button button-light" type="submit">
          Enviar oferta
        </button>
      </form>

      <form className="action-panel" onSubmit={sell}>
        <p className="eyebrow">Salida</p>
        <h3>Vender tu participacion</h3>
        <label>
          Proyecto
          <input defaultValue={opportunity.title} />
        </label>
        <label>
          % a vender
          <input name="percentage" defaultValue="1.5" inputMode="decimal" />
        </label>
        <label>
          Precio pedido
          <input name="askingPrice" defaultValue="1850" inputMode="numeric" />
        </label>
        <button className="button button-light" type="submit">
          Publicar venta
        </button>
      </form>
      {message ? <p className="demo-message">{message}</p> : null}
    </div>
  );
}
