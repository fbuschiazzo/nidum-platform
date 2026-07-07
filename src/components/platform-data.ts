import { cordelPocitosImage, costaSerenaImage, naveRuta101Image } from "./property-images";

export const brand = {
  name: "Nidum",
  tagline: "Inversion inmobiliaria simple para tickets de USD 1.000 a 10.000",
  description:
    "Una plataforma para invertir en proyectos inmobiliarios seleccionados, seguir rendimiento, reservar unidades en alquiler y operar con informacion clara.",
};

export const opportunities = [
  {
    slug: "cordel-pocitos",
    title: "Cordel Pocitos",
    image: cordelPocitosImage,
    location: "Pocitos, Montevideo",
    type: "Renta residencial",
    targetReturn: "8.4%",
    funded: 72,
    ticket: "USD 1.000",
    term: "36 meses",
    status: "En fondeo",
    risk: "Moderado",
    available: "USD 168.000 disponibles",
    nextPayout: "Trimestral",
    monthlyReturnPer1000: 7,
    occupancy: "94%",
    totalValue: "USD 620.000",
    liquidity: "Venta entre inversores desde mes 12",
    plainGoal: "Comprar una parte de un edificio chico ya pensado para alquiler mensual.",
    investorFit: "Para quien busca renta estable y quiere empezar con montos bajos.",
    summary:
      "Edificio compacto de unidades monoambiente y un dormitorio con administracion integral de alquileres.",
    highlights: [
      "Zona con demanda sostenida de estudiantes y profesionales jovenes.",
      "Administracion de alquileres, gastos y mantenimiento incluida.",
      "Distribuciones estimadas cada trimestre una vez estabilizado.",
    ],
    timeline: [
      ["Fondeo", "72% completado"],
      ["Cierre", "Agosto 2026"],
      ["Renta", "Desde noviembre 2026"],
    ],
  },
  {
    slug: "nave-ruta-101",
    title: "Nave Ruta 101",
    image: naveRuta101Image,
    location: "Canelones",
    type: "Logistica ligera",
    targetReturn: "9.1%",
    funded: 48,
    ticket: "USD 1.000",
    term: "48 meses",
    status: "Due diligence",
    risk: "Medio",
    available: "USD 312.000 disponibles",
    nextPayout: "Semestral",
    monthlyReturnPer1000: 7.6,
    occupancy: "Contrato objetivo 3 anos",
    totalValue: "USD 980.000",
    liquidity: "Ofertas secundarias sujetas a cupos",
    plainGoal: "Participar en una nave para operadores de ultima milla y almacenamiento.",
    investorFit: "Para quien acepta mas plazo a cambio de contratos comerciales.",
    summary:
      "Modulo logistico con contratos escalonados y demanda de ultima milla para operadores regionales.",
    highlights: [
      "Ubicacion conectada a aeropuerto, ruta 101 y accesos a Montevideo.",
      "Rentas comerciales con ajustes pactados por contrato.",
      "Reserva escalonada para mantenimiento y vacancia.",
    ],
    timeline: [
      ["Revision", "Documentos legales en curso"],
      ["Fondeo", "Apertura prevista julio 2026"],
      ["Operacion", "Primer semestre 2027"],
    ],
  },
  {
    slug: "costa-serena",
    title: "Costa Serena",
    image: costaSerenaImage,
    location: "Maldonado",
    type: "Alquiler temporal",
    targetReturn: "10.2%",
    funded: 91,
    ticket: "USD 2.500",
    term: "30 meses",
    status: "Ultimos cupos",
    risk: "Dinamico",
    available: "USD 54.000 disponibles",
    nextPayout: "Por temporada",
    monthlyReturnPer1000: 8.5,
    occupancy: "68% anual estimado",
    totalValue: "USD 740.000",
    liquidity: "Venta habilitada al cierre de temporada",
    plainGoal: "Invertir en apartamentos para renta temporal con gestion hotelera.",
    investorFit: "Para quien prioriza retorno potencial y tolera estacionalidad.",
    summary:
      "Pool de apartamentos para renta temporal con pricing dinamico y administracion hotelera.",
    highlights: [
      "Pricing dinamico para temporada alta, media y eventos.",
      "Reportes de ocupacion y gastos visibles desde el portal.",
      "Cupos finales para tickets entre USD 2.500 y 10.000.",
    ],
    timeline: [
      ["Fondeo", "91% completado"],
      ["Equipamiento", "Septiembre 2026"],
      ["Temporada", "Diciembre 2026"],
    ],
  },
];

export type Opportunity = (typeof opportunities)[number];

export const simulatorTickets = [1000, 5000, 10000] as const;

export const secondaryMarket = [
  {
    id: "sec-cordel-01",
    opportunitySlug: "cordel-pocitos",
    project: "Cordel Pocitos",
    seller: "Inversor inicial",
    percentage: 1.6,
    askingPrice: 1850,
    estimatedMonthly: 13,
    status: "Disponible",
  },
  {
    id: "sec-costa-02",
    opportunitySlug: "costa-serena",
    project: "Costa Serena",
    seller: "Family office demo",
    percentage: 0.9,
    askingPrice: 2750,
    estimatedMonthly: 23,
    status: "Recibe ofertas",
  },
] as const;

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

export const investorHoldings = [
  {
    project: "Cordel Pocitos",
    slug: "cordel-pocitos",
    amount: 10000,
    percentage: 8.1,
    estimatedMonthly: 70,
    status: "Confirmada",
  },
  {
    project: "Costa Serena",
    slug: "costa-serena",
    amount: 8750,
    percentage: 3.9,
    estimatedMonthly: 74,
    status: "En temporada",
  },
] as const;

export const adminMetrics = [
  { label: "AUM gestionado", value: "USD 4.8M", detail: "18 vehiculos activos" },
  { label: "Ocupacion", value: "94%", detail: "Residencial y temporal" },
  { label: "Tickets pendientes", value: "27", detail: "KYC, reservas y soporte" },
  { label: "Distribuciones", value: "USD 138K", detail: "Programadas este mes" },
];
