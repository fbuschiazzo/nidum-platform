"use client";

import { FormEvent, useState } from "react";

export function LeadForm({ context }: { context: "investment" | "rental" }) {
  const isRental = context === "rental";
  const [status, setStatus] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Registrando solicitud...");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        propertyId: "cordel-pocitos",
        message: `${formData.get("intent") ?? ""}\n${formData.get("message") ?? ""}`.trim(),
      }),
    });

    if (response.ok) {
      event.currentTarget.reset();
      setStatus(isRental ? "Solicitud de visita registrada." : "Solicitud enviada a un asesor.");
      return;
    }

    setStatus("No se pudo registrar. Revisa los datos e intenta de nuevo.");
  }

  return (
    <form className="lead-form" onSubmit={submitLead}>
      <label>
        Nombre
        <input name="name" placeholder="Tu nombre" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="nombre@email.com" required />
      </label>
      <label>
        {isRental ? "Zona de interes" : "Monto estimado"}
        <input
          name="intent"
          placeholder={isRental ? "Pocitos, Centro, Punta del Este" : "USD 1.000 - 10.000"}
        />
      </label>
      <label>
        Comentarios
        <textarea
          name="message"
          rows={4}
          placeholder={isRental ? "Fecha de mudanza, garantia, ocupantes" : "Objetivo, plazo y perfil de riesgo"}
        />
      </label>
      <button className="button button-dark" type="submit">
        {isRental ? "Solicitar visita" : "Hablar con un asesor"}
      </button>
      {status ? <p className="demo-message">{status}</p> : null}
    </form>
  );
}
