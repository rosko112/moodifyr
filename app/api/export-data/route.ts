import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const sessionUser = await requireSessionUser();

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  const user = userData[0];

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: {
      id: user?.id,
      username: user?.username,
      email: user?.email,
      createdAt: user?.created_at,
      status: user?.status,
      avatarUrl: user?.avatar_url,
    },
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="moodfyr-export.json"`,
    },
  });
}