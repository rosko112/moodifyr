import { NextResponse } from "next/server";
import { ensureAuthTables, getCurrentSessionUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

export async function GET() {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json({
        configured: false,
        user: null,
      });
    }

    await ensureAuthTables();
    const user = await getCurrentSessionUser();

    return NextResponse.json({
      configured: true,
      user,
    });
  } catch (error) {
    console.error("Session route failed:", error);

    return NextResponse.json(
      {
        configured: true,
        user: null,
        error: "Could not read the current session from the database.",
      },
      { status: 500 },
    );
  }
}
