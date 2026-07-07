import { adminMetrics, investorPortfolio, opportunities } from "./platform-data";
import { OpportunityCard } from "./opportunity-card";
import { Card, SectionHeader, StatCard } from "./ui";

export function InvestorDashboard() {
  return (
    <section className="dashboard-layout">
      <div className="dashboard-main">
        <SectionHeader eyebrow="Portal inversor" title="Panel de posicion consolidada">
          Seguimiento de aportes, rentas, documentos y distribuciones por proyecto.
        </SectionHeader>
        <div className="stats-grid">
          {investorPortfolio.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} detail={item.delta} />
          ))}
        </div>
        <Card className="table-card">
          <div className="table-header">
            <h3>Flujo de caja proyectado</h3>
            <span>Actualizado 7 jul 2026</span>
          </div>
          <div className="cashflow-list">
            {["Julio", "Agosto", "Septiembre", "Octubre"].map((month, index) => (
              <div key={month}>
                <span>{month}</span>
                <strong>USD {[214, 238, 226, 251][index]}</strong>
                <small>{["Confirmado", "Estimado", "Estimado", "Estimado"][index]}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <aside className="dashboard-side">
        <Card>
          <h3>Acciones pendientes</h3>
          <ul className="clean-list">
            <li>Firmar anexo de Costa Serena</li>
            <li>Actualizar constancia fiscal</li>
            <li>Revisar distribucion trimestral</li>
          </ul>
        </Card>
        <Card>
          <h3>Oportunidades sugeridas</h3>
          <OpportunityCard opportunity={opportunities[1]} />
        </Card>
      </aside>
    </section>
  );
}

export function AdminDashboard() {
  return (
    <section className="dashboard-layout">
      <div className="dashboard-main">
        <SectionHeader eyebrow="Backoffice" title="Operacion y gobierno de activos">
          Vista ejecutiva para originacion, KYC, reservas, cobranza y reportes.
        </SectionHeader>
        <div className="stats-grid">
          {adminMetrics.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
          ))}
        </div>
        <Card className="table-card">
          <div className="table-header">
            <h3>Pipeline operativo</h3>
            <span>SLA interno</span>
          </div>
          <div className="admin-queue">
            {[
              ["KYC inversor", "8 casos", "Alto"],
              ["Reservas alquiler", "11 visitas", "Medio"],
              ["Documentos proyecto", "4 pendientes", "Alto"],
              ["Mantenimiento", "6 tickets", "Normal"],
            ].map(([name, count, priority]) => (
              <div key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
                <small>{priority}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <aside className="dashboard-side">
        <Card>
          <h3>Controles</h3>
          <ul className="clean-list">
            <li>Validar origen de fondos antes de emitir participaciones.</li>
            <li>Bloquear retiros con documentacion vencida.</li>
            <li>Registrar aprobaciones de comite por oportunidad.</li>
          </ul>
        </Card>
      </aside>
    </section>
  );
}
