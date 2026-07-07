export const brand = {
  name: "Nidum",
  tagline: "Inversion inmobiliaria fraccionada con seguimiento operativo",
  description:
    "Una plataforma para invertir en proyectos inmobiliarios seleccionados, seguir rendimiento, reservar unidades en alquiler y operar con informacion clara.",
};

export const opportunities = [
  {
    title: "Cordel Pocitos",
    location: "Pocitos, Montevideo",
    type: "Renta residencial",
    targetReturn: "8.4%",
    funded: 72,
    ticket: "USD 500",
    term: "36 meses",
    status: "En fondeo",
    summary:
      "Edificio compacto de unidades monoambiente y un dormitorio con administracion integral de alquileres.",
  },
  {
    title: "Nave Ruta 101",
    location: "Canelones",
    type: "Logistica ligera",
    targetReturn: "9.1%",
    funded: 48,
    ticket: "USD 1.000",
    term: "48 meses",
    status: "Due diligence",
    summary:
      "Modulo logistico con contratos escalonados y demanda de ultima milla para operadores regionales.",
  },
  {
    title: "Costa Serena",
    location: "Maldonado",
    type: "Alquiler temporal",
    targetReturn: "10.2%",
    funded: 91,
    ticket: "USD 750",
    term: "30 meses",
    status: "Ultimos cupos",
    summary:
      "Pool de apartamentos para renta temporal con pricing dinamico y administracion hotelera.",
  },
];

export const rentalUnits = [
  {
    title: "Monoambiente equipado",
    address: "Bulevar Espana 2180",
    city: "Montevideo",
    price: "UYU 28.500",
    beds: "1 ambiente",
    size: "34 m2",
    availability: "Disponible ahora",
  },
  {
    title: "Apartamento 1 dormitorio",
    address: "Jose Ellauri 1045",
    city: "Montevideo",
    price: "UYU 39.900",
    beds: "1 dormitorio",
    size: "49 m2",
    availability: "Desde agosto",
  },
  {
    title: "Unidad premium costa",
    address: "Rambla Claudio Williman",
    city: "Punta del Este",
    price: "USD 1.250",
    beds: "2 dormitorios",
    size: "76 m2",
    availability: "Temporada flexible",
  },
];

export const investorPortfolio = [
  { label: "Capital invertido", value: "USD 18.750", delta: "+12.4% anualizado" },
  { label: "Rentas cobradas", value: "USD 1.486", delta: "Ultimos 12 meses" },
  { label: "Proyectos activos", value: "6", delta: "3 en renta, 3 en obra" },
  { label: "Proxima distribucion", value: "USD 214", delta: "15 jul 2026" },
];

export const adminMetrics = [
  { label: "AUM gestionado", value: "USD 4.8M", detail: "18 vehiculos activos" },
  { label: "Ocupacion", value: "94%", detail: "Residencial y temporal" },
  { label: "Tickets pendientes", value: "27", detail: "KYC, reservas y soporte" },
  { label: "Distribuciones", value: "USD 138K", detail: "Programadas este mes" },
];
