<<<<<<< Updated upstream
"use client";

import { useEffect, useState } from "react";

=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
const moodChips = ["calm", "focused", "warm", "night drive", "optimistic"];

type ApiTrack = {
  title: string;
  artist: string;
  spotifyUrl: string | null;
  previewUrl: string | null;
};

type LikedSongApi = {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string | null;
};

export default function MoodInputPage() {
<<<<<<< Updated upstream
=======
=======
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const moodChips = ["calm", "focused", "warm", "night drive", "optimistic"];

type ApiTrack = {
  title: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
};

type LikedSongApi = {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string | null;
};

export default function MoodInputPage() {
  const router = useRouter();
>>>>>>> Stashed changes
  const [moodText, setMoodText] = useState("");
  const [keyword, setKeyword] = useState<string | null>(null);
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [likedIds, setLikedIds] = useState<Record<string, true>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLikedSongs() {
      try {
        const response = await fetch("/api/liked-songs", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { songs?: LikedSongApi[] };
        const next: Record<string, true> = {};
        for (const song of data.songs ?? []) {
          const key = `${song.title}-${song.artist}-${song.spotifyUrl ?? "no-url"}`;
          next[key] = true;
        }
        setLikedIds(next);
      } catch {
        // Ignore non-critical liked-state preload failures.
      }
    }

    void loadLikedSongs();
  }, []);

<<<<<<< Updated upstream
  async function handleGenerate() {
    try {
=======
  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!moodText.trim()) {
        setError("Please describe your mood before generating songs.");
        return;
      }

>>>>>>> Stashed changes
      setLoading(true);
      setError(null);

      const response = await fetch("/api/moodfyr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: moodText }),
      });

<<<<<<< Updated upstream
      const data = (await response.json()) as {
        keyword?: string;
        tracks?: ApiTrack[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate songs.");
=======
      const rawBody = await response.text();
      const data = rawBody
        ? (JSON.parse(rawBody) as {
            keyword?: string;
            tracks?: ApiTrack[];
            error?: string;
          })
        : {};

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in again to generate songs.");
        }
        throw new Error(
          data.error ??
            rawBody ??
            `Failed to generate songs (${response.status}).`,
        );
>>>>>>> Stashed changes
      }

      setKeyword(data.keyword ?? null);
      setTracks(data.tracks ?? []);
    } catch (err) {
      setKeyword(null);
      setTracks([]);
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(track: ApiTrack) {
    try {
      const response = await fetch("/api/liked-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: track.title,
          artist: track.artist,
          spotifyUrl: track.spotifyUrl,
          previewUrl: track.previewUrl,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to like track.");
      }

      const key = `${track.title}-${track.artist}-${track.spotifyUrl ?? "no-url"}`;
      setLikedIds((prev) => ({ ...prev, [key]: true }));
<<<<<<< Updated upstream
=======
      router.refresh();
>>>>>>> Stashed changes
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like track.");
    }
  }

<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  return (
    <div className="grid gap-6">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mood Input</h2>
          <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
            AI ready
          </span>
        </div>
<<<<<<< Updated upstream
        <label className="mt-4 block text-sm text-white/75" htmlFor="mood">
          Describe how you feel right now
        </label>
        <textarea
          id="mood"
          rows={7}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#1db954] focus:outline-none"
          placeholder="Example: I am a bit tired but want warm songs for an evening walk."
          value={moodText}
          onChange={(event) => setMoodText(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {moodChips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-[#1db954]"
              onClick={() => setMoodText(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-bold text-[#03220f] transition hover:bg-[#25cf61]"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate songs"}
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Results</h2>
        <p className="mt-2 text-sm text-white/70">
          Gemini mood keyword:{" "}
          <span className="font-semibold text-emerald-100">
            {keyword ?? "not generated yet"}
          </span>
        </p>
        <div className="mt-4 grid gap-3">
          {tracks.length === 0 ? (
            <div
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
            >
              No tracks yet. Submit your mood to fetch 6 random songs from Spotify playlists.
            </div>
          ) : null}
          {tracks.map((track) => (
            <div
              key={`${track.title}-${track.artist}`}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white/90">{track.title}</p>
              <p className="mt-1 text-xs text-white/65">{track.artist}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {likedIds[
                  `${track.title}-${track.artist}-${track.spotifyUrl ?? "no-url"}`
                ] ? (
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-emerald-100">
                    Liked
                  </span>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-3 py-1 text-white/85 transition hover:bg-white/10"
                    onClick={() => handleLike(track)}
                  >
                    Like
                  </button>
                )}
                {track.spotifyUrl ? (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-3 py-1 text-white/85 transition hover:bg-white/10"
                  >
                    Open on Spotify
                  </a>
                ) : null}
                {track.previewUrl ? (
                  <a
                    href={track.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-3 py-1 text-white/85 transition hover:bg-white/10"
                  >
                    Preview
                  </a>
                ) : null}
              </div>
            </div>
          ))}
=======
        <form onSubmit={handleGenerate} className="mt-4 grid gap-4">
          <label className="block text-sm text-white/75" htmlFor="mood">
            Describe how you feel right now
          </label>
          <textarea
              id="mood"
              rows={7}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#1db954] focus:outline-none"
              placeholder="Example: I am a bit tired but want warm songs for an evening walk."
              value={moodText}
              onChange={(event) => setMoodText(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // stop new line
                  e.currentTarget.form?.requestSubmit(); // submit form
                }
              }}
            />
          <div className="flex flex-wrap gap-2">
            {moodChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-[#1db954]"
                onClick={() => setMoodText(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-bold text-[#03220f] transition hover:bg-[#25cf61] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate songs"}
            </button>
          </div>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="mt-2 text-sm text-white/70">
              Gemini mood keyword:{" "}
              <span className="font-semibold text-emerald-100">
                {keyword ?? "not generated yet"}
              </span>
            </p>
          </div>
>>>>>>> Stashed changes
        </div>

        {tracks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
            No tracks yet. Submit your mood to fetch 6 random songs from Spotify playlists.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {tracks.map((track) => {
              const likedKey = `${track.title}-${track.artist}-${track.spotifyUrl ?? "no-url"}`;
              return (
                <div
                  key={`${track.title}-${track.artist}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a12] shadow-[0_20px_45px_rgba(3,18,10,0.45)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {track.imageUrl ? (
                      <img
                        src={track.imageUrl}
                        alt={`${track.title} cover`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-black/40 text-xs uppercase tracking-[0.18em] text-white/40">
                        No artwork
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c1a12] to-transparent" />
                  </div>
                  <div className="px-5 pb-5 pt-4">
                    <p className="text-base font-semibold text-white/95">
                      {track.title}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{track.artist}</p>
                    <div className="mt-4 flex flex-col gap-2 text-xs">
                      {track.spotifyUrl ? (
                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-emerald-200/80"
                        >
                          Open in Spotify
                        </a>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-full bg-[#1db954] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#03170d] transition hover:bg-[#26dd6a]"
                        onClick={() => handleLike(track)}
                        disabled={Boolean(likedIds[likedKey])}
                      >
                        {likedIds[likedKey] ? "Liked" : "Like song"}
                      </button>
                      {track.previewUrl ? (
                        <a
                          href={track.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/10"
                        >
                          Preview
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
}

