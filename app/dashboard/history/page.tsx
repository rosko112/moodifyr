"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type HistoryTrack = {
  title: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
};

type HistoryEntry = {
  id: string;
  moodText: string;
  moodKeyword: string;
  createdAt: string;
  tracks: HistoryTrack[];
};

type FilterState = {
  search: string;
  mood: string;
  range: string;
};

const defaultFilters: FilterState = {
  search: "",
  mood: "all",
  range: "all",
};

const PAGE_SIZE = 6;

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await fetch("/api/history", { cache: "no-store" });
        const data = (await response.json()) as {
          entries?: HistoryEntry[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load history.");
        }

        if (active) {
          setEntries(data.entries ?? []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load history.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  const moodOptions = useMemo(() => {
    const unique = new Set(entries.map((entry) => entry.moodKeyword));
    return ["all", ...Array.from(unique.values())];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    const now = Date.now();
    const rangeDays =
      filters.range === "7"
        ? 7
        : filters.range === "30"
          ? 30
          : filters.range === "90"
            ? 90
            : null;

    return entries.filter((entry) => {
      if (filters.mood !== "all" && entry.moodKeyword !== filters.mood) {
        return false;
      }

      if (rangeDays) {
        const cutoff = now - rangeDays * 24 * 60 * 60 * 1000;
        const createdAt = new Date(entry.createdAt).getTime();
        if (Number.isNaN(createdAt) || createdAt < cutoff) {
          return false;
        }
      }

      if (searchTerm) {
        const combined = [
          entry.moodText,
          entry.moodKeyword,
          ...entry.tracks.map((track) => `${track.title} ${track.artist}`),
        ]
          .join(" ")
          .toLowerCase();
        return combined.includes(searchTerm);
      }

      return true;
    });
  }, [entries, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pagedEntries = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [clampedPage, filteredEntries]);

  async function handleDelete(entryId: string) {
    try {
      setDeletingId(entryId);
      const response = await fetch(`/api/history?id=${encodeURIComponent(entryId)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete entry.");
      }
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
              moodify
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Your mood history
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Review older entries and the songs saved with them.
            </p>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.32em] text-emerald-200/50">
              showing {filteredEntries.length === 0 ? 0 : (clampedPage - 1) * PAGE_SIZE + 1}-
              {Math.min(clampedPage * PAGE_SIZE, filteredEntries.length)} of {filteredEntries.length} entries | page {clampedPage} of {totalPages}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr_0.9fr_auto_auto] lg:items-center">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-emerald-200/60">
              Search
            </p>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80 placeholder:text-white/30"
              placeholder="Search notes or moods"
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-emerald-200/60">
              Mood
            </p>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80"
              value={draftFilters.mood}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  mood: event.target.value,
                }))
              }
            >
              {moodOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All moods" : option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-emerald-200/60">
              Time
            </p>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80"
              value={draftFilters.range}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  range: event.target.value,
                }))
              }
            >
              <option value="all">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            type="button"
            className="mt-6 rounded-full bg-[#1db954] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#03170d]"
            onClick={() => {
              setFilters(draftFilters);
              setPage(1);
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="mt-6 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70"
            onClick={() => {
              setDraftFilters(defaultFilters);
              setFilters(defaultFilters);
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-300/20 bg-rose-300/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          Loading history...
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          No mood history yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {pagedEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl border border-white/10 bg-[#0c1a12]/80 p-6 backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-200/60">
                    Mood: {entry.moodKeyword}
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    {formatTime(entry.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-rose-200/30 px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-rose-100/90"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  {deletingId === entry.id ? "Deleting..." : "Delete entry"}
                </button>
              </div>

              <p className="mt-4 text-sm text-white/80">{entry.moodText}</p>

              <div className="mt-6">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-200/60">
                  Recommended songs
                </p>
                {entry.tracks.length === 0 ? (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
                    No songs saved for this entry.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {entry.tracks.map((track) => (
                      <div
                        key={`${entry.id}-${track.title}-${track.artist}`}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a12]"
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
                            <div className="flex h-full w-full items-center justify-center bg-black/40 text-[0.55rem] uppercase tracking-[0.2em] text-white/40">
                              No art
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c1a12] to-transparent" />
                        </div>
                        <div className="px-5 pb-5 pt-4">
                          <p className="text-base font-semibold text-white/95">
                            {track.title}
                          </p>
                          <p className="mt-1 text-sm text-white/60">
                            {track.artist}
                          </p>
                          {track.spotifyUrl ? (
                            <a
                              href={track.spotifyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-200/80"
                            >
                              Open in Spotify
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.22em] text-white/70">
            <span>
              page {clampedPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-white/20 px-3 py-2 font-semibold text-white/80 disabled:opacity-40"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={clampedPage <= 1}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 px-3 py-2 font-semibold text-white/80 disabled:opacity-40"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={clampedPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
