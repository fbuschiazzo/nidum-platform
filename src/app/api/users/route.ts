import { db } from "../../../lib/db";
import { badRequest, json, pagination, readJson, requiredString, serverError } from "../../../lib/domain";

type CreateUserBody = {
  email?: unknown;
  name?: unknown;
  role?: "INVESTOR" | "ADMIN" | "OPERATOR";
  phone?: string;
  country?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const users = await db.user.findMany({
      ...page,
      orderBy: { createdAt: "desc" },
      include: { investments: true, transactions: true },
    });
    return json({ data: users, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateUserBody>(request);
    const user = await db.user.create({
      data: {
        email: requiredString(body.email, "email").toLowerCase(),
        name: requiredString(body.name, "name"),
        role: body.role ?? "INVESTOR",
        phone: body.phone,
        country: body.country,
      },
    });
    return json({ data: user }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
