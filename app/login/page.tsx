import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_100%)] px-6 py-10">
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="max-w-xl">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            Nazaj na naslovnico
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Login
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] text-slate-950">
            Prijavi se v
            <span className="block text-emerald-600">modifyr.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Po prijavi lahko uporabnik poveže Spotify, opiše svoje počutje in
            dobi priporočila pesmi glede na trenutno razpoloženje.
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </main>
  );
}
