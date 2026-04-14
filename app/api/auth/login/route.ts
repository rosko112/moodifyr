import { NextResponse } from "next/server";
import { authenticateUser, createSession, ensureAuthTables } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { error: "DATABASE_URL ni nastavljen." },
      { status: 500 },
    );
  }

  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-pošta in geslo sta obvezna." },
      { status: 400 },
    );
  }

  await ensureAuthTables();

  const result = await authenticateUser(email, password);

  if (result.error || !result.user) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  await createSession(Number(result.user.id));

  return NextResponse.json({
    user: result.user,
  });
}
