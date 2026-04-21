import Link from "next/link";

const steps = [
  {
    label: "01",
    title: "Connect your Spotify account",
    description:
      "Sign in through Spotify OAuth so moodfyr can understand your listening taste and playback habits.",
  },
  {
    label: "02",
    title: "Describe how you feel",
    description:
      "Write your current mood, energy, or situation in a few words, such as a calm evening, workout motivation, or a low-energy day.",
  },
  {
    label: "03",
    title: "moodfyr detects the mood",
    description:
      "The system reads tone, intensity, and atmosphere from your text and maps them to musical traits that fit the moment.",
  },
  {
    label: "04",
    title: "Get recommended songs",
    description:
      "The app suggests artists, tracks, and vibe-based picks that match your mood and align with your Spotify profile.",
  },
];

const examples = [
  ["Mood", "Sleepy, slightly melancholic, but I want something warm."],
  ["Detected mood", "Calm / reflective / warm"],
  ["Suggested artists", "Phoebe Bridgers, Cigarettes After Sex, Bon Iver"],
];

export default function HowItWorksPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(29,185,84,0.18),_transparent_28%),radial-gradient(circle_at_left,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_48%,_#ffffff_100%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] text-lg font-black text-white shadow-[0_10px_30px_rgba(29,185,84,0.35)]">
              M
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950">
                moodfyr
              </p>
              <p className="text-sm text-slate-500">How it works</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Back to landing page
          </Link>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-[#1db954]" />
              From feeling to the right song in four steps
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
              This is how moodfyr turns
              <span className="block text-[#1db954]">your mood into music.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              The flow is built to feel fast and natural. Instead of searching
              through genres or playlists, the user simply says how they feel.
              moodfyr then turns that into recommendations that fit the moment.
            </p>

            <div className="mt-10 grid gap-4">
              {steps.map((step) => (
                <article
                  key={step.label}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                      {step.label}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                        {step.title}
                      </h2>
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sticky top-8">
            <div className="rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(30,41,59,0.98)_100%)] p-5 shadow-[0_35px_90px_rgba(15,23,42,0.22)]">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                  Example flow
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  What does the user actually do?
                </h2>

                <div className="mt-8 grid gap-4">
                  {examples.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/10 bg-white/6 p-4"
                    >
                      <p className="text-sm font-semibold text-white/55">
                        {label}
                      </p>
                      <p className="mt-2 text-base leading-7 text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.6rem] bg-white p-5 text-slate-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Why this is useful
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    The user reaches music that matches their current state
                    faster, without long searches and without falling back to
                    generic playlists.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-[#1db954] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#19a74c]"
                  >
                    Back to home
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                  >
                    Connect Spotify
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
