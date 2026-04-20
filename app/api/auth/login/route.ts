import { NextResponse } from "next/server";
import { authenticateUser, createSession, ensureAuthTables } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured." },
        { status: 500 },
      );
    }

    const { identifier, password } = (await request.json()) as {
      identifier?: string;
      password?: string;
    };

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email or username and password are required." },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    const result = await authenticateUser(identifier, password);

    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    await createSession(Number(result.user.id));

    return NextResponse.json({
      user: result.user,
    });
  } catch (error) {
    console.error("Login route failed:", error);

    return NextResponse.json(
      { error: "Database request failed. Check DATABASE_URL and Neon access." },
      { status: 500 },
    );
  }
}
