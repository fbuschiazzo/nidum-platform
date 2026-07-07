import { db } from "@/lib/db";
import { badRequest, decimal, json, optionalString, percentage, readJson, requiredString, serverError } from "@/lib/domain";

type OfferBody = {
  buyerId?: unknown;
  listingId?: unknown;
  percentage?: unknown;
  amount?: unknown;
  message?: unknown;
};

type RouteContext = {
  params: Promise<{ investmentId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { investmentId } = await context.params;
    const body = await readJson<OfferBody>(request);
    const buyerId = requiredString(body.buyerId, "buyerId");
    const offeredPercentage = percentage(body.percentage, "percentage");
    const amount = decimal(body.amount, "amount");
    const listingId = optionalString(body.listingId);

    const offer = await db.$transaction(async (tx) => {
      const listing = await tx.participationListing.findFirstOrThrow({
        where: {
          id: listingId,
          investmentId,
          status: "OPEN",
        },
        orderBy: { createdAt: "desc" },
        include: { investment: true },
      });

      if (listing.sellerId === buyerId) {
        throw new Error("buyerId cannot match the listing seller");
      }
      if (listing.expiresAt && listing.expiresAt.getTime() < Date.now()) {
        throw new Error("Participation listing is expired");
      }
      if (offeredPercentage > listing.percentage) {
        throw new Error("Offer percentage cannot exceed listed percentage");
      }

      const offeredShares = Math.floor((listing.investment.shares * offeredPercentage) / 100);
      if (offeredShares <= 0 || offeredShares > listing.shares) {
        throw new Error("Offer percentage must represent available listed shares");
      }

      return tx.participationOffer.create({
        data: {
          listingId: listing.id,
          buyerId,
          percentage: offeredPercentage,
          amount,
          message: optionalString(body.message),
        },
        include: {
          buyer: true,
          listing: {
            include: {
              seller: true,
              investment: { include: { opportunity: { include: { property: true } } } },
            },
          },
        },
      });
    });

    return json({ data: offer }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}

