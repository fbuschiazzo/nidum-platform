import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "./platform-data";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Header() {
  const links = [
    { href: "/oportunidades", label: "Oportunidades" },
    { href: "/inversores", label: "Inversores" },
    { href: "/alquileres", label: "Alquileres" },
    { href: "/admin", label: "Admin" },
  ] as const;

  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label={`${brand.name} inicio`}>
        <span className="brand-mark">N</span>
        <span>
          <strong>{brand.name}</strong>
          <small>Real estate operating system</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="Principal">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link className="button button-dark" href="/inversores">
        Entrar
      </Link>
    </header>
  );
}

export function PageShell({ children }: CardProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: CardProps) {
  return <article className={`card ${className}`}>{children}</article>;
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </Card>
  );
}

export function LeadForm({ context }: { context: "investment" | "rental" }) {
  const isRental = context === "rental";

  return (
    <form className="lead-form">
      <label>
        Nombre
        <input name="name" placeholder="Tu nombre" />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="nombre@email.com" />
      </label>
      <label>
        {isRental ? "Zona de interes" : "Monto estimado"}
        <input
          name="intent"
          placeholder={isRental ? "Pocitos, Centro, Punta del Este" : "USD 500 - 25.000"}
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
    </form>
  );
}
