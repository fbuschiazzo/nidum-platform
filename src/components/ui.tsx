import Link from "next/link";
import type { ReactNode } from "react";
import { brand, simulatorTickets, type Opportunity } from "./platform-data";

export { LeadForm } from "./lead-form";

type CardProps = {
  children: ReactNode;
  className?: string;
  id?: string;
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
      <Link className="button button-dark" href="/login">
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

export function Card({ children, className = "", id }: CardProps) {
  return (
    <article className={`card ${className}`} id={id}>
      {children}
    </article>
  );
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

export function VisualSimulator({ opportunity }: { opportunity?: Opportunity }) {
  const target = opportunity?.targetReturn ?? "8.4%";
  const annualRate = Number.parseFloat(target) / 100;

  return (
    <section className="simulator-card" aria-label="Simulador visual de inversion">
      <div>
        <p className="eyebrow">Simulador visual</p>
        <h3>Proba un ticket antes de hablar con un asesor</h3>
        <p>
          Los valores son estimativos y sirven para entender ordenes de magnitud,
          no como promesa de rendimiento.
        </p>
      </div>
      <div className="ticket-ladder">
        {simulatorTickets.map((ticket) => {
          const yearly = Math.round(ticket * annualRate);
          const quarterly = Math.round(yearly / 4);

          return (
            <div className="ticket-option" key={ticket}>
              <span>Ticket</span>
              <strong>USD {ticket.toLocaleString("en-US")}</strong>
              <div className="ticket-bar">
                <span style={{ width: `${Math.min(100, ticket / 100)}%` }} />
              </div>
              <small>Renta objetivo aprox. USD {quarterly} por trimestre</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function InvestorActionPanel({ opportunity }: { opportunity?: Opportunity }) {
  return (
    <Card className="action-panel" id="invertir">
      <p className="eyebrow">Acciones</p>
      <h3>{opportunity ? `Operar ${opportunity.title}` : "Opera tus participaciones"}</h3>
      <p>
        Inverti en una ronda abierta, publica una venta secundaria o deja una oferta
        cuando quieras entrar sin esperar nuevos cupos.
      </p>
      <div className="action-grid">
        <Link className="button button-dark" href="/inversores">
          Invertir
        </Link>
        <Link className="button button-light" href="/inversores#vender">
          Vender
        </Link>
        <Link className="button button-light" href="/inversores#ofertar">
          Ofertar
        </Link>
      </div>
    </Card>
  );
}
