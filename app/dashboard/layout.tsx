import Link from "next/link";
import DashboardNav from "./_components/dashboard-nav";
import LogoutButton from "./_components/logout-button";
import { getSpotifySyncData } from "@/lib/dashboard-data";
import { requireSessionUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();
  const sync = await getSpotifySyncData(user.id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041108] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(29,185,84,0.34),_transparent_36%),radial-gradient(circle_at_82%_20%,_rgba(16,185,129,0.28),_transparent_34%),linear-gradient(160deg,_#041108_0%,_#0a1c12_38%,_#03170d_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[260px_1fr] lg:px-10">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] text-base font-black text-[#03170d]">
              M
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">moodfyr</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                dashboard
              </p>
            </div>
          </div>

          <DashboardNav />

<<<<<<< Updated upstream
          <Link
            href="/api/spotify/connect"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-4 text-sm font-black tracking-wide text-[#03220f] shadow-[0_18px_45px_rgba(30,215,96,0.45)] transition hover:scale-[1.01] hover:bg-[#25e56b] hover:shadow-[0_24px_60px_rgba(30,215,96,0.55)]"
          >
            Connect Spotify
          </Link>

=======
<<<<<<< Updated upstream
=======
          {!sync.spotifyConnected ? (
            <a
              href="/api/spotify/connect"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-4 text-sm font-black tracking-wide text-[#03220f] shadow-[0_18px_45px_rgba(30,215,96,0.45)] transition hover:scale-[1.01] hover:bg-[#25e56b] hover:shadow-[0_24px_60px_rgba(30,215,96,0.55)]"
            >
              Connect Spotify
            </a>
          ) : null}

>>>>>>> Stashed changes
>>>>>>> Stashed changes
          <div className="mt-8 rounded-2xl border border-white/12 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
              Spotify
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-100">
              {sync.spotifyConnected
                ? `Connected: ${sync.spotifyAccount ?? "spotify user"}`
                : sync.hasSpotifyConfig
                  ? "Not connected"
                  : "Not configured"}
            </p>
            <p className="mt-2 text-sm text-white/65">
              Stored liked songs: {sync.likedSongsCount}
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  moodfyr Workspace
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, {user.username}.
                </h1>
                <p className="mt-2 text-sm text-white/60">{user.email}</p>
              </div>
<<<<<<< Updated upstream
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/api/spotify/connect"
                  className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
                >
                  Connect Spotify
                </Link>
=======
<<<<<<< Updated upstream
              <Link
                href="/how-it-works"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                How it works
              </Link>
=======
              <div className="flex flex-wrap items-center gap-3">
                {!sync.spotifyConnected ? (
                  <a
                    href="/api/spotify/connect"
                    className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
                  >
                    Connect Spotify
                  </a>
                ) : null}
>>>>>>> Stashed changes
                <Link
                  href="/how-it-works"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
                >
                  How it works
                </Link>
                <LogoutButton />
              </div>
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
