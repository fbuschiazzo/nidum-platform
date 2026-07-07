import { db } from "@/lib/db";
import { json, pagination, serverError } from "@/lib/domain";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = pagination(searchParams);
    const participations = await db.investment.findMany({
      ...page,
      where: {
        userId: searchParams.get("userId") ?? undefined,
        opportunityId: searchParams.get("opportunityId") ?? undefined,
        status: searchParams.get("status") ? (searchParams.get("status") as never) : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        opportunity: { include: { property: true } },
        listings: {
          orderBy: { createdAt: "desc" },
          include: {
            seller: true,
            offers: {
              orderBy: { createdAt: "desc" },
              include: { buyer: true },
            },
          },
        },
      },
    });

    return json({ data: participations, ...page });
  } catch (error) {
    return serverError(error);
  }
}

