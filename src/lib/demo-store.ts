import { opportunities, rentalUnits, secondaryMarket } from "@/components/platform-data";

type DemoUser = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: "ADMIN" | "INVESTOR" | "OPERATOR";
  simulatedWallet: number;
};

type DemoInvestment = {
  id: string;
  userId: string;
  opportunityId: string;
  amount: number;
  shares: number;
  status: "PLEDGED" | "CONFIRMED";
  createdAt: string;
};

type DemoListing = {
  id: string;
  investmentId: string;
  sellerId: string;
  percentage: number;
  shares: number;
  askingPrice: number;
  status: "OPEN";
  createdAt: string;
};

type DemoOffer = {
  id: string;
  listingId: string;
  buyerId: string;
  percentage: number;
  amount: number;
  message?: string;
  status: "PENDING";
  createdAt: string;
};

type DemoLead = {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: "NEW";
  createdAt: string;
};

type DemoState = {
  investments: DemoInvestment[];
  listings: DemoListing[];
  offers: DemoOffer[];
  leads: DemoLead[];
};

const users: DemoUser[] = [
  {
    id: "demo-admin",
    username: "admin",
    password: "admin",
    name: "Admin Nidum",
    email: "admin@nidum.demo",
    role: "ADMIN",
    simulatedWallet: 100000,
  },
  {
    id: "demo-investor",
    username: "inversor",
    password: "inversor",
    name: "Inversor Demo",
    email: "inversor@nidum.demo",
    role: "INVESTOR",
    simulatedWallet: 25000,
  },
];

const globalDemo = globalThis as unknown as { nidumDemoState?: DemoState };

function now() {
  return new Date().toISOString();
}

function state() {
  if (!globalDemo.nidumDemoState) {
    globalDemo.nidumDemoState = {
      investments: [
        {
          id: "demo-investment-cordel-pocitos",
          userId: "demo-admin",
          opportunityId: "cordel-pocitos",
          amount: 10000,
          shares: 100,
          status: "CONFIRMED",
          createdAt: now(),
        },
      ],
      listings: secondaryMarket.map((listing) => ({
        id: listing.id,
        investmentId: `demo-investment-${listing.opportunitySlug}`,
        sellerId: "demo-admin",
        percentage: listing.percentage,
        shares: Math.max(1, Math.round(listing.percentage * 10)),
        askingPrice: listing.askingPrice,
        status: "OPEN" as const,
        createdAt: now(),
      })),
      offers: [],
      leads: [],
    };
  }

  return globalDemo.nidumDemoState;
}

export const demoStore = {
  users,

  authenticate(username: string, password: string) {
    return users.find((user) => user.username === username && user.password === password);
  },

  properties() {
    return opportunities.map((opportunity) => ({
      id: opportunity.slug,
      slug: opportunity.slug,
      title: opportunity.title,
      description: opportunity.summary,
      address: opportunity.location,
      city: opportunity.location.split(",")[0],
      country: "Uruguay",
      status: "FUNDING",
      totalValue: Number(opportunity.totalValue.replace(/[^0-9.]/g, "")),
      currency: "USD",
      annualYieldTarget: Number.parseFloat(opportunity.targetReturn),
      occupancyRate: Number.parseFloat(opportunity.occupancy),
      imageUrl: opportunity.image,
      units: rentalUnits.filter((unit) => unit.city === "Montevideo").map((unit, index) => ({
        id: `${opportunity.slug}-unit-${index + 1}`,
        code: `${index + 1}`.padStart(2, "0"),
        bedrooms: unit.beds.includes("2") ? 2 : unit.beds.includes("1") ? 1 : 0,
        squareMeters: Number.parseFloat(unit.size),
        status: "AVAILABLE",
        targetRent: unit.price,
      })),
      opportunities: [{ id: opportunity.slug, title: opportunity.title }],
      leases: [],
    }));
  },

  opportunities() {
    return opportunities.map((opportunity) => ({
      id: opportunity.slug,
      title: opportunity.title,
      summary: opportunity.summary,
      status: opportunity.status === "Due diligence" ? "DRAFT" : "OPEN",
      targetAmount: Number(opportunity.totalValue.replace(/[^0-9.]/g, "")),
      fundedAmount: Math.round((Number(opportunity.totalValue.replace(/[^0-9.]/g, "")) * opportunity.funded) / 100),
      sharePrice: 100,
      minInvestment: Number(opportunity.ticket.replace(/[^0-9.]/g, "")),
      expectedAnnualYield: Number.parseFloat(opportunity.targetReturn),
      property: demoStore.properties().find((property) => property.slug === opportunity.slug),
      investments: state().investments.filter((investment) => investment.opportunityId === opportunity.slug),
      documents: [],
    }));
  },

  investments() {
    return state().investments.map((investment) => ({
      ...investment,
      opportunity: demoStore.opportunities().find((item) => item.id === investment.opportunityId),
      user: users.find((user) => user.id === investment.userId),
      transactions: [],
    }));
  },

  createInvestment(input: { userId: string; opportunityId: string; amount: number; status?: "PLEDGED" | "CONFIRMED" }) {
    const investment: DemoInvestment = {
      id: `demo-investment-${input.opportunityId}-${Date.now()}`,
      userId: input.userId,
      opportunityId: input.opportunityId,
      amount: input.amount,
      shares: Math.max(1, Math.floor(input.amount / 100)),
      status: input.status ?? "PLEDGED",
      createdAt: now(),
    };
    state().investments.unshift(investment);
    return { investment, transaction: { id: `demo-tx-${investment.id}`, amount: input.amount, status: "SIMULATED" } };
  },

  listings() {
    return state().listings;
  },

  createListing(input: { investmentId: string; sellerId: string; percentage: number; shares?: number; askingPrice: number }) {
    const listing: DemoListing = {
      id: `demo-listing-${Date.now()}`,
      investmentId: input.investmentId,
      sellerId: input.sellerId,
      percentage: input.percentage,
      shares: input.shares ?? Math.max(1, Math.round(input.percentage * 10)),
      askingPrice: input.askingPrice,
      status: "OPEN",
      createdAt: now(),
    };
    state().listings.unshift(listing);
    return listing;
  },

  offers() {
    return state().offers;
  },

  createOffer(input: { listingId: string; buyerId: string; percentage: number; amount: number; message?: string }) {
    const offer: DemoOffer = {
      id: `demo-offer-${Date.now()}`,
      listingId: input.listingId,
      buyerId: input.buyerId,
      percentage: input.percentage,
      amount: input.amount,
      message: input.message,
      status: "PENDING",
      createdAt: now(),
    };
    state().offers.unshift(offer);
    return offer;
  },

  leads() {
    return state().leads;
  },

  createLead(input: { propertyId?: string; name: string; email: string; phone?: string; message?: string }) {
    const lead: DemoLead = {
      id: `demo-lead-${Date.now()}`,
      propertyId: input.propertyId ?? "cordel-pocitos",
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      status: "NEW",
      createdAt: now(),
    };
    state().leads.unshift(lead);
    return lead;
  },
};
