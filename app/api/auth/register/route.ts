import { NextResponse } from "next/server";
import { createSession, createUser, ensureAuthTables } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured." },
        { status: 500 },
      );
    }

    const { email, username, password } = (await request.json()) as {
      email?: string;
      username?: string;
      password?: string;
    };

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required." },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-32 characters and use only letters, numbers, or underscores.",
        },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    const result = await createUser(email, username, password);

    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await createSession(Number(result.user.id));

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
      },
    });
  } catch (error) {
    console.error("Register route failed:", error);

    return NextResponse.json(
      { error: "Database request failed. Check DATABASE_URL and Neon access." },
      { status: 500 },
    );
  }
}
