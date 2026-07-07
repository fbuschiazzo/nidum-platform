import { Card } from "./ui";

type RentalUnit = {
  title: string;
  address: string;
  city: string;
  price: string;
  beds: string;
  size: string;
  availability: string;
};

export function RentalCard({ unit }: { unit: RentalUnit }) {
  return (
    <Card className="rental-card">
      <div className="property-visual" aria-hidden="true">
        <span />
      </div>
      <div>
        <div className="card-topline">
          <span>{unit.availability}</span>
          <small>{unit.city}</small>
        </div>
        <h3>{unit.title}</h3>
        <p>{unit.address}</p>
        <div className="metric-row compact">
          <span>
            <strong>{unit.price}</strong>
            mensual
          </span>
          <span>
            <strong>{unit.beds}</strong>
            distribucion
          </span>
          <span>
            <strong>{unit.size}</strong>
            superficie
          </span>
        </div>
      </div>
    </Card>
  );
}
