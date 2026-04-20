import Link from "next/link";
import DashboardNav from "./_components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <p className="text-lg font-semibold tracking-tight">moodify</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                dashboard
              </p>
            </div>
          </div>

          <DashboardNav />

          <div className="mt-8 rounded-2xl border border-white/12 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
              Spotify
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-100">
              Connected
            </p>
            <p className="mt-2 text-sm text-white/65">
              Last refresh 2m ago. Personalization active.
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Moodify Workspace
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, your mood is now your playlist.
                </h1>
              </div>
              <Link
                href="/how-it-works"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                How it works
              </Link>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
