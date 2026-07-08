"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [status, setStatus] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Validando...");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });
    if (response.ok) {
      setStatus("Acceso correcto. Redirigiendo al portal inversor...");
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") ? next : "/inversores";
      return;
    }
    setStatus("No se pudo iniciar sesion.");
  }

  return (
    <form className="login-card card" onSubmit={login}>
      <p className="eyebrow">Acceso demo</p>
      <h1>Entrar al portal</h1>
      <p>Usuario inicial para demo: <strong>admin</strong> / <strong>admin</strong>.</p>
      <label>
        Usuario
        <input name="username" defaultValue="admin" />
      </label>
      <label>
        Password
        <input name="password" type="password" defaultValue="admin" />
      </label>
      <button className="button button-dark" type="submit">Entrar</button>
      {status ? <p className="demo-message">{status}</p> : null}
    </form>
  );
}
