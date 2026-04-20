import Link from "next/link";
import { getDashboardOverview, getDefaultUserId } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const stats = await getDashboardOverview(getDefaultUserId());

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Today at a glance</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Moods logged", String(stats.moodsLogged)],
            ["Liked songs", String(stats.likedSongs)],
            ["Tracks per mood", stats.moodsLogged > 0 ? String((stats.likedSongs / stats.moodsLogged).toFixed(1)) : "0"],
            ["Last mood", stats.lastMood ?? "none"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/70">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-100">
                {value}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <div className="mt-4 grid gap-3">
          <Link
            href="/dashboard/mood-input"
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-[#1db954] hover:bg-white/10"
          >
            Open Mood Input
          </Link>
          <Link
            href="/dashboard/liked-songs"
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-[#1db954] hover:bg-white/10"
          >
            Open Liked Songs
          </Link>
          <Link
            href="/dashboard/history"
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-[#1db954] hover:bg-white/10"
          >
            Open Mood History
          </Link>
          <Link
            href="/dashboard/spotify-sync"
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-[#1db954] hover:bg-white/10"
          >
            Open Spotify Sync
          </Link>
        </div>
      </article>
    </div>
  );
}
