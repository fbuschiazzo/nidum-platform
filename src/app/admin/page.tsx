import { AdminDashboard } from "@/components/dashboard";
import { LeadForm, PageShell, SectionHeader } from "@/components/ui";

export default function AdminPage() {
  return (
    <PageShell>
      <section className="portal-page">
        <AdminDashboard />
      </section>
      <section className="section">
        <SectionHeader eyebrow="Arquitectura operacional" title="Modulos del backoffice" />
        <div className="feature-grid">
          {[
            ["Originacion", "Alta de propiedades, tasaciones, documentos y comite."],
            ["Fondeo", "Rondas, tickets minimos, reservas, pagos y participaciones."],
            ["Alquileres", "Leads, visitas, contratos, vacancia y mantenimiento."],
            ["Reportes", "Distribuciones, gastos, documentos fiscales y performance."],
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
          <p className="eyebrow">Alta rapida</p>
          <h2>Crear una nueva oportunidad desde backoffice.</h2>
          <p>
            Este formulario representa el flujo interno de originacion; la API y el
            schema ya contemplan propiedades, unidades, oportunidades y documentos.
          </p>
        </div>
        <LeadForm context="investment" />
      </section>
    </PageShell>
  );
}
