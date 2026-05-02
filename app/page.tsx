import Link from "next/link";
<<<<<<< Updated upstream
import { AuthStatus } from "@/components/auth-status";
import { PublicHeaderActions } from "@/components/public-header-actions";

const steps = [
  ["01", "Connect Spotify", "Link your account and unlock listening data that moodfyr uses to make sharper recommendations."],
  ["02", "Describe the mood", "Write how you feel in a few words and let the system extract a useful mood signal from it."],
  ["03", "Play the match", "Get song picks that sound like your actual moment, not a generic playlist feed."],
];

const features = [
  [
    "Mood detection",
    "Mood analysis reads the energy, pace, and emotional tone of your text.",
  ],
  [
    "Spotify-aware picks",
    "Recommendations lean on your real taste, not just broad mood playlists.",
  ],
  [
    "Instant session flow",
    "Move from feeling to song selection without manual searching or playlist hopping.",
  ],
];

const previewTracks = [
  ["Khruangbin", "warm night groove", "96% match"],
  ["Tom Misch", "laid-back pulse", "92% match"],
  ["Men I Trust", "late calm shimmer", "89% match"],
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041108] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(29,185,84,0.34),_transparent_36%),radial-gradient(circle_at_82%_20%,_rgba(16,185,129,0.28),_transparent_34%),linear-gradient(160deg,_#041108_0%,_#0a1c12_38%,_#03170d_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-8 lg:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] text-base font-black text-[#03170d]">
                M
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">moodfyr</p>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  landing
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/how-it-works"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                How it works
              </Link>
              <PublicHeaderActions />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
              moodfyr workspace
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Music that matches the same energy as your dashboard.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl">
              Moodfyr connects Spotify, reads mood from natural language, and
              returns song picks in the same intense, dark, focused atmosphere
              as the rest of the product.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-300/20 px-4 py-2 text-sm font-semibold text-emerald-100">
                Spotify connection
              </span>
              <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white/80">
                Mood classification
              </span>
              <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white/80">
                Personalized song picks
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/register"
<<<<<<< Updated upstream
                className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-8 py-4 text-base font-black tracking-wide text-[#03220f] shadow-[0_18px_45px_rgba(30,215,96,0.45)] transition hover:scale-[1.01] hover:bg-[#25e56b] hover:shadow-[0_24px_60px_rgba(30,215,96,0.55)]"
=======
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
=======
import { PublicHeaderActions } from "@/components/public-header-actions";

const steps = [
  ["01", "Connect Spotify", "Link your account and unlock listening data that moodfyr uses to make sharper recommendations."],
  ["02", "Describe the mood", "Write how you feel in a few words and let the system extract a useful mood signal from it."],
  ["03", "Play the match", "Get song picks that sound like your actual moment, not a generic playlist feed."],
];

const features = [
  ["Mood detection", "Mood analysis reads the energy, pace, and emotional tone of your text."],
  ["Spotify-aware picks", "Recommendations lean on your real taste, not just broad mood playlists."],
  ["Instant session flow", "Move from feeling to song selection without manual searching or playlist hopping."],
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041108] text-white">
      
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(29,185,84,0.35),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.25),_transparent_40%),linear-gradient(160deg,_#041108_0%,_#071a10_40%,_#03170d_100%)]" />
      <div className="pointer-events-none absolute left-[-80px] top-[120px] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-60px] bottom-[60px] h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">

        {/* HEADER */}
        <header className="mb-10 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] font-black text-[#03170d]">
              M
            </div>
            <div>
              <p className="text-lg font-semibold">moodfyr</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                landing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/how-it-works" className="text-sm text-white/70 hover:text-white transition">
              How it works
            </Link>
            <PublicHeaderActions />
          </div>
        </header>

        {/* HERO */}
        <section className="grid items-center gap-10 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
              moodfyr workspace
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Music that matches
              <span className="block text-emerald-400">your exact mood</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed">
              Moodfyr connects to Spotify, reads your mood from natural language,
              and delivers songs that feel like your current moment — not generic playlists.
            </p>

            {/* TAGS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Spotify connection", "Mood AI", "Personalized picks"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-4">
              <Link
                href="/register"
                className="rounded-full bg-[#1ed760] px-8 py-4 font-bold text-[#03220f] shadow-[0_10px_40px_rgba(30,215,96,0.5)] hover:scale-[1.02] transition"
>>>>>>> Stashed changes
>>>>>>> Stashed changes
              >
                Start now
              </Link>

              <Link
                href="/login"
<<<<<<< Updated upstream
                className="rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                I already have an account
=======
<<<<<<< Updated upstream
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                Imam že račun
=======
                className="rounded-full border border-white/20 px-8 py-4 text-white/80 hover:bg-white/10 transition"
              >
                Login
>>>>>>> Stashed changes
>>>>>>> Stashed changes
              </Link>
            </div>
          </div>

<<<<<<< Updated upstream
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {steps.map(([step, title, copy]) => (
=======
<<<<<<< Updated upstream
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["1", "Poveži Spotify", "sinhroniziraj okus in navade poslušanja"],
                ["2", "Opiši občutek", "napiši svoj mood v nekaj besedah"],
                ["3", "Poslušaj predloge", "dobi skladbe, ki zadenejo trenutek"],
              ].map(([step, title, copy]) => (
>>>>>>> Stashed changes
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-xs font-black tracking-[0.2em] text-emerald-200/65">
                    {step}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">{copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0.03)_100%)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/65">
                    Live Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Mood Engine
                  </h2>
                </div>
                <div className="rounded-full bg-[#1db954] px-4 py-2 text-sm font-black text-[#03220f]">
                  Spotify linked
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
                <p className="text-sm font-semibold text-white/60">
                  How are you feeling?
                </p>
                <p className="mt-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-base leading-7 text-white/88">
                  I am a little tired today, but I want something warm,
                  uplifting, and calm enough for an evening walk.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["calm", "warm", "hopeful", "evening walk"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-medium text-emerald-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {previewTracks.map(([artist, vibe, score]) => (
                  <div
                    key={artist}
                    className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,_#1db954,_#facc15)]" />
                      <div>
                        <p className="font-semibold text-white">{artist}</p>
                        <p className="text-sm text-white/55">{vibe}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-200">
                      {score}
                    </p>
=======
          {/* RIGHT VISUAL (replacing preview) */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="space-y-4">

                {["calm", "warm", "focused", "night drive"].map((mood) => (
                  <div key={mood} className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-4 border border-white/5">
                    <span className="text-white/80">{mood}</span>
                    <span className="text-emerald-400 text-sm">detected</span>
>>>>>>> Stashed changes
                  </div>
                ))}

              </div>

              <div className="mt-6 text-center text-sm text-white/50">
                Mood engine simulation
              </div>
            </div>
          </article>
        </section>

<<<<<<< Updated upstream
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
=======
<<<<<<< Updated upstream
        <section className="border-t border-slate-200/80 py-12">
>>>>>>> Stashed changes
          <AuthStatus />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map(([title, copy]) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/65">
                Feature
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                {title}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/68">{copy}</p>
            </article>
=======
        {/* STEPS */}
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(([step, title, copy]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition">
              <p className="text-xs text-emerald-300/70 font-bold">{step}</p>
              <h2 className="mt-2 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-white/65">{copy}</p>
            </div>
>>>>>>> Stashed changes
          ))}
        </section>

        {/* FEATURES */}
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map(([title, copy]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-3 text-white/65">{copy}</p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}