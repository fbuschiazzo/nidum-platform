import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, decimal, json, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateInvestmentBody = {
  userId?: unknown;
  opportunityId?: unknown;
  amount?: unknown;
  status?: "PLEDGED" | "CONFIRMED" | "CANCELLED" | "EXITED";
  simulatePayment?: boolean;
};

function demoInvestmentStatus(status: CreateInvestmentBody["status"], simulatePayment?: boolean) {
  if (status === "CONFIRMED") return "CONFIRMED";
  return simulatePayment ? "CONFIRMED" : "PLEDGED";
}

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.investments(), ...page, source: "demo-store" });
  }

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
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.investments(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateInvestmentBody>(request);
    const opportunityId = requiredString(body.opportunityId, "opportunityId");
    const userId = requiredString(body.userId, "userId");
    const amount = decimal(body.amount, "amount");

    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      const result = demoStore.createInvestment({
        userId,
        opportunityId,
        amount: amount.toNumber(),
        status: demoInvestmentStatus(body.status, body.simulatePayment),
      });
      return json({ data: result, source: "demo-store" }, { status: 201 });
    }

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
    if (process.env.VERCEL) {
      try {
        const body = await request.clone().json() as CreateInvestmentBody;
        const result = demoStore.createInvestment({
          userId: String(body.userId ?? "demo-admin"),
          opportunityId: String(body.opportunityId ?? "cordel-pocitos"),
          amount: Number(body.amount ?? 1000),
          status: demoInvestmentStatus(body.status, body.simulatePayment),
        });
        return json({ data: result, source: "demo-store" }, { status: 201 });
      } catch {
        // Preserve validation error below.
      }
    }
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
