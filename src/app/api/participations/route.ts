import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { json, pagination, serverError } from "@/lib/domain";

export async function GET(request: Request) {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const page = pagination(new URL(request.url).searchParams);
    return json({ data: demoStore.investments(), ...page, source: "demo-store" });
  }

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
    if (process.env.VERCEL) {
      console.error(error);
      const page = pagination(new URL(request.url).searchParams);
      return json({ data: demoStore.investments(), ...page, source: "demo-store" });
    }
    return serverError(error);
  }
}
