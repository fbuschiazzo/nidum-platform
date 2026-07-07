import { Card } from "./ui";

type Opportunity = {
  title: string;
  location: string;
  type: string;
  targetReturn: string;
  funded: number;
  ticket: string;
  term: string;
  status: string;
  summary: string;
};

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="opportunity-card">
      <div className="card-topline">
        <span>{opportunity.status}</span>
        <small>{opportunity.location}</small>
      </div>
      <h3>{opportunity.title}</h3>
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
      <div className="progress-block" aria-label={`Fondeado ${opportunity.funded}%`}>
        <div>
          <span>Fondeado</span>
          <strong>{opportunity.funded}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${opportunity.funded}%` }} />
        </div>
      </div>
    </Card>
  );
}
