import { db } from "@/lib/db";
import { badRequest, decimal, json, optionalString, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateOfferBody = {
  listingId?: unknown;
  buyerId?: unknown;
  percentage?: unknown;
  amount?: unknown;
  message?: unknown;
};

export async function GET(request: Request) {
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
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateOfferBody>(request);
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
