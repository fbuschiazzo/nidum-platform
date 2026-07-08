import { db } from "../../../lib/db";
import { demoStore } from "../../../lib/demo-store";
import { badRequest, json, pagination, readJson, requiredString, serverError } from "../../../lib/domain";

type CreateUserBody = {
  email?: unknown;
  name?: unknown;
  role?: "INVESTOR" | "ADMIN" | "OPERATOR";
  phone?: string;
  country?: string;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    const users = demoStore.users.map(({ password: _password, ...user }) => user);
    return json({ data: users, ...page, source: "demo-store" });
  }

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
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      const users = demoStore.users.map(({ password: _password, ...user }) => user);
      return json({ data: users, ...page, source: "demo-store" });
    }
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
