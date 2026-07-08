import Link from "next/link";
import { BeginnerInvestmentPlanner } from "@/components/beginner-investment-planner";
import { opportunities } from "@/components/platform-data";
import { OpportunityCard } from "@/components/opportunity-card";
import { LeadForm, PageShell, SectionHeader } from "@/components/ui";

export default function HomePage() {
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Empeza con USD 1.000</p>
          <h1>Inverti en propiedades reales y cobra renta sin comprar un apartamento entero.</h1>
          <p>
            Nidum esta pensado para personas que tienen algunos miles de dolares,
            quieren mover esa plata y necesitan entender cuanto podrian cobrar,
            que riesgo toman y como salir si necesitan liquidez.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="#simulador">
              Simular mi inversion
            </Link>
            <Link className="button button-dark" href="/oportunidades">
              Ver oportunidades
            </Link>
            <Link className="button button-light" href="/login">
              Crear perfil inversor
            </Link>
          </div>
          <div className="trust-row" aria-label="Indicadores de confianza">
            <span>Ves cuanto pones y cuanto podrias recibir.</span>
            <span>Entendes riesgos, plazos y salida antes de invertir.</span>
            <span>Seguimiento privado con documentos, renta y proximos pagos.</span>
          </div>
        </div>
        <div className="hero-panel" aria-label="Resumen de plataforma">
          <BeginnerInvestmentPlanner compact />
        </div>
      </section>

      <BeginnerInvestmentPlanner />

      <section className="section">
        <SectionHeader eyebrow="Elegir sin saber de inversiones" title="Oportunidades ordenadas para decidir mejor">
          No empezamos por tablas complejas. Cada oportunidad explica para quien es,
          cuando podrias cobrar, que puede salir mal y como pensarias una salida.
        </SectionHeader>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Como funciona" title="Invertir no deberia sentirse como saltar al vacio" />
        <div className="feature-grid">
          {[
            ["Simula", "Pones un monto y ves escenarios conservador, base y optimista."],
            ["Elegis", "Comparamos oportunidades segun renta, plazo, riesgo y salida."],
            ["Invertis", "Reservas participacion, completas datos y firmas desde el portal."],
            ["Cobra y segui", "Ves pagos, documentos, gastos, ocupacion y eventos relevantes."],
          ].map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section investor-trust-section">
        <SectionHeader eyebrow="Antes de poner plata" title="Lo que un inversor principiante necesita ver claro">
          Nidum muestra lo bueno y tambien lo incomodo: retornos no garantizados,
          vacancia, gastos, liquidez y documentos.
        </SectionHeader>
        <div className="trust-explainer-grid">
          {[
            ["Que compro", "Una participacion economica vinculada a un activo inmobiliario identificado."],
            ["Como cobro", "Rentas netas estimadas segun ocupacion, gastos, administracion y calendario."],
            ["Que riesgo tomo", "Vacancia, mantenimiento, cambios de precio y salida no inmediata."],
            ["Como salgo", "Publicando tu participacion en el mercado secundario cuando este habilitado."],
            ["Que cobra Nidum", "Fees de administracion visibles antes de confirmar una inversion."],
            ["Quien me ayuda", "Un asesor puede revisar tu perfil, dudas, documentos y horizonte."],
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
          <p className="eyebrow">Primer paso</p>
          <h2>Decinos cuanto queres invertir y te guiamos.</h2>
          <p>
            Si nunca invertiste, la prioridad es entender antes de transferir. Te
            mostramos oportunidades compatibles con tu monto, plazo y perfil de riesgo.
          </p>
        </div>
        <LeadForm context="investment" />
      </section>
    </PageShell>
  );
}
