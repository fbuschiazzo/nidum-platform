"use client";

import { useState } from "react";

export function LoginForm() {
  const [status, setStatus] = useState("");

  async function login() {
    setStatus("Validando...");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    });
    if (response.ok) {
      setStatus("Acceso correcto. Redirigiendo al portal inversor...");
      window.location.href = "/inversores";
      return;
    }
    setStatus("No se pudo iniciar sesion.");
  }

  return (
    <form className="login-card card">
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
      <button className="button button-dark" type="button" onClick={login}>Entrar</button>
      {status ? <p className="demo-message">{status}</p> : null}
    </form>
  );
}
