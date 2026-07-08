import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, decimal, json, optionalDate, optionalNumber, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateOpportunityBody = {
  propertyId?: unknown;
  title?: unknown;
  summary?: unknown;
  status?: "DRAFT" | "OPEN" | "FUNDED" | "CLOSED" | "CANCELLED";
  targetAmount?: unknown;
  fundedAmount?: unknown;
  sharePrice?: unknown;
  minInvestment?: unknown;
  expectedAnnualYield?: unknown;
  opensAt?: string;
  closesAt?: string;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.opportunities(), ...page, source: "demo-store" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const opportunities = await db.opportunity.findMany({
      ...page,
      where: {
        status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined,
        propertyId: searchParams.get("propertyId") ?? undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        property: { include: { units: true } },
        investments: true,
        documents: true,
      },
    });
    return json({ data: opportunities, ...page });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.opportunities(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateOpportunityBody>(request);
    const opportunity = await db.opportunity.create({
      data: {
        propertyId: requiredString(body.propertyId, "propertyId"),
        title: requiredString(body.title, "title"),
        summary: requiredString(body.summary, "summary"),
        status: body.status ?? "DRAFT",
        targetAmount: decimal(body.targetAmount, "targetAmount"),
        fundedAmount: body.fundedAmount === undefined ? undefined : decimal(body.fundedAmount, "fundedAmount"),
        sharePrice: decimal(body.sharePrice, "sharePrice"),
        minInvestment: decimal(body.minInvestment, "minInvestment"),
        expectedAnnualYield: optionalNumber(body.expectedAnnualYield),
        opensAt: optionalDate(body.opensAt),
        closesAt: optionalDate(body.closesAt),
      },
      include: { property: true },
    });
    return json({ data: opportunity }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
