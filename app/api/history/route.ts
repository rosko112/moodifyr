import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureHistorySchema } from "@/lib/dashboard-data";
import { getCurrentSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type HistoryRow = {
  id: number;
  mood_text: string;
  mood_keyword: string;
  recommended_tracks: unknown;
  created_at: string;
};

type RecommendedTrack = {
  title?: string;
  artist?: string;
  imageUrl?: string | null;
  spotifyUrl?: string | null;
};

type HistoryTrack = {
  title: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
};

function normalizeTracks(raw: unknown): HistoryTrack[] {
  const tracks = Array.isArray(raw) ? raw : [];
  return tracks
    .map((track) => {
      if (!track || typeof track !== "object") {
        return null;
      }
      const candidate = track as RecommendedTrack;
      if (!candidate.title && !candidate.artist) {
        return null;
      }
      return {
        title: candidate.title ?? "Unknown",
        artist: candidate.artist ?? "Unknown",
        imageUrl: candidate.imageUrl ?? null,
        spotifyUrl: candidate.spotifyUrl ?? null,
      };
    })
    .filter(
      (track): track is HistoryTrack => Boolean(track),
    );
}

export async function GET() {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    await ensureHistorySchema();

    const rows = await query<HistoryRow>(
      `SELECT id, mood_text, mood_keyword, recommended_tracks, created_at
       FROM user_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [user.id],
    );

    const entries = rows.map((row) => {
      const tracks = normalizeTracks(row.recommended_tracks);
      return {
        id: String(row.id),
        moodText: row.mood_text,
        moodKeyword: row.mood_keyword,
        createdAt: row.created_at,
        tracks,
      };
    });

    return NextResponse.json({ entries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load history.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    await ensureHistorySchema();

    await query(
      "DELETE FROM user_history WHERE id = $1 AND user_id = $2",
      [id, user.id],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete history entry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
