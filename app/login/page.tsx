import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { isDatabaseConfigured } from "@/lib/neon";

const highlights = [
  ["Private dashboard", "Track your mood history, liked songs, and Spotify sync status in one place."],
  ["Mood input", "Describe how you feel and turn that into song suggestions instantly."],
  ["Spotify connection", "Bring your listening profile into the recommendation loop."],
];

export default async function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041108] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(29,185,84,0.34),_transparent_36%),radial-gradient(circle_at_82%_20%,_rgba(16,185,129,0.28),_transparent_34%),linear-gradient(160deg,_#041108_0%,_#0a1c12_38%,_#03170d_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-8 lg:px-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] text-base font-black text-[#03170d]">
                  M
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight">moodfyr</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                    login
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                Back to home
              </Link>
            </div>

            <div className="mt-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                moodfyr workspace
              </p>
              <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                Sign back into your mood-powered dashboard.
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/68">
                Connect Spotify, describe how you feel, and move straight back
                into recommendations that fit the moment.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/65">
                Session preview
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  ["Mood input", "Late-night calm with a bit of warmth"],
                  ["Suggested tone", "Reflective / warm / focused"],
                  ["Next action", "Open dashboard and continue listening"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm text-white/50">{label}</p>
                    <p className="mt-2 text-base font-semibold text-white/90">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <AuthForm mode="login" isDatabaseConfigured={isDatabaseConfigured} />
          </section>
        </div>
      </div>
    </main>
  );
}
