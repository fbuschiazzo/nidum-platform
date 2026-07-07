import { db } from "@/lib/db";
import { badRequest, decimal, json, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateInvestmentBody = {
  userId?: unknown;
  opportunityId?: unknown;
  amount?: unknown;
  status?: "PLEDGED" | "CONFIRMED" | "CANCELLED" | "EXITED";
  simulatePayment?: boolean;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const investments = await db.investment.findMany({
      ...page,
      where: {
        userId: searchParams.get("userId") ?? undefined,
        opportunityId: searchParams.get("opportunityId") ?? undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        opportunity: { include: { property: true } },
        transactions: true,
      },
    });
    return json({ data: investments, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateInvestmentBody>(request);
    const opportunityId = requiredString(body.opportunityId, "opportunityId");
    const userId = requiredString(body.userId, "userId");
    const amount = decimal(body.amount, "amount");

    const result = await db.$transaction(async (tx) => {
      const opportunity = await tx.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        include: { property: true },
      });

      if (opportunity.status !== "OPEN") {
        throw new Error("Opportunity must be OPEN to receive investments");
      }
      if (amount.lessThan(opportunity.minInvestment)) {
        throw new Error("Investment is below the opportunity minimum");
      }

      const shares = amount.div(opportunity.sharePrice).floor().toNumber();
      if (shares <= 0) throw new Error("amount must buy at least one share");

      const created = await tx.investment.create({
        data: {
          userId,
          opportunityId,
          amount,
          shares,
          status: body.status ?? (body.simulatePayment ? "CONFIRMED" : "PLEDGED"),
          signedAt: body.simulatePayment ? new Date() : undefined,
        },
      });

      await tx.opportunity.update({
        where: { id: opportunityId },
        data: { fundedAmount: { increment: amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: created.userId,
          investmentId: created.id,
          opportunityId,
          type: "INVESTMENT_PAYMENT",
          status: body.simulatePayment ? "SUCCEEDED" : "SIMULATED",
          amount,
          currency: opportunity.property.currency,
          providerRef: `sim_${created.id}`,
        },
      });

      return { investment: created, transaction };
    });

    return json({ data: result }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
