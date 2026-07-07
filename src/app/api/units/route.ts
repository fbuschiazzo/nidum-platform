import { db } from "@/lib/db";
import { badRequest, decimal, json, optionalNumber, optionalString, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type CreateUnitBody = {
  propertyId?: unknown;
  code?: unknown;
  floor?: string;
  bedrooms?: unknown;
  bathrooms?: unknown;
  squareMeters?: unknown;
  status?: "AVAILABLE" | "RESERVED" | "FUNDED" | "RENTED" | "SOLD";
  targetRent?: unknown;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const units = await db.unit.findMany({
      ...page,
      where: {
        propertyId: searchParams.get("propertyId") ?? undefined,
        status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined,
      },
      orderBy: [{ propertyId: "asc" }, { code: "asc" }],
      include: { property: true },
    });
    return json({ data: units, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateUnitBody>(request);
    const unit = await db.unit.create({
      data: {
        propertyId: requiredString(body.propertyId, "propertyId"),
        code: requiredString(body.code, "code"),
        floor: optionalString(body.floor),
        bedrooms: optionalNumber(body.bedrooms),
        bathrooms: optionalNumber(body.bathrooms),
        squareMeters: optionalNumber(body.squareMeters),
        status: body.status ?? "AVAILABLE",
        targetRent: body.targetRent === undefined ? undefined : decimal(body.targetRent, "targetRent"),
      },
    });
    return json({ data: unit }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
