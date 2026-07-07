import { db } from "@/lib/db";
import { badRequest, decimal, json, optionalNumber, optionalString, pagination, readJson, requiredString, serverError } from "@/lib/domain";

type UnitInput = {
  code?: unknown;
  floor?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  targetRent?: number | string;
};

type CreatePropertyBody = {
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  address?: unknown;
  city?: unknown;
  country?: unknown;
  status?: "DRAFT" | "FUNDING" | "ACTIVE" | "SOLD" | "ARCHIVED";
  totalValue?: unknown;
  currency?: string;
  annualYieldTarget?: unknown;
  occupancyRate?: unknown;
  imageUrl?: string;
  units?: UnitInput[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const properties = await db.property.findMany({
      ...page,
      orderBy: { createdAt: "desc" },
      include: {
        units: true,
        opportunities: true,
        leases: true,
      },
    });
    return json({ data: properties, ...page });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreatePropertyBody>(request);
    const property = await db.property.create({
      data: {
        slug: requiredString(body.slug, "slug"),
        title: requiredString(body.title, "title"),
        description: requiredString(body.description, "description"),
        address: requiredString(body.address, "address"),
        city: requiredString(body.city, "city"),
        country: requiredString(body.country, "country"),
        status: body.status ?? "DRAFT",
        totalValue: decimal(body.totalValue, "totalValue"),
        currency: optionalString(body.currency) ?? "USD",
        annualYieldTarget: optionalNumber(body.annualYieldTarget),
        occupancyRate: optionalNumber(body.occupancyRate),
        imageUrl: optionalString(body.imageUrl),
        units: body.units?.length
          ? {
              create: body.units.map((unit) => ({
                code: requiredString(unit.code, "unit.code"),
                floor: optionalString(unit.floor),
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                squareMeters: unit.squareMeters,
                targetRent: unit.targetRent === undefined ? undefined : decimal(unit.targetRent, "unit.targetRent"),
              })),
            }
          : undefined,
      },
      include: { units: true },
    });
    return json({ data: property }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
