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

    const contentType = request.headers.get("content-type") ?? "";
    const isFormSubmit =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");

    let identifier = "";
    let password = "";

    if (isFormSubmit) {
      const formData = await request.formData();
      identifier = String(formData.get("identifier") ?? "");
      password = String(formData.get("password") ?? "");
    } else {
      const body = (await request.json()) as {
        identifier?: string;
        password?: string;
      };
      identifier = body.identifier ?? "";
      password = body.password ?? "";
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email or username and password are required." },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    const result = await authenticateUser(identifier, password);

    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto = forwardedProto ?? "https";
    const baseUrl = host ? `${proto}://${host}` : new URL(request.url).origin;

    if (result.error || !result.user) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/login?error=auth", baseUrl));
      }

      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    await createSession(Number(result.user.id));

    if (isFormSubmit) {
      return NextResponse.redirect(new URL("/dashboard", baseUrl));
    }

    return NextResponse.json({
      user: result.user,
    });
  } catch (error) {
    console.error("Login route failed:", error);

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
      return NextResponse.redirect(new URL("/login?error=server", baseUrl));
    }

    return NextResponse.json(
      { error: "Database request failed. Check DATABASE_URL and Neon access." },
      { status: 500 },
    );
  }
}
