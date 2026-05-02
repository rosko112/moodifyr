import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureHistorySchema, ensureSpotifyConnectionsSchema } from "@/lib/dashboard-data";
import { getCurrentSessionUser } from "@/lib/auth";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album?: { images?: Array<{ url?: string | null }> };
  external_urls?: { spotify?: string };
  preview_url?: string | null;
};

type TrackResult = {
  title: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
};

type SpotifyConnectionRow = {
  access_token: string;
  refresh_token: string | null;
  token_type: string | null;
  scope: string | null;
  expires_at: string | null;
};

type SpotifyPlaylistItem = {
  id?: string;
};

type SpotifySearchResponse = {
  playlists?: {
    items?: SpotifyPlaylistItem[];
  };
};

type SpotifyTracksResponse = {
  items?: {
    track?: SpotifyTrack | null;
  }[];
};

const GEMINI_MODEL = "gemini-2.5-flash-lite";

/* ---------------- ENV ---------------- */

function readRequiredEnv(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  throw new Error(`Missing env vars: ${keys.join(", ")}`);
}

/* ---------------- MOOD ---------------- */

function sanitizeMood(text: string) {
  const word = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .find(Boolean);

  return word && word.length >= 2 ? word : "calm";
}

/* ---------------- UTIL ---------------- */

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ---------------- GEMINI ---------------- */

async function extractMoodKeyword(inputText: string) {
  const apiKey = readRequiredEnv([
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
  ]);

  const prompt = `
Extract ONE mood word.
Return only lowercase word.

Text: ${inputText}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
      }),
    }
  );

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "calm";

  return sanitizeMood(text);
}

/* ---------------- AUTH HELPERS ---------------- */

function parseUserId(user: unknown): number | null {
  const id = parseInt(String((user as any)?.id), 10);
  return Number.isNaN(id) ? null : id;
}

/* ---------------- SPOTIFY ---------------- */

async function getUserSpotifyAccessToken(userId: number) {
  await ensureSpotifyConnectionsSchema();

  const rows = await query<SpotifyConnectionRow>(
    `SELECT * FROM spotify_connections WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  const conn = rows[0];

  if (!conn?.access_token) {
    throw new Error("Spotify not connected.");
  }

  return conn.access_token;
}

/* ---------------- PLAYLIST SEARCH ---------------- */

async function searchPlaylists(token: string, keyword: string): Promise<string[]> {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", keyword);
  url.searchParams.set("type", "playlist");
  url.searchParams.set("limit", "6");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as SpotifySearchResponse;

  return (data.playlists?.items ?? [])
    .map((p) => p.id)
    .filter((id): id is string => typeof id === "string");
}

/* ---------------- TRACKS ---------------- */

async function getPlaylistTracks(token: string, id: string): Promise<SpotifyTrack[]> {
  const url = new URL(`https://api.spotify.com/v1/playlists/${id}/tracks`);
  url.searchParams.set("limit", "50");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as SpotifyTracksResponse;

  return (data.items ?? [])
    .map((i) => i.track)
    .filter((t): t is SpotifyTrack => Boolean(t?.name));
}

/* ---------------- MAP ---------------- */

function mapTrack(t: SpotifyTrack): TrackResult {
  return {
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    imageUrl: t.album?.images?.[0]?.url ?? null,
    spotifyUrl: t.external_urls?.spotify ?? null,
    previewUrl: t.preview_url ?? null,
  };
}

/* ---------------- HISTORY ---------------- */

async function saveHistory(
  userId: number,
  moodText: string,
  keyword: string,
  tracks: TrackResult[]
) {
  await ensureHistorySchema();

  await query(
    `INSERT INTO user_history (user_id, mood_text, mood_keyword, recommended_tracks)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [userId, moodText, keyword, JSON.stringify(tracks)]
  );
}

/* ---------------- MAIN ROUTE ---------------- */

export async function POST(req: Request) {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = parseUserId(user);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = (await req.json()) as { text?: string };
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json({ error: "Missing mood text" }, { status: 400 });
    }

    const keyword = await extractMoodKeyword(text);

    const token = await getUserSpotifyAccessToken(userId);

    const playlists = await searchPlaylists(token, keyword);

    if (!playlists.length) {
      await saveHistory(userId, text, keyword, []);
      return NextResponse.json({ keyword, tracks: [] });
    }

    const selected = shuffle(playlists).slice(0, 3);

    const tracks: SpotifyTrack[] = [];

    for (const id of selected) {
      const playlistTracks = await getPlaylistTracks(token, id);
      tracks.push(...playlistTracks);
    }

    const unique = new Map<string, SpotifyTrack>();

    for (const t of tracks) {
      unique.set(`${t.name}-${t.artists[0]?.name}`, t);
    }

    const result = shuffle([...unique.values()])
      .slice(0, 6)
      .map(mapTrack);

    await saveHistory(userId, text, keyword, result);

    return NextResponse.json({ keyword, tracks: result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}