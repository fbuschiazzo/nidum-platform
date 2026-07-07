const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@fraccional.dev" },
    update: {},
    create: {
      email: "admin@fraccional.dev",
      name: "Admin Plataforma",
      role: "ADMIN",
      country: "UY",
      kycVerified: true,
      simulatedWallet: 100000,
    },
  });

  const investor = await prisma.user.upsert({
    where: { email: "inversor.demo@fraccional.dev" },
    update: {},
    create: {
      email: "inversor.demo@fraccional.dev",
      name: "Inversor Demo",
      role: "INVESTOR",
      phone: "+598 99 000 000",
      country: "UY",
      kycVerified: true,
      simulatedWallet: 25000,
    },
  });

  const property = await prisma.property.upsert({
    where: { slug: "pocitos-renta-001" },
    update: {},
    create: {
      slug: "pocitos-renta-001",
      title: "Edificio Pocitos Renta I",
      description: "Activo residencial fraccionado orientado a renta mensual en Montevideo.",
      address: "Bulevar Espana 2500",
      city: "Montevideo",
      country: "Uruguay",
      status: "FUNDING",
      totalValue: 420000,
      currency: "USD",
      annualYieldTarget: 7.8,
      occupancyRate: 0.92,
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      units: {
        create: [
          { code: "101", floor: "1", bedrooms: 1, bathrooms: 1, squareMeters: 42, targetRent: 850 },
          { code: "102", floor: "1", bedrooms: 2, bathrooms: 1, squareMeters: 61, targetRent: 1150 },
          { code: "201", floor: "2", bedrooms: 1, bathrooms: 1, squareMeters: 44, targetRent: 880 },
        ],
      },
    },
  });

  const existingOpportunity = await prisma.opportunity.findFirst({
    where: { propertyId: property.id, title: "Ronda Semilla Pocitos Renta I" },
  });

  const opportunity =
    existingOpportunity ??
    (await prisma.opportunity.create({
      data: {
        propertyId: property.id,
        title: "Ronda Semilla Pocitos Renta I",
        summary: "Compra fraccionada de unidades residenciales con distribucion simulada de alquileres.",
        status: "OPEN",
        targetAmount: 150000,
        fundedAmount: 10000,
        sharePrice: 100,
        minInvestment: 500,
        expectedAnnualYield: 7.8,
        opensAt: new Date(),
        closesAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    }));

  const existingInvestment = await prisma.investment.findFirst({
    where: { userId: investor.id, opportunityId: opportunity.id },
  });

  const investment =
    existingInvestment ??
    (await prisma.investment.create({
      data: {
        userId: investor.id,
        opportunityId: opportunity.id,
        amount: 10000,
        shares: 100,
        status: "CONFIRMED",
        signedAt: new Date(),
      },
    }));

  for (const transactionSeed of [
    {
      userId: investor.id,
      investmentId: investment.id,
      opportunityId: opportunity.id,
      type: "INVESTMENT_PAYMENT",
      status: "SUCCEEDED",
      amount: 10000,
      currency: "USD",
      providerRef: "sim_pay_seed_001",
    },
    {
      userId: investor.id,
      investmentId: investment.id,
      opportunityId: opportunity.id,
      type: "RENT_DISTRIBUTION",
      status: "SIMULATED",
      amount: 65,
      currency: "USD",
      providerRef: "sim_rent_seed_001",
    },
  ]) {
    const exists = await prisma.transaction.findFirst({ where: { providerRef: transactionSeed.providerRef } });
    if (!exists) await prisma.transaction.create({ data: transactionSeed });
  }

  const existingLead = await prisma.rentalLead.findFirst({
    where: { propertyId: property.id, email: "maria.arrenda@example.com" },
  });

  if (!existingLead) {
    await prisma.rentalLead.create({
      data: {
        propertyId: property.id,
        userId: admin.id,
        name: "Maria Arrendataria",
        email: "maria.arrenda@example.com",
        phone: "+598 98 111 111",
        message: "Estoy interesada en alquilar una unidad de un dormitorio.",
        status: "QUALIFIED",
      },
    });
  }

  const existingLease = await prisma.lease.findFirst({
    where: { propertyId: property.id, tenantEmail: "inquilino@example.com" },
  });

  if (!existingLease) {
    await prisma.lease.create({
      data: {
        propertyId: property.id,
        tenantName: "Inquilino Demo",
        tenantEmail: "inquilino@example.com",
        monthlyRent: 850,
        startsAt: new Date(),
      },
    });
  }

  for (const documentSeed of [
    {
      propertyId: property.id,
      title: "Ficha legal de propiedad",
      type: "LEGAL",
      url: "https://example.com/docs/ficha-legal-pocitos.pdf",
    },
    {
      opportunityId: opportunity.id,
      userId: investor.id,
      title: "Reporte mensual simulado",
      type: "INVESTOR_REPORT",
      url: "https://example.com/reports/pocitos-mensual.pdf",
      period: "2026-07",
    },
  ]) {
    const exists = await prisma.document.findFirst({ where: { title: documentSeed.title, url: documentSeed.url } });
    if (!exists) await prisma.document.create({ data: documentSeed });
  }

  console.log({ admin: admin.email, investor: investor.email, property: property.slug, opportunity: opportunity.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
