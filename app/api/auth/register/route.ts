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

    const contentType = request.headers.get("content-type") ?? "";
    const isFormSubmit =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");

    let email = "";
    let username = "";
    let password = "";

    if (isFormSubmit) {
      const formData = await request.formData();
      email = String(formData.get("email") ?? "");
      username = String(formData.get("username") ?? "");
      password = String(formData.get("password") ?? "");
    } else {
      const body = (await request.json()) as {
        email?: string;
        username?: string;
        password?: string;
      };
      email = body.email ?? "";
      username = body.username ?? "";
      password = body.password ?? "";
    }

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

    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto = forwardedProto ?? "https";
    const baseUrl = host ? `${proto}://${host}` : new URL(request.url).origin;

    if (result.error || !result.user) {
      if (isFormSubmit) {
        return NextResponse.redirect(
          new URL("/register?error=validation", baseUrl),
        );
      }

      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await createSession(Number(result.user.id));

    if (isFormSubmit) {
      return NextResponse.redirect(new URL("/dashboard", baseUrl));
    }

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
      },
    });
  } catch (error) {
    console.error("Register route failed:", error);

    const contentType = request.headers.get("content-type") ?? "";
    const isFormSubmit =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto = forwardedProto ?? "https";
    const baseUrl = host ? `${proto}://${host}` : new URL(request.url).origin;

    if (isFormSubmit) {
      return NextResponse.redirect(
        new URL("/register?error=server", baseUrl),
      );
    }

    return NextResponse.json(
      { error: "Database request failed. Check DATABASE_URL and Neon access." },
      { status: 500 },
    );
  }
}
