import { NextResponse } from "next/server";
import { ensureAuthTables, getCurrentSessionUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

export async function GET() {
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
}
