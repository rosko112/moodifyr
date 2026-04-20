import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout route failed:", error);

    return NextResponse.json(
      { error: "Odjava ni uspela." },
      { status: 500 },
    );
  }
}
