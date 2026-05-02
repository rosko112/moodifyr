import { execute, query } from "@/lib/db";

type CountRow = { count: string };
type UserRow = { username: string | null };
type LastMoodRow = { mood_keyword: string | null };
type LastDateRow = { liked_at: string | null };
type SpotifyConnectionRow = {
  spotify_user_id: string;
  display_name: string | null;
  updated_at: string;
};
type HistoryRow = {
  id: number;
  mood_text: string;
  mood_keyword: string;
  recommended_tracks: unknown;
  created_at: string;
};
<<<<<<< Updated upstream
=======
type RecommendedTrack = {
  title?: string;
  artist?: string;
  imageUrl?: string | null;
  spotifyUrl?: string | null;
};
>>>>>>> Stashed changes
type ExistsRow = { exists: string | null };

export function getDefaultUserId() {
  const userId = Number(process.env.MOODFYR_DEFAULT_USER_ID ?? "1");
  return Number.isInteger(userId) && userId > 0 ? userId : 1;
}

export async function ensureLikedSongsSchema() {
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
}

export async function ensureHistorySchema() {
  await execute(`
    CREATE TABLE IF NOT EXISTS user_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mood_text TEXT NOT NULL,
      mood_keyword VARCHAR(50) NOT NULL,
      recommended_tracks JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  await execute(
    "CREATE INDEX IF NOT EXISTS user_history_user_id_created_at_idx ON user_history (user_id, created_at DESC);",
  );
}

export async function ensureSpotifyConnectionsSchema() {
  await execute(`
    CREATE TABLE IF NOT EXISTS spotify_connections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      spotify_user_id TEXT NOT NULL,
      display_name TEXT,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      token_type TEXT,
      scope TEXT,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}

async function tableExists(name: string) {
  const rows = await query<ExistsRow>(
    "SELECT to_regclass($1) AS exists",
    [`public.${name}`],
  );
  return Boolean(rows[0]?.exists);
}

export async function getDashboardOverview(userId: number) {
  const [hasLikedSongs, hasHistory] = await Promise.all([
    tableExists("liked_songs"),
    tableExists("user_history"),
  ]);

  if (!hasLikedSongs && !hasHistory) {
    return { likedSongs: 0, moodsLogged: 0, tracksPerMood: 0, lastMood: null };
  }

  const [likedRows, historyRows, lastMoodRows] = await Promise.all([
    hasLikedSongs
      ? query<CountRow>("SELECT COUNT(*)::text AS count FROM liked_songs WHERE user_id = $1", [
          userId,
        ])
      : Promise.resolve([{ count: "0" }]),
    hasHistory
      ? query<CountRow>("SELECT COUNT(*)::text AS count FROM user_history WHERE user_id = $1", [
          userId,
        ])
      : Promise.resolve([{ count: "0" }]),
    hasHistory
      ? query<LastMoodRow>(
          "SELECT mood_keyword FROM user_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
          [userId],
        )
      : Promise.resolve([{ mood_keyword: null }]),
  ]);

  const likedSongs = Number(likedRows[0]?.count ?? "0");
  const moodsLogged = Number(historyRows[0]?.count ?? "0");
  const tracksPerMood = moodsLogged > 0 ? Number((likedSongs / moodsLogged).toFixed(1)) : 0;

  return {
    likedSongs,
    moodsLogged,
    tracksPerMood,
    lastMood: lastMoodRows[0]?.mood_keyword ?? null,
  };
}

export async function getDashboardHistory(userId: number) {
  const hasHistory = await tableExists("user_history");
  if (!hasHistory) return [];

  const rows = await query<HistoryRow>(
    `SELECT id, mood_text, mood_keyword, recommended_tracks, created_at
     FROM user_history
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [userId],
  );

  return rows.map((row) => {
    const tracks = Array.isArray(row.recommended_tracks)
      ? row.recommended_tracks
      : [];
<<<<<<< Updated upstream
=======
    const normalizedTracks = tracks
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
        (track): track is {
          title: string;
          artist: string;
          imageUrl: string | null;
          spotifyUrl: string | null;
        } => Boolean(track),
      );
>>>>>>> Stashed changes
    return {
      id: String(row.id),
      moodText: row.mood_text,
      moodKeyword: row.mood_keyword,
      createdAt: row.created_at,
<<<<<<< Updated upstream
      tracksCount: tracks.length,
=======
      tracksCount: normalizedTracks.length,
      tracks: normalizedTracks,
>>>>>>> Stashed changes
    };
  });
}

export async function getSpotifySyncData(userId: number) {
  const [hasLikedSongs, hasSpotifyConnections] = await Promise.all([
    tableExists("liked_songs"),
    tableExists("spotify_connections"),
  ]);

  const [countRows, lastRows, userRows, connectionRows] = await Promise.all([
    hasLikedSongs
      ? query<CountRow>("SELECT COUNT(*)::text AS count FROM liked_songs WHERE user_id = $1", [
          userId,
        ])
      : Promise.resolve([{ count: "0" }]),
    hasLikedSongs
      ? query<LastDateRow>(
          "SELECT liked_at FROM liked_songs WHERE user_id = $1 ORDER BY liked_at DESC LIMIT 1",
          [userId],
        )
      : Promise.resolve([{ liked_at: null }]),
    query<UserRow>("SELECT username FROM users WHERE id = $1 LIMIT 1", [userId]),
    hasSpotifyConnections
      ? query<SpotifyConnectionRow>(
          `SELECT spotify_user_id, display_name, updated_at
           FROM spotify_connections
           WHERE user_id = $1
           LIMIT 1`,
          [userId],
        )
      : Promise.resolve([]),
  ]);

  const hasSpotifyConfig = Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET,
  );

  return {
    account: userRows[0]?.username ?? null,
    hasSpotifyConfig,
    likedSongsCount: Number(countRows[0]?.count ?? "0"),
    lastSyncAt: lastRows[0]?.liked_at ?? null,
    spotifyConnected: Boolean(connectionRows[0]),
    spotifyAccount:
      connectionRows[0]?.display_name ?? connectionRows[0]?.spotify_user_id ?? null,
    spotifyConnectedAt: connectionRows[0]?.updated_at ?? null,
  };
}
