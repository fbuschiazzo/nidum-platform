import Link from "next/link";
import { notFound } from "next/navigation";
import { InvestorActions } from "@/components/investor-actions";
import { InvestmentSimulator } from "@/components/investment-simulator";
import { opportunities, secondaryMarket } from "@/components/platform-data";
import { InvestorActionPanel, PageShell } from "@/components/ui";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = opportunities.find((item) => item.slug === slug);
  if (!opportunity) notFound();

  const listings = secondaryMarket.filter((listing) => listing.opportunitySlug === opportunity.slug);

  return (
    <PageShell>
      <section className="opportunity-hero">
        <div className="opportunity-hero-copy">
          <Link href="/oportunidades" className="back-link">Volver a oportunidades</Link>
          <p className="eyebrow">{opportunity.type}</p>
          <h1>{opportunity.title}</h1>
          <p>{opportunity.plainGoal}</p>
          <div className="detail-metrics">
            <span><strong>{opportunity.targetReturn}</strong> retorno objetivo</span>
            <span><strong>{opportunity.ticket}</strong> ticket minimo</span>
            <span><strong>{opportunity.totalValue}</strong> valor activo</span>
            <span><strong>{opportunity.liquidity}</strong> liquidez estimada</span>
          </div>
        </div>
        <img src={opportunity.image} alt={`Propiedad ${opportunity.title}`} className="detail-hero-image" />
      </section>

      <section className="section detail-layout">
        <article className="detail-main card">
          <p className="eyebrow">Tesis simple</p>
          <h2>Por que podria tener sentido</h2>
          <p>{opportunity.investorFit}</p>
          <ul className="clean-list">
            {opportunity.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        </article>
        <aside className="detail-side card">
          <h3>Linea de tiempo</h3>
          {opportunity.timeline.map(([stage, detail]) => (
            <div className="timeline-row" key={stage}>
              <strong>{stage}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="section">
        <InvestmentSimulator opportunity={opportunity} />
      </section>

      <section className="section">
        <InvestorActions opportunity={opportunity} />
      </section>

      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Participaciones en venta</p>
          <h2>Mercado secundario</h2>
          <p>Compra una parte de otro inversor o publica tu salida cuando quieras vender.</p>
        </div>
        <div className="secondary-grid">
          {listings.length ? listings.map((listing) => (
            <article className="card secondary-card" key={listing.id}>
              <span className="pill">{listing.status}</span>
              <h3>{listing.percentage}% de {listing.project}</h3>
              <p>Precio pedido: USD {listing.askingPrice.toLocaleString("en-US")}</p>
              <p>Renta mensual estimada: USD {listing.estimatedMonthly}</p>
              <Link className="button button-dark" href="#invertir">Ofertar</Link>
            </article>
          )) : (
            <InvestorActionPanel opportunity={opportunity} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
