"use client";

import { useEffect, useState } from "react";

type LikedSong = {
  id: string;
  userId: number;
  title: string;
  artist: string;
  spotifyUrl: string | null;
  previewUrl: string | null;
  savedAt: string;
};

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function LikedSongsPage() {
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/liked-songs", { cache: "no-store" });
        const data = (await response.json()) as {
          songs?: LikedSong[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load liked songs.");
        }

        setLikedSongs(data.songs ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load liked songs.");
      }
    }

    void load();
  }, []);

  async function handleRemove(id: string) {
    try {
      const response = await fetch(`/api/liked-songs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to remove liked song.");
      }
      setLikedSongs((prev) => prev.filter((song) => song.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove liked song.");
    }
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Liked Songs</h2>
      </div>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      {likedSongs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
          No liked songs yet. Go to Mood Input and click Like on tracks you want to save.
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-white/60">
              <th className="px-3 py-2 font-medium">Song</th>
              <th className="px-3 py-2 font-medium">Artist</th>
              <th className="px-3 py-2 font-medium">Actions</th>
              <th className="px-3 py-2 font-medium">Saved</th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((song) => (
              <tr key={song.id} className="border-t border-white/10">
                <td className="px-3 py-3 font-semibold text-white/90">{song.title}</td>
                <td className="px-3 py-3 text-white/80">{song.artist}</td>
                <td className="px-3 py-3 text-white/75">
                  <div className="flex flex-wrap gap-2">
                    {song.spotifyUrl ? (
                      <a
                        href={song.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/85 transition hover:bg-white/10"
                      >
                        Open
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleRemove(song.id)}
                      className="rounded-full border border-red-300/35 px-3 py-1 text-xs text-red-200 transition hover:bg-red-300/10"
                    >
                      Remove
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3 text-white/70">{formatSavedAt(song.savedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
