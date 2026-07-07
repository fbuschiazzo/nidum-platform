import { opportunities } from "@/components/platform-data";
import { OpportunityCard } from "@/components/opportunity-card";
import { InvestorActionPanel, LeadForm, PageShell, SectionHeader, VisualSimulator } from "@/components/ui";

export default function OpportunitiesPage() {
  return (
    <PageShell>
      <section className="section">
        <SectionHeader eyebrow="Marketplace" title="Oportunidades de inversion">
          Seleccion curada de activos con explicacion simple, ticket minimo,
          liquidez esperada y acciones para invertir, vender u ofertar.
        </SectionHeader>
        <div className="opportunity-grid">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.title} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section className="section split-section" id="simulador">
        <VisualSimulator opportunity={opportunities[0]} />
        <InvestorActionPanel />
      </section>

      <section className="section lead-band">
        <div>
          <p className="eyebrow">Primer contacto</p>
          <h2>Recibi una tesis completa antes de reservar.</h2>
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
