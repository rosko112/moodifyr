import { getSpotifySyncData } from "@/lib/dashboard-data";
import Link from "next/link";
import { requireSessionUser } from "@/lib/auth";

function formatTime(value: string | null) {
  if (!value) return "none";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "none";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapErrorMessage(errorCode: string | null) {
  if (!errorCode) return null;
  if (errorCode === "config") return "Spotify configuration is missing.";
  if (errorCode === "invalid_state") return "OAuth state is invalid or expired. Try connect again.";
  if (errorCode === "token_exchange") return "Spotify token exchange failed.";
  if (errorCode === "profile_fetch") return "Could not fetch Spotify profile.";
  if (errorCode === "missing_spotify_table")
    return "Database table spotify_connections is missing.";
  if (errorCode === "spotify_denied") return "Spotify permission was denied.";
  if (errorCode === "internal") return "Unexpected server error during Spotify callback.";
  return `Spotify error: ${errorCode}`;
}

export default async function SpotifySyncPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const errorCode = Array.isArray(params.error) ? params.error[0] : params.error ?? null;
  const errorMessage = mapErrorMessage(errorCode);
  const user = await requireSessionUser();
  const sync = await getSpotifySyncData(user.id);
  const syncItems = [
    { label: "Account", value: sync.account ?? "unknown" },
    {
      label: "Spotify API",
      value: sync.hasSpotifyConfig ? "configured" : "not configured",
    },
    {
      label: "Spotify linked account",
      value: sync.spotifyAccount ?? "none",
    },
    {
      label: "Connection status",
      value: sync.spotifyConnected ? "connected" : "not connected",
    },
    { label: "Liked songs in DB", value: String(sync.likedSongsCount) },
    { label: "Last like saved", value: formatTime(sync.lastSyncAt) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Spotify Sync Status</h2>
        {errorMessage ? (
          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-4 grid gap-3">
          {syncItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/70">
                {item.label}
              </p>
              <p className="mt-2 text-sm text-white/85">{item.value}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Connect Spotify</h2>
        <div className="mt-4 space-y-3">
          <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
            {sync.spotifyConnected
              ? `Connected as ${sync.spotifyAccount ?? "spotify user"}. Last update: ${formatTime(sync.spotifyConnectedAt)}.`
              : "No Spotify account connected yet."}
          </p>
          <Link
            href="/api/spotify/connect"
            className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-emerald-200/40 bg-[#1ed760] px-8 py-5 text-base font-black tracking-wide text-[#03220f] shadow-[0_18px_45px_rgba(30,215,96,0.45)] transition hover:scale-[1.01] hover:bg-[#25e56b] hover:shadow-[0_24px_60px_rgba(30,215,96,0.55)] sm:w-auto sm:rounded-full"
          >
            {sync.spotifyConnected ? "Reconnect Spotify" : "Connect Spotify"}
          </Link>
        </div>
      </article>
    </div>
  );
}
