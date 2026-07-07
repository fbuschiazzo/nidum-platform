import { db } from "../../../lib/db";
import { badRequest, json, optionalString, pagination, readJson, requiredString, serverError } from "../../../lib/domain";

type CreateLeadBody = {
  propertyId?: unknown;
  userId?: string;
  name?: unknown;
  email?: unknown;
  phone?: string;
  message?: string;
  status?: "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const leads = await db.rentalLead.findMany({
      ...page,
      where: {
        propertyId: searchParams.get("propertyId") ?? undefined,
        status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: { property: true, user: true },
    });
    return json({ data: leads, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateLeadBody>(request);
    const lead = await db.rentalLead.create({
      data: {
        propertyId: requiredString(body.propertyId, "propertyId"),
        userId: optionalString(body.userId),
        name: requiredString(body.name, "name"),
        email: requiredString(body.email, "email").toLowerCase(),
        phone: optionalString(body.phone),
        message: optionalString(body.message),
        status: body.status ?? "NEW",
      },
    });
    return json({ data: lead }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
