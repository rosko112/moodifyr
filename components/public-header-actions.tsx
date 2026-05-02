import Link from "next/link";

export function PublicHeaderActions() {
  return (
    <>
      <Link
        href="/login"
        className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/45 hover:bg-white/10"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200/40 bg-[#1ed760] px-6 py-3 text-sm font-black tracking-wide text-[#03220f] shadow-[0_12px_30px_rgba(30,215,96,0.35)] transition hover:bg-[#25e56b]"
      >
        Register
      </Link>
    </>
  );
}
