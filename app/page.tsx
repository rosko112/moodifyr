import Link from "next/link";
import { AuthStatus } from "@/components/auth-status";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_55%,_#ffffff_100%)] px-6 py-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.24),_transparent_52%),radial-gradient(circle_at_18%_18%,_rgba(251,191,36,0.18),_transparent_24%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] text-lg font-black text-white shadow-[0_10px_30px_rgba(29,185,84,0.35)]">
              M
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950">
                modifyr
              </p>
              <p className="text-sm text-slate-500">mood to music, instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Register
            </Link>
          </div>
        </header>

        <section className="grid gap-12 py-14 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              <span className="h-2 w-2 rounded-full bg-[#1db954]" />
              Spotify povezava + zaznavanje razpoloženja + priporočila pesmi
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              Glasba, ki razume,
              <span className="block text-[#1db954]">kako se počutiš.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Modifyr uporabniku omogoča, da poveže Spotify račun, opiše svoje
              trenutno počutje in dobi pesmi, ki se ujemajo z njegovim vibeom.
              Naslovnica je odprta vsem, funkcionalnosti aplikacije pa so na
              voljo po prijavi.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                Začni zdaj
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                Imam že račun
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["1", "Poveži Spotify", "sinhroniziraj okus in navade poslušanja"],
                ["2", "Opiši občutek", "napiši svoj mood v nekaj besedah"],
                ["3", "Poslušaj predloge", "dobi skladbe, ki zadenejo trenutek"],
              ].map(([step, title, copy]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-sm font-semibold text-[#1db954]">
                    Korak {step}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="preview"
            className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,_rgba(15,23,42,0.97)_0%,_rgba(30,41,59,0.97)_100%)] p-5 shadow-[0_35px_90px_rgba(15,23,42,0.28)]"
          >
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                    Live Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Tvoj mood engine
                  </h2>
                </div>
                <div className="rounded-full bg-[#1db954] px-4 py-2 text-sm font-semibold text-slate-950">
                  Spotify linked
                </div>
              </div>

              <div className="mt-8 rounded-[1.4rem] bg-white p-5 text-slate-900">
                <p className="text-sm font-semibold text-slate-500">
                  Kako se počutiš?
                </p>
                <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-4 text-base leading-7 text-slate-700">
                  Danes sem malo utrujen, ampak bi rad nekaj toplega,
                  uplifting in dovolj umirjenega za večerni sprehod.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["calm", "warm", "hopeful", "evening walk"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  ["Sunset Rollercoaster", "soft indie glow", "94% match"],
                  ["Tom Misch", "warm groove", "91% match"],
                  ["Men I Trust", "late-night calm", "89% match"],
                ].map(([artist, vibe, score]) => (
                  <div
                    key={artist}
                    className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/6 px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,_#1db954,_#f59e0b)]" />
                      <div>
                        <p className="font-semibold text-white">{artist}</p>
                        <p className="text-sm text-white/55">{vibe}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#86efac]">
                      {score}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/80 py-12">
          <AuthStatus />
        <section className="grid gap-6 border-t border-slate-200/80 py-12 lg:grid-cols-3">
          {[
            [
              "Mood detection",
              "Analiza opisa razpoloženja prepozna energijo, tempo in emocionalni ton.",
            ],
            [
              "Pametno ujemanje",
              "Predlogi so usklajeni s tvojim trenutnim počutjem in navadami na Spotifyju.",
            ],
            [
              "Playlist-ready rezultat",
              "Uporabnik dobi takojšnje predloge za poslušanje brez ročnega iskanja.",
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1db954]">
                Feature
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
