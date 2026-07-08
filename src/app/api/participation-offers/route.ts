import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, decimal, json, optionalString, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateOfferBody = {
  listingId?: unknown;
  buyerId?: unknown;
  percentage?: unknown;
  amount?: unknown;
  message?: unknown;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.offers(), ...page, source: "demo-store" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const offers = await db.participationOffer.findMany({
      ...page,
      where: { status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined },
      orderBy: { createdAt: "desc" },
      include: { buyer: true, listing: { include: { investment: { include: { opportunity: true } } } } },
    });
    return json({ data: offers, ...page });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.offers(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateOfferBody>(request);

    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      const offer = demoStore.createOffer({
        listingId: requiredString(body.listingId, "listingId"),
        buyerId: requiredString(body.buyerId, "buyerId"),
        percentage: Number(body.percentage),
        amount: Number(body.amount),
        message: optionalString(body.message),
      });
      return json({ data: offer, source: "demo-store" }, { status: 201 });
    }

    const offer = await db.participationOffer.create({
      data: {
        listingId: requiredString(body.listingId, "listingId"),
        buyerId: requiredString(body.buyerId, "buyerId"),
        percentage: Number(body.percentage),
        amount: decimal(body.amount, "amount"),
        message: optionalString(body.message),
      },
    });
    return json({ data: offer }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
