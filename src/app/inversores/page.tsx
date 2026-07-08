import { InvestorPreferences } from "@/components/investor-preferences";
import { InvestorDashboard } from "@/components/dashboard";
import { OpportunityCard } from "@/components/opportunity-card";
import { opportunities } from "@/components/platform-data";
import { InvestorActionPanel, LeadForm, PageShell, SectionHeader, VisualSimulator } from "@/components/ui";

export default function InvestorsPage() {
  return (
    <PageShell>
      <section className="portal-page">
        <InvestorDashboard />
      </section>
      <section className="section">
        <InvestorPreferences />
      </section>
      <section className="section">
        <SectionHeader eyebrow="Segun tu perfil" title="Oportunidades para comparar">
          Ajusta tus preferencias arriba y usa estas fichas para revisar detalle,
          riesgo, plazo, salida y retorno objetivo antes de reservar.
        </SectionHeader>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
      </section>
      <section className="section split-section">
        <VisualSimulator opportunity={opportunities[2]} />
        <InvestorActionPanel opportunity={opportunities[2]} />
      </section>
      <section className="section lead-band">
        <div>
          <p className="eyebrow">Solicitud de inversion</p>
          <h2>Reserva una participacion y el equipo valida el encuadre.</h2>
          <p>
            El MVP contempla flujos de reserva, validacion KYC, documentacion y pagos
            simulados. La pasarela real queda aislada para integrarse sin cambiar el
            modelo de negocio.
          </p>
        </div>
        <LeadForm context="investment" />
      </section>
    </PageShell>
  );
}
