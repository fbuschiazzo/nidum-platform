import { RentalCard } from "@/components/rental-card";
import { rentalUnits } from "@/components/platform-data";
import { LeadForm, PageShell, SectionHeader } from "@/components/ui";

export default function RentalsPage() {
  return (
    <PageShell>
      <section className="portal-page">
        <SectionHeader eyebrow="Portal de alquileres" title="Unidades administradas por Nidum">
          Catalogo para clientes finales, con solicitudes de visita y datos que alimentan
          la ocupacion de los activos de inversion.
        </SectionHeader>
        <div className="rental-grid">
          {rentalUnits.map((unit) => (
            <RentalCard key={`${unit.address}-${unit.title}`} unit={unit} />
          ))}
        </div>
      </section>
      <section className="section lead-band">
        <div>
          <p className="eyebrow">Postulacion</p>
          <h2>Solicita visita o reserva una unidad.</h2>
          <p>
            El formulario captura datos iniciales para scoring, garantias, agenda de
            visita y seguimiento comercial.
          </p>
        </div>
        <LeadForm context="rental" />
      </section>
    </PageShell>
  );
}
