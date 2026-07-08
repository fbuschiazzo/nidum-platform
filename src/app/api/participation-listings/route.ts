import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, decimal, json, optionalDate, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateListingBody = {
  investmentId?: unknown;
  sellerId?: unknown;
  percentage?: unknown;
  shares?: unknown;
  askingPrice?: unknown;
  expiresAt?: unknown;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.listings(), ...page, source: "demo-store" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const listings = await db.participationListing.findMany({
      ...page,
      where: { status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined },
      orderBy: { createdAt: "desc" },
      include: { seller: true, investment: { include: { opportunity: { include: { property: true } } } }, offers: true },
    });
    return json({ data: listings, ...page });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.listings(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateListingBody>(request);

    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      const listing = demoStore.createListing({
        investmentId: requiredString(body.investmentId, "investmentId"),
        sellerId: requiredString(body.sellerId, "sellerId"),
        percentage: Number(body.percentage),
        shares: body.shares === undefined ? undefined : Number(body.shares),
        askingPrice: Number(body.askingPrice),
      });
      return json({ data: listing, source: "demo-store" }, { status: 201 });
    }

    const listing = await db.participationListing.create({
      data: {
        investmentId: requiredString(body.investmentId, "investmentId"),
        sellerId: requiredString(body.sellerId, "sellerId"),
        percentage: Number(body.percentage),
        shares: Number(body.shares),
        askingPrice: decimal(body.askingPrice, "askingPrice"),
        expiresAt: optionalDate(body.expiresAt),
      },
    });
    return json({ data: listing }, { status: 201 });
  } catch (error) {
    if (process.env.VERCEL) {
      return error instanceof Error ? badRequest(error.message) : serverError(error);
    }
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
