import Link from "next/link";
import type { Opportunity } from "./platform-data";
import { Card } from "./ui";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="opportunity-card">
      <Link href={`/oportunidades/${opportunity.slug}`} className="opportunity-image-link">
        <img src={opportunity.image} alt={`Imagen de ${opportunity.title}`} className="opportunity-image" />
      </Link>
      <div className="card-topline">
        <span>{opportunity.beginnerLabel}</span>
        <small>{opportunity.location}</small>
      </div>
      <h3>{opportunity.title}</h3>
      <p className="plain-goal">{opportunity.plainGoal}</p>
      <p className="investor-fit">{opportunity.bestFor}</p>
      <p>{opportunity.summary}</p>
      <div className="metric-row">
        <span>
          <strong>{opportunity.targetReturn}</strong>
          retorno objetivo
        </span>
        <span>
          <strong>{opportunity.ticket}</strong>
          ticket minimo
        </span>
        <span>
          <strong>{opportunity.term}</strong>
          plazo
        </span>
      </div>
      <div className="risk-strip" aria-label="Resumen para inversor">
        <span>{opportunity.status}</span>
        <span>Riesgo {opportunity.risk}</span>
        <span>{opportunity.occupancy}</span>
        <span>{opportunity.nextPayout}</span>
      </div>
      <div className="plain-risk-box">
        <strong>Antes de invertir</strong>
        <p>{opportunity.simpleRisk}</p>
        <p>{opportunity.exitPlain}</p>
      </div>
      <div className="progress-block" aria-label={`Fondeado ${opportunity.funded}%`}>
        <div>
          <span>Fondeado</span>
          <strong>{opportunity.funded}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${opportunity.funded}%` }} />
        </div>
      </div>
      <div className="card-actions">
        <Link className="button button-dark" href={`/oportunidades/${opportunity.slug}`}>
          Ver detalle
        </Link>
        <Link className="button button-light" href={`/oportunidades/${opportunity.slug}#invertir`}>
          Invertir
        </Link>
      </div>
    </Card>
  );
}
