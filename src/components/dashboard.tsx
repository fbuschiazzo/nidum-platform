import { adminMetrics, investorHoldings, investorPortfolio, opportunities } from "./platform-data";
import { OpportunityCard } from "./opportunity-card";
import { Card, InvestorActionPanel, SectionHeader, StatCard, VisualSimulator } from "./ui";

export function InvestorDashboard() {
  return (
    <section className="dashboard-layout">
      <div className="dashboard-main">
        <SectionHeader eyebrow="Portal inversor" title="Panel de posicion consolidada">
          Un resumen simple para saber cuanto tenes invertido, que cobraste y que
          podrias hacer hoy con tus participaciones.
        </SectionHeader>
        <div className="stats-grid">
          {investorPortfolio.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} detail={item.delta} />
          ))}
        </div>
        <VisualSimulator opportunity={opportunities[0]} />
        <Card className="table-card">
          <div className="table-header">
            <h3>Mi cartera explicada</h3>
            <span>Participaciones actuales</span>
          </div>
          <div className="holding-list">
            {investorHoldings.map((holding) => (
              <div className="holding-row" key={holding.project}>
                <div className="holding-title">
                  <strong>{holding.project}</strong>
                  <small>{holding.status}</small>
                </div>
                <span>
                  <small>Invertido</small>
                  USD {holding.amount.toLocaleString("en-US")}
                </span>
                <span>
                  <small>Participacion</small>
                  {holding.percentage}% del activo
                </span>
                <span>
                  <small>Renta estimada</small>
                  USD {holding.estimatedMonthly}/mes
                </span>
              </div>
            ))}
          </div>
        </Card>
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
        <InvestorActionPanel />
        <Card>
          <h3>Proximos pasos guiados</h3>
          <ul className="clean-list">
            <li>Completar perfil de riesgo para ordenar recomendaciones.</li>
            <li>Revisar documentos y riesgos antes de reservar una nueva participacion.</li>
            <li>Confirmar si queres priorizar renta mensual o valorizacion.</li>
          </ul>
        </Card>
        <Card>
          <h3>Alertas simples</h3>
          <ul className="clean-list">
            <li>Cordel Pocitos: renta estimada desde noviembre 2026.</li>
            <li>Costa Serena: retorno potencial mayor, pero con estacionalidad.</li>
            <li>Tu salida no es inmediata: revisa liquidez antes de invertir.</li>
          </ul>
        </Card>
        <Card id="vender">
          <h3>Venta secundaria</h3>
          <p>
            Publica una participacion para que otro inversor pueda comprarla. Nidum
            muestra precio sugerido, rendimiento historico y documentos del activo.
          </p>
        </Card>
        <Card id="ofertar">
          <h3>Ofertas de entrada</h3>
          <p>
            Deja una oferta por monto y retorno esperado cuando una oportunidad esta
            completa o con cupos limitados.
          </p>
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
