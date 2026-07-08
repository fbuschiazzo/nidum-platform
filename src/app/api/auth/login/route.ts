import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-store";
import { badRequest, json, readJson, requiredString, serverError } from "@/lib/domain";

type LoginBody = {
  username?: unknown;
  password?: unknown;
};

function sessionResponse(user: { id: string; role: string }, payload: unknown) {
  const response = json(payload);
  response.cookies.set("nidum_session", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  response.cookies.set("nidum_role", user.role, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function POST(request: Request) {
  let username = "";
  let password = "";

  try {
    const body = await readJson<LoginBody>(request);
    username = requiredString(body.username, "username");
    password = requiredString(body.password, "password");

    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      const demoUser = demoStore.authenticate(username, password);
      if (!demoUser) return badRequest("invalid credentials");
      return sessionResponse(demoUser, { data: demoUser, source: "demo-store" });
    }

    const user = await db.user.findFirst({
      where: { username, password },
      select: { id: true, username: true, name: true, role: true, simulatedWallet: true },
    });

    if (!user) return badRequest("invalid credentials");
    return sessionResponse(user, { data: user });
  } catch (error) {
    if (process.env.VERCEL) {
      const demoUser = demoStore.authenticate(username, password);
      if (demoUser) return sessionResponse(demoUser, { data: demoUser, source: "demo-store" });
    }
    return error instanceof Error ? badRequest(error.message) : serverError(error);
  }
}
