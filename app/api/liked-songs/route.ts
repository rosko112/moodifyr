import { NextResponse } from "next/server";
import { execute, query } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type LikedSongRow = {
  id: number;
  user_id: number;
  title: string;
  artist: string;
  spotify_url: string | null;
  preview_url: string | null;
  liked_at: string;
};

let schemaReady = false;

async function requireApiUser() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return user;
}

async function ensureSchema() {
  if (schemaReady) return;

  await execute(`
    CREATE TABLE IF NOT EXISTS liked_songs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      spotify_url TEXT,
      preview_url TEXT,
      liked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, title, artist, spotify_url)
    );
  `);
  await execute(
    "CREATE INDEX IF NOT EXISTS liked_songs_user_id_liked_at_idx ON liked_songs (user_id, liked_at DESC);",
  );
  schemaReady = true;
}

function toResponseSong(song: LikedSongRow) {
  return {
    id: String(song.id),
    userId: song.user_id,
    title: song.title,
    artist: song.artist,
    spotifyUrl: song.spotify_url,
    previewUrl: song.preview_url,
    savedAt: song.liked_at,
  };
}

export async function GET(request: Request) {
  try {
    await ensureSchema();
    const user = await requireApiUser();
    if (user instanceof NextResponse) return user;
    const rows = await query<LikedSongRow>(
      `SELECT id, user_id, title, artist, spotify_url, preview_url, liked_at
       FROM liked_songs
       WHERE user_id = $1
       ORDER BY liked_at DESC`,
      [user.id],
    );

    return NextResponse.json({ songs: rows.map(toResponseSong) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch liked songs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const user = await requireApiUser();
    if (user instanceof NextResponse) return user;
    const body = (await request.json()) as {
      title?: string;
      artist?: string;
      spotifyUrl?: string | null;
      previewUrl?: string | null;
    };

    const title = body.title?.trim();
    const artist = body.artist?.trim();

    if (!title || !artist) {
      return NextResponse.json(
        { error: "title and artist are required." },
        { status: 400 },
      );
    }

    const rows = await query<LikedSongRow>(
      `INSERT INTO liked_songs (user_id, title, artist, spotify_url, preview_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, title, artist, spotify_url) DO UPDATE
       SET preview_url = EXCLUDED.preview_url
       RETURNING id, user_id, title, artist, spotify_url, preview_url, liked_at`,
      [user.id, title, artist, body.spotifyUrl ?? null, body.previewUrl ?? null],
    );

    return NextResponse.json({ song: toResponseSong(rows[0]) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save liked song.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureSchema();
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    const user = await requireApiUser();
    if (user instanceof NextResponse) return user;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    await execute("DELETE FROM liked_songs WHERE id = $1 AND user_id = $2", [
      id,
      user.id,
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete liked song.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
