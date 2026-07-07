import { InvestorDashboard } from "@/components/dashboard";
import { OpportunityCard } from "@/components/opportunity-card";
import { opportunities } from "@/components/platform-data";
import { LeadForm, PageShell, SectionHeader } from "@/components/ui";

export default function InvestorsPage() {
  return (
    <PageShell>
      <section className="portal-page">
        <InvestorDashboard />
      </section>
      <section className="section">
        <SectionHeader eyebrow="Nuevas rondas" title="Invertir en unidades">
          Reservas de participacion con KYC, origen de fondos y trazabilidad documental.
        </SectionHeader>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
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
