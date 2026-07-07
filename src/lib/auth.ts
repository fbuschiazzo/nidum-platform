import { db } from "@/lib/db";

export async function verifyDemoCredentials(username: string, password: string) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user || user.password !== password) return null;

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

