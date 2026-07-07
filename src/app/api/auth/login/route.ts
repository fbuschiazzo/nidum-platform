import { db } from "@/lib/db";
import { badRequest, json, readJson, requiredString, serverError } from "@/lib/domain";

type LoginBody = {
  username?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<LoginBody>(request);
    const username = requiredString(body.username, "username");
    const password = requiredString(body.password, "password");
    const user = await db.user.findFirst({
      where: { username, password },
      select: { id: true, username: true, name: true, role: true, simulatedWallet: true },
    });

    if (!user) return badRequest("invalid credentials");
    return json({ data: user });
  } catch (error) {
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
