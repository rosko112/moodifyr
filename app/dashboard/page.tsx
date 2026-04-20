import Link from "next/link";

const moodHistory = [
  { time: "08:12", mood: "focused", detail: "deep work block", tracks: 14 },
  { time: "11:40", mood: "uplift", detail: "post-meeting reset", tracks: 9 },
  { time: "15:05", mood: "calm", detail: "light afternoon", tracks: 11 },
  { time: "20:18", mood: "reflective", detail: "evening walk", tracks: 13 },
];

const recommendations = [
  {
    title: "Tom Misch - It Runs Through Me",
    vibe: "warm groove, medium energy",
    match: "97%",
    duration: "4:58",
  },
  {
    title: "FKJ - Ylang Ylang",
    vibe: "calm focus, instrumental",
    match: "95%",
    duration: "3:44",
  },
  {
    title: "Men I Trust - Show Me How",
    vibe: "soft evening, dreamy",
    match: "92%",
    duration: "3:38",
  },
  {
    title: "Khruangbin - Friday Morning",
    vibe: "relaxed drive, bright",
    match: "89%",
    duration: "6:49",
  },
];

export default function DashboardPage() {
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

          <nav className="mt-8 grid gap-2 text-sm">
            {[
              "Overview",
              "Mood Input",
              "Recommendations",
              "History",
              "Spotify Sync",
            ].map((item, i) => (
              <button
                key={item}
                className={`rounded-2xl px-4 py-3 text-left transition ${
                  i === 0
                    ? "bg-[#1db954] font-semibold text-[#03220f]"
                    : "bg-white/0 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>

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

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mood Input</h2>
                <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  AI ready
                </span>
              </div>
              <label className="mt-4 block text-sm text-white/75" htmlFor="mood">
                Describe how you feel right now
              </label>
              <textarea
                id="mood"
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#1db954] focus:outline-none"
                placeholder="Example: I am a bit tired but want warm songs for an evening walk."
                defaultValue="Calm but motivated. Need warm songs with steady tempo for focused work."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {["calm", "focused", "warm", "mid-tempo"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-bold text-[#03220f] transition hover:bg-[#25cf61]"
                >
                  Generate recommendations
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Save as mood preset
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h2 className="text-xl font-semibold">Today at a glance</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Moods logged", "7"],
                  ["Songs suggested", "52"],
                  ["Top match avg", "93%"],
                  ["Sessions", "4"],
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
          </div>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Recommended songs</h2>
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:bg-white/10"
              >
                Add all to playlist
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {recommendations.map((song) => (
                <div
                  key={song.title}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold">{song.title}</p>
                    <p className="text-sm text-white/65">{song.vibe}</p>
                  </div>
                  <div className="flex items-center gap-5 text-sm">
                    <span className="text-emerald-200">{song.match}</span>
                    <span className="text-white/70">{song.duration}</span>
                    <button
                      type="button"
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold transition hover:bg-white/20"
                    >
                      Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-xl font-semibold">Mood history</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-white/60">
                    <th className="px-3 py-2 font-medium">Time</th>
                    <th className="px-3 py-2 font-medium">Mood</th>
                    <th className="px-3 py-2 font-medium">Context</th>
                    <th className="px-3 py-2 font-medium">Suggested songs</th>
                  </tr>
                </thead>
                <tbody>
                  {moodHistory.map((entry) => (
                    <tr key={`${entry.time}-${entry.mood}`} className="border-t border-white/10">
                      <td className="px-3 py-3 text-white/75">{entry.time}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                          {entry.mood}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-white/80">{entry.detail}</td>
                      <td className="px-3 py-3 text-white/80">{entry.tracks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
