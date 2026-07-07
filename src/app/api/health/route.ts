import { db } from "../../../lib/db";
import { json, serverError } from "../../../lib/domain";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return json({ ok: true, database: "ready" });
  } catch (error) {
    return serverError(error);
  }
}
