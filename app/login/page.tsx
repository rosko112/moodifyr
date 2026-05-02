import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentSessionUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/neon";

const highlights = [
  ["Private dashboard", "Track your mood history and saved tracks in one place."],
  ["Mood input", "Describe how you feel and instantly get matching songs."],
  ["Spotify sync", "Your real taste shapes every recommendation."],
];

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  server: "Login failed on the server. Please try again.",
  auth: "Incorrect email, username, or password.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentSessionUser();
  if (user) redirect("/dashboard");

  const resolvedParams = searchParams ? await searchParams : undefined;
  const errorKey = resolvedParams?.error ?? "";
  const initialError = errorKey ? errorMessages[errorKey] : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041108] text-white">
      
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(29,185,84,0.35),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.25),_transparent_40%),linear-gradient(160deg,_#041108_0%,_#071a10_40%,_#03170d_100%)]" />
      <div className="pointer-events-none absolute left-[-80px] top-[120px] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-60px] bottom-[60px] h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">

        <div className="grid w-full gap-10 lg:grid-cols-2 items-center">

          {/* LEFT SIDE */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1db954] font-black text-[#03170d]">
                  M
                </div>
                <div>
                  <p className="text-lg font-semibold">moodfyr</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                    login
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="text-sm text-white/60 hover:text-white transition"
              >
                Back
              </Link>
            </div>

            {/* HERO TEXT */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/70">
                welcome back
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl font-black leading-tight tracking-[-0.04em]">
                Continue your
                <span className="block text-emerald-400">music flow</span>
              </h1>

              <p className="mt-5 max-w-md text-white/70 leading-relaxed">
                Jump back into your mood-based recommendations and keep the vibe going without searching.
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10 transition"
                >
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-2 text-xs text-white/60">{copy}</p>
                </div>
              ))}
            </div>

          </section>

          {/* RIGHT SIDE FORM */}
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <AuthForm
                mode="login"
                isDatabaseConfigured={isDatabaseConfigured}
                initialError={initialError}
              />
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}