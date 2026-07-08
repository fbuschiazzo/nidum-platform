import { db } from "../../../lib/db";
import { demoStore } from "../../../lib/demo-store";
import { badRequest, json, optionalDate, optionalString, pagination, readJson, requiredString, serverError } from "../../../lib/domain";

type CreateDocumentBody = {
  propertyId?: string;
  opportunityId?: string;
  userId?: string;
  title?: unknown;
  type?: "PROPERTY_DOC" | "INVESTOR_REPORT" | "LEGAL" | "FINANCIAL" | "TAX";
  url?: unknown;
  period?: string;
  publishedAt?: string;
};

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    const documents = demoStore.opportunities().flatMap((opportunity) => [
      {
        id: `doc-${opportunity.id}-tesis`,
        opportunityId: opportunity.id,
        propertyId: opportunity.property?.id,
        title: `Tesis de inversion - ${opportunity.title}`,
        type: "INVESTOR_REPORT",
        url: "#",
        period: "2026",
        publishedAt: new Date().toISOString(),
      },
      {
        id: `doc-${opportunity.id}-legal`,
        opportunityId: opportunity.id,
        propertyId: opportunity.property?.id,
        title: `Resumen legal - ${opportunity.title}`,
        type: "LEGAL",
        url: "#",
        period: "2026",
        publishedAt: new Date().toISOString(),
      },
    ]);
    return json({ data: documents, ...page, source: "demo-store" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const documents = await db.document.findMany({
      ...page,
      where: {
        propertyId: searchParams.get("propertyId") ?? undefined,
        opportunityId: searchParams.get("opportunityId") ?? undefined,
        userId: searchParams.get("userId") ?? undefined,
        type: searchParams.get("type") ? (searchParams.get("type") as never) : undefined,
      },
      orderBy: { publishedAt: "desc" },
    });
    return json({ data: documents, ...page });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: [], ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<CreateDocumentBody>(request);
    const document = await db.document.create({
      data: {
        propertyId: optionalString(body.propertyId),
        opportunityId: optionalString(body.opportunityId),
        userId: optionalString(body.userId),
        title: requiredString(body.title, "title"),
        type: body.type ?? "PROPERTY_DOC",
        url: requiredString(body.url, "url"),
        period: optionalString(body.period),
        publishedAt: optionalDate(body.publishedAt),
      },
    });
    return json({ data: document }, { status: 201 });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
