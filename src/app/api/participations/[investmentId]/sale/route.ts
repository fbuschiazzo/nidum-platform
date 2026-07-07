import { db } from "@/lib/db";
import { badRequest, decimal, json, optionalDate, percentage, readJson, requiredString, serverError } from "@/lib/domain";

type SaleBody = {
  sellerId?: unknown;
  percentage?: unknown;
  askingPrice?: unknown;
  expiresAt?: unknown;
};

type RouteContext = {
  params: Promise<{ investmentId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { investmentId } = await context.params;
    const body = await readJson<SaleBody>(request);
    const sellerId = requiredString(body.sellerId, "sellerId");
    const listedPercentage = percentage(body.percentage, "percentage");
    const askingPrice = decimal(body.askingPrice, "askingPrice");

    const listing = await db.$transaction(async (tx) => {
      const investment = await tx.investment.findUniqueOrThrow({
        where: { id: investmentId },
        include: { listings: { where: { status: "OPEN" } } },
      });

      if (investment.userId !== sellerId) {
        throw new Error("sellerId must own the investment");
      }
      if (investment.status !== "CONFIRMED") {
        throw new Error("Only confirmed investments can be listed for sale");
      }

      const openListedShares = investment.listings.reduce((total, item) => total + item.shares, 0);
      const shares = Math.floor((investment.shares * listedPercentage) / 100);
      if (shares <= 0) throw new Error("percentage must represent at least one share");
      if (openListedShares + shares > investment.shares) {
        throw new Error("Open sale listings exceed available investment shares");
      }

      return tx.participationListing.create({
        data: {
          investmentId,
          sellerId,
          percentage: listedPercentage,
          shares,
          askingPrice,
          expiresAt: optionalDate(body.expiresAt),
        },
        include: {
          investment: { include: { opportunity: { include: { property: true } } } },
          seller: true,
          offers: true,
        },
      });
    });

    return json({ data: listing }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}

