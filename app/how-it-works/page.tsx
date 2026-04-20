import Link from "next/link";

const steps = [
  {
    label: "01",
    title: "Poveži svoj Spotify račun",
    description:
      "Uporabnik se prijavi prek Spotify OAuth povezave, da lahko moodfyr razume njegov glasbeni okus in navade poslušanja.",
  },
  {
    label: "02",
    title: "Napiši, kako se počutiš",
    description:
      "V nekaj besedah opišeš svoje trenutno razpoloženje, energijo ali situacijo, na primer: miren večer, motivacija za trening ali žalosten dan.",
  },
  {
    label: "03",
    title: "moodfyr zazna mood",
    description:
      "Sistem iz opisa razbere ton, intenzivnost in atmosfero ter jih poveže s primernimi glasbenimi lastnostmi.",
  },
  {
    label: "04",
    title: "Dobiš priporočene pesmi",
    description:
      "Aplikacija predlaga izvajalce, komade ali vibe-based sezname, ki ustrezajo tvojemu počutju in se lepo ujemajo s tvojim Spotify profilom.",
  },
];

const examples = [
  ["Počutje", "Zaspan, malo melanholičen, ampak želim nekaj toplega."],
  ["Zaznan mood", "Calm / reflective / warm"],
  ["Predlog", "Phoebe Bridgers, Cigarettes After Sex, Bon Iver"],
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
              <p className="text-sm text-slate-500">Kako deluje</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
          >
            Nazaj na landing page
          </Link>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-[#1db954]" />
              Od občutka do prave pesmi v štirih korakih
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
              Tako moodfyr pretvori
              <span className="block text-[#1db954]">
                tvoje razpoloženje v glasbo.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Stran je zasnovana za hiter in naraven flow. Uporabnik ne išče po
              žanrih ali playlistah, ampak samo pove, kako se počuti. moodfyr
              nato iz tega sestavi priporočila, ki bolj zadenejo trenutek.
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
                  Primer flowa
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Kaj uporabnik dejansko naredi?
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
                    Zakaj je to uporabno
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    Uporabnik hitreje pride do glasbe, ki ustreza njegovemu
                    trenutnemu stanju, brez dolgega iskanja in brez generičnih
                    playlist.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-[#1db954] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#19a74c]"
                  >
                    Nazaj na naslovnico
                  </Link>
                  <Link
                    href="/#connect"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                  >
                    Poveži Spotify
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

