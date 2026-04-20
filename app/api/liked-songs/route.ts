import { NextResponse } from "next/server";
import { execute, query } from "@/lib/db";

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

function getUserId(req: Request) {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("userId");
  const parsedQuery = Number(fromQuery);
  if (Number.isInteger(parsedQuery) && parsedQuery > 0) return parsedQuery;

  const fromHeader = req.headers.get("x-user-id");
  const parsedHeader = Number(fromHeader);
  if (Number.isInteger(parsedHeader) && parsedHeader > 0) return parsedHeader;

  const fromEnv = Number(process.env.MOODFYR_DEFAULT_USER_ID ?? "1");
  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : 1;
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
    const userId = getUserId(request);
    const rows = await query<LikedSongRow>(
      `SELECT id, user_id, title, artist, spotify_url, preview_url, liked_at
       FROM liked_songs
       WHERE user_id = $1
       ORDER BY liked_at DESC`,
      [userId],
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
    const userId = getUserId(request);
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
      [userId, title, artist, body.spotifyUrl ?? null, body.previewUrl ?? null],
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
    const userId = getUserId(request);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    await execute("DELETE FROM liked_songs WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete liked song.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
