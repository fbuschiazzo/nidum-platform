import { db } from "../../../lib/db";
import { badRequest, decimal, json, optionalString, pagination, readJson, requiredString, serverError } from "../../../lib/domain";

type CreateTransactionBody = {
  userId?: unknown;
  investmentId?: string;
  opportunityId?: string;
  type?: "DEPOSIT" | "INVESTMENT_PAYMENT" | "RENT_DISTRIBUTION" | "PLATFORM_FEE" | "REFUND";
  status?: "SIMULATED" | "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  amount?: unknown;
  currency?: string;
  provider?: string;
  providerRef?: string;
  metadata?: unknown;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const transactions = await db.transaction.findMany({
      ...page,
      where: {
        userId: searchParams.get("userId") ?? undefined,
        investmentId: searchParams.get("investmentId") ?? undefined,
        opportunityId: searchParams.get("opportunityId") ?? undefined,
        type: searchParams.get("type") ? (searchParams.get("type") as never) : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: { user: true, investment: true, opportunity: true },
    });
    return json({ data: transactions, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateTransactionBody>(request);
    const transaction = await db.transaction.create({
      data: {
        userId: requiredString(body.userId, "userId"),
        investmentId: optionalString(body.investmentId),
        opportunityId: optionalString(body.opportunityId),
        type: body.type ?? "DEPOSIT",
        status: body.status ?? "SIMULATED",
        amount: decimal(body.amount, "amount"),
        currency: optionalString(body.currency) ?? "USD",
        provider: optionalString(body.provider) ?? "simulator",
        providerRef: optionalString(body.providerRef),
        metadata: body.metadata === undefined ? undefined : JSON.stringify(body.metadata),
      },
    });
    return json({ data: transaction }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
