import { db } from "../../../lib/db";
import { json, serverError } from "../../../lib/domain";

export async function GET() {
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    return json({ ok: true, database: "demo-store", runtime: "vercel" });
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return json({ ok: true, database: "ready" });
  } catch (error) {
    if (process.env.VERCEL) {
      console.error(error);
      return json({ ok: true, database: "demo-store", warning: "database unavailable" });
    }
    return serverError(error);
  }
}
