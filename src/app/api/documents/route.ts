import { db } from "../../../lib/db";
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
