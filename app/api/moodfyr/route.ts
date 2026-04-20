import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureHistorySchema, getDefaultUserId } from "@/lib/dashboard-data";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls?: { spotify?: string };
  preview_url?: string | null;
};

type TrackResult = {
  title: string;
  artist: string;
  spotifyUrl: string | null;
  previewUrl: string | null;
};

const GEMINI_MODEL = "gemini-2.0-flash";

function readRequiredEnv(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  throw new Error(`Missing required env. Tried: ${keys.join(", ")}`);
}

function sanitizeMood(text: string) {
  const firstWord = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .find(Boolean);

  return firstWord && firstWord.length >= 2 ? firstWord : "calm";
}

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function extractMoodKeyword(inputText: string) {
  const geminiApiKey = readRequiredEnv([
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
  ]);

  const prompt = [
    "You are a mood classifier.",
    "Extract exactly one English mood word from the user text.",
    "Examples: happy, sad, angry, calm, focused, anxious, nostalgic.",
    "Return only one lowercase word and nothing else.",
    `User text: ${inputText}`,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "calm";
  return sanitizeMood(rawText);
}

async function getSpotifyToken() {
  const clientId = readRequiredEnv([
    "SPOTIFY_CLIENT_ID",
    "NEXT_PUBLIC_SPOTIFY_CLIENT_ID",
  ]);
  const clientSecret = readRequiredEnv(["SPOTIFY_CLIENT_SECRET"]);
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!tokenResponse.ok) {
    const body = await tokenResponse.text();
    throw new Error(
      `Spotify token request failed (${tokenResponse.status}): ${body}`,
    );
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  return tokenData.access_token;
}

async function searchPlaylists(accessToken: string, keyword: string) {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", keyword);
  url.searchParams.set("type", "playlist");
  url.searchParams.set("limit", "8");
  url.searchParams.set("market", "US");

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Spotify search failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    playlists?: { items?: Array<{ id?: string | null }> };
  };
  return (data.playlists?.items ?? [])
    .map((item) => item.id)
    .filter((id): id is string => Boolean(id));
}

async function getPlaylistTracks(accessToken: string, playlistId: string) {
  const url = new URL(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  );
  url.searchParams.set("limit", "50");
  url.searchParams.set(
    "fields",
    "items(track(name,artists(name),external_urls,preview_url))",
  );
  url.searchParams.set("market", "US");

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as {
    items?: Array<{ track?: SpotifyTrack | null }>;
  };

  return (data.items ?? [])
    .map((item) => item.track)
    .filter((track): track is SpotifyTrack => Boolean(track?.name));
}

function toTrackResult(track: SpotifyTrack): TrackResult {
  return {
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    spotifyUrl: track.external_urls?.spotify ?? null,
    previewUrl: track.preview_url ?? null,
  };
}

function getUserId(req: Request) {
  const url = new URL(req.url);
  const fromQuery = Number(url.searchParams.get("userId"));
  if (Number.isInteger(fromQuery) && fromQuery > 0) return fromQuery;

  const fromHeader = Number(req.headers.get("x-user-id"));
  if (Number.isInteger(fromHeader) && fromHeader > 0) return fromHeader;

  return getDefaultUserId();
}

async function saveMoodHistory(
  request: Request,
  moodText: string,
  moodKeyword: string,
  tracks: TrackResult[],
) {
  await ensureHistorySchema();
  const userId = getUserId(request);
  await query(
    `INSERT INTO user_history (user_id, mood_text, mood_keyword, recommended_tracks)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [userId, moodText, moodKeyword, JSON.stringify(tracks)],
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string };
    const text = body.text?.trim();

    if (!text || text.length < 2) {
      return NextResponse.json(
        { error: "Mood text is required." },
        { status: 400 },
      );
    }

    const keyword = await extractMoodKeyword(text);
    const spotifyToken = await getSpotifyToken();
    const playlistIds = await searchPlaylists(spotifyToken, keyword);

    if (!playlistIds.length) {
      await saveMoodHistory(request, text, keyword, []);
      return NextResponse.json({ keyword, tracks: [] });
    }

    const shuffledPlaylists = shuffle(playlistIds).slice(0, 4);
    const allTracks: SpotifyTrack[] = [];

    for (const playlistId of shuffledPlaylists) {
      const tracks = await getPlaylistTracks(spotifyToken, playlistId);
      allTracks.push(...tracks);
      if (allTracks.length >= 60) break;
    }

    const unique = new Map<string, SpotifyTrack>();
    for (const track of allTracks) {
      const key = `${track.name}::${track.artists.map((a) => a.name).join(",")}`;
      if (!unique.has(key)) unique.set(key, track);
    }

    const randomSix = shuffle(Array.from(unique.values()))
      .slice(0, 6)
      .map(toTrackResult);

    await saveMoodHistory(request, text, keyword, randomSix);

    return NextResponse.json({
      keyword,
      tracks: randomSix,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
