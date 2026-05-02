import Link from "next/link";
import { PublicHeaderActions } from "@/components/public-header-actions";

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
                  how it works
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
              >
                Back to home
              </Link>
              <PublicHeaderActions />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.84fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-300/14 px-4 py-2 text-sm font-medium text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-[#1db954]" />
              From feeling to the right song in four steps
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              This is how moodfyr turns
              <span className="block text-emerald-300">your mood into music.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              The flow is designed to feel fast and natural. Instead of digging
              through genres or playlists, the user simply says how they feel.
              moodfyr turns that into recommendations that fit the moment.
            </p>

            <div className="mt-10 grid gap-4">
              {steps.map((step) => (
                <article
                  key={step.label}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1db954] text-sm font-black text-[#03220f]">
                      {step.label}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-white">
                        {step.title}
                      </h2>
                      <p className="mt-3 text-base leading-7 text-white/65">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0.03)_100%)] p-6">
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
                      className="rounded-3xl border border-white/10 bg-black/20 p-4"
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
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/65">
                Why it works
              </p>
              <p className="mt-4 text-base leading-7 text-white/68">
                The user reaches music that matches their current state faster,
                without long searches and without falling back to generic
                playlists.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
                >
                  Back to home
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
                >
                  Open dashboard
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
