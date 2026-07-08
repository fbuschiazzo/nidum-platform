import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, json, optionalString, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateRentalLeadBody = {
  propertyId?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.leads(), ...page, source: "demo-store" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const leads = await db.rentalLead.findMany({
      ...page,
      orderBy: { createdAt: "desc" },
      include: { property: true, user: true },
    });
    return json({ data: leads, ...page });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.leads(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateRentalLeadBody>(request);

    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      const lead = demoStore.createLead({
        propertyId: optionalString(body.propertyId),
        name: requiredString(body.name, "name"),
        email: requiredString(body.email, "email").toLowerCase(),
        phone: optionalString(body.phone),
        message: optionalString(body.message),
      });
      return json({ data: lead, source: "demo-store" }, { status: 201 });
    }

    const lead = await db.rentalLead.create({
      data: {
        propertyId: optionalString(body.propertyId) ?? "cordel-pocitos",
        name: requiredString(body.name, "name"),
        email: requiredString(body.email, "email").toLowerCase(),
        phone: optionalString(body.phone),
        message: optionalString(body.message),
      },
    });
    return json({ data: lead }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
