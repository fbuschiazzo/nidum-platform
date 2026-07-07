import Link from "next/link";
import { opportunities } from "@/components/platform-data";
import { OpportunityCard } from "@/components/opportunity-card";
import { InvestorActionPanel, LeadForm, PageShell, SectionHeader, VisualSimulator } from "@/components/ui";

export default function HomePage() {
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Nidum</p>
          <h1>Inverti en metros reales sin comprar una propiedad completa.</h1>
          <p>
            Plataforma de inversion inmobiliaria fraccionada para acceder a renta y
            plusvalia con tickets de USD 1.000 a 10.000, explicada para personas
            que no viven del real estate.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/oportunidades">
              Ver oportunidades
            </Link>
            <Link className="button button-light" href="/oportunidades#simulador">
              Simular ticket
            </Link>
          </div>
          <div className="trust-row" aria-label="Indicadores de confianza">
            <span>Sabes que activo compras y por que podria rendir.</span>
            <span>Ves renta, ocupacion, gastos y documentos en un solo lugar.</span>
            <span>Podes invertir, vender u ofertar sin aprender jerga financiera.</span>
          </div>
        </div>
        <div className="hero-panel" aria-label="Resumen de plataforma">
          <article className="card">
            <div className="card-topline">
              <span>En fondeo</span>
              <small>Proyecto residencial</small>
            </div>
            <h3>Cordel Pocitos</h3>
            <p>
              Vehiculo residencial orientado a renta mensual con administracion de
              inquilinos, mantenimiento y distribuciones automatizadas.
            </p>
            <div className="metric-row">
              <span>
                <strong>8.4%</strong>
                retorno objetivo
              </span>
              <span>
                <strong>USD 1.000</strong>
                ticket minimo
              </span>
            </div>
            <div className="progress-block">
              <div>
                <span>Fondeado</span>
                <strong>72%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: "72%" }} />
              </div>
            </div>
          </article>
          <article className="card">
            <p className="eyebrow">Proxima distribucion</p>
            <h3>USD 214 estimados</h3>
            <p>
              Panel inversor con flujo proyectado, documentos, eventos relevantes y
              estado de cada participacion.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Marketplace" title="Oportunidades de inversion">
          Cada ficha muestra en palabras simples que se compra, cual es el plazo,
          como se cobra y que alternativas hay si queres salir.
        </SectionHeader>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section className="section split-section">
        <VisualSimulator opportunity={opportunities[0]} />
        <InvestorActionPanel opportunity={opportunities[0]} />
      </section>

      <section className="section">
        <SectionHeader eyebrow="Como funciona" title="Una operacion simple, pero controlada" />
        <div className="feature-grid">
          {[
            ["Explora", "Compara proyectos por retorno, plazo, ubicacion y riesgo."],
            ["Invierte", "Reserva participaciones y completa KYC desde el portal."],
            ["Gestiona", "Accede a contratos, reportes, gastos y ocupacion."],
            ["Cobra", "Recibe distribuciones y seguimiento de performance."],
          ].map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section lead-band">
        <div>
          <p className="eyebrow">Primer contacto</p>
          <h2>Construimos confianza antes que volumen.</h2>
          <p>
            La experiencia prioriza claridad, trazabilidad y una mirada sobria del
            riesgo. Un asesor puede ayudarte a entender plazos, liquidez y estructura
            legal antes de invertir.
          </p>
        </div>
        <LeadForm context="investment" />
      </section>
    </PageShell>
  );
}
